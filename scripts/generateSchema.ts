import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import ts from "typescript";
import { parse } from "comment-parser"; // Parses JSDoc comments
import OpenAPISchemaValidator from "openapi-schema-validator";

/**
 * Parse exported interfaces, type aliases, and enums into JSON Schemas.
 */
function parseSchemas(sourceFile: ts.SourceFile): Record<string, any> {
  const schemas: Record<string, any> = {};

  function visit(node: ts.Node) {
    // Handle exported interfaces.
    if (ts.isInterfaceDeclaration(node)) {
      if (
        !node.modifiers ||
        !node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      ) {
        return;
      }
      const name = node.name.text;
      const properties: Record<string, any> = {};

      node.members.forEach((member) => {
        if (
          ts.isPropertySignature(member) &&
          member.type &&
          ts.isIdentifier(member.name)
        ) {
          const propName = member.name.text;
          const propSchema = parseType(member.type, sourceFile);
          properties[propName] = propSchema;
        }
      });

      if (name !== "ConnectedXMResponse") {
        schemas[name] = {
          type: "object",
          properties,
        };
      }
    }

    // Handle exported enums.
    if (ts.isEnumDeclaration(node)) {
      if (
        !node.modifiers ||
        !node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      ) {
        return;
      }
      const name = node.name.text;
      const enumValues: (string | number)[] = [];

      node.members.forEach((member) => {
        let value: string | number;
        if (member.initializer) {
          if (
            ts.isStringLiteral(member.initializer) ||
            ts.isNumericLiteral(member.initializer)
          ) {
            value = member.initializer.text;
          } else {
            value = member.initializer.getText(sourceFile);
          }
        } else {
          value = member.name.getText(sourceFile);
        }
        enumValues.push(value);
      });

      schemas[name] = {
        type: typeof enumValues[0] === "number" ? "number" : "string",
        enum: enumValues,
      };
    }

    // Handle exported type aliases.
    if (ts.isTypeAliasDeclaration(node)) {
      if (
        !node.modifiers ||
        !node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      ) {
        return;
      }
      const name = node.name.text;
      // Use parseType to convert the alias to a schema fragment.
      schemas[name] = parseType(node.type, sourceFile);
    }

    ts.forEachChild(node, visit);
  }

  ts.forEachChild(sourceFile, visit);
  return schemas;
}

/**
 * Recursively convert a TypeScript TypeNode into a JSON Schema fragment.
 */
function parseType(typeNode: ts.TypeNode, sourceFile: ts.SourceFile): any {
  const rawText = typeNode.getText(sourceFile).trim();

  // Handle the special case where a union is embedded in a single type node,
  // e.g. "keyof typeof AccountType | null"
  if (rawText.includes("|") && rawText.startsWith("keyof typeof ")) {
    const unionParts = rawText.split("|").map((part) => part.trim());
    const isNullable = unionParts.includes("null");
    const nonNullParts = unionParts.filter((part) => part !== "null");
    if (nonNullParts.length === 1 && isNullable) {
      // Remove the "keyof typeof " prefix from the non-null part
      const enumName = nonNullParts[0]!.replace("keyof typeof ", "").trim();
      return {
        allOf: [{ $ref: `#/components/schemas/${enumName}` }],
        nullable: true,
      };
    }
  }

  // Standard handling for union types.
  if (ts.isUnionTypeNode(typeNode)) {
    const types = typeNode.types.map((t) => t.getText(sourceFile).trim());
    const isNullable = types.includes("null");
    const nonNullTypes = typeNode.types.filter(
      (t) => t.getText(sourceFile).trim() !== "null"
    );
    if (nonNullTypes.length === 1 && isNullable && nonNullTypes[0]) {
      const schema = parseType(nonNullTypes[0], sourceFile);
      if (schema.$ref) {
        return {
          allOf: [schema],
          nullable: true,
        };
      }
      return {
        ...schema,
        nullable: true,
      };
    }
    return { oneOf: typeNode.types.map((t) => parseType(t, sourceFile)) };
  }

  // Handle "keyof typeof" for non-union types.
  if (rawText.startsWith("keyof typeof ")) {
    const enumName = rawText.replace("keyof typeof ", "").trim();
    return { $ref: `#/components/schemas/${enumName}` };
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = typeNode.typeName.getText(sourceFile);
    return { $ref: `#/components/schemas/${typeName}` };
  }

  if (ts.isArrayTypeNode(typeNode)) {
    return {
      type: "array",
      items: parseType(typeNode.elementType, sourceFile),
    };
  }

  if (ts.isLiteralTypeNode(typeNode)) {
    return {
      enum: [typeNode.literal.getText(sourceFile).replace(/"/g, "")],
    };
  }

  const typeMap: Record<string, string> = {
    string: "string",
    number: "number",
    boolean: "boolean",
    any: "object",
    null: "null",
  };

  return { type: typeMap[rawText] || "object" };
}

const GetTypeSchema = (responseType: string): any => {
  if (responseType.startsWith("keyof typeof")) {
    responseType = responseType.replace("keyof typeof ", "");
  }

  if (responseType === "null") {
    return { nullable: true };
  }
  if (responseType === "string") {
    return { type: "string" };
  }
  if (responseType === "number") {
    return { type: "number" };
  }
  if (responseType === "boolean") {
    return { type: "boolean" };
  }
  if (responseType === "any") {
    return { type: "object" };
  }

  // Handle union types (e.g., "string | null")
  const unionTypes = responseType.split("|").map((t) => t.trim());
  if (unionTypes.includes("null")) {
    return {
      type: unionTypes.find((t) => t !== "null") || "object",
      nullable: true,
    };
  }

  if (responseType.endsWith("[]")) {
    return {
      type: "array",
      items: GetTypeSchema(responseType.replace("[]", "")),
    };
  }

  return { $ref: `#/components/schemas/${responseType}` };
};

// LOAD INTERFACES
const interfacesFilePath = path.join(__dirname, "../src/interfaces.ts");
const interfacesProgram = ts.createProgram([interfacesFilePath], {});
const interfacesFile = interfacesProgram.getSourceFile(interfacesFilePath);
if (!interfacesFile) {
  throw new Error(`Failed to load TypeScript file at ${interfacesFilePath}`);
}
const interfacesSchemas = parseSchemas(interfacesFile);

// LOAD PARAMS
const paramsFilePath = path.join(__dirname, "../src/params.ts");
const paramsProgram = ts.createProgram([paramsFilePath], {});
const paramsFile = paramsProgram.getSourceFile(paramsFilePath);
if (!paramsFile) {
  throw new Error(`Failed to load TypeScript file at ${paramsFilePath}`);
}
const paramsSchemas = parseSchemas(paramsFile);

// OpenAPI Spec Structure – assign the parsed schemas directly.
const openApiSpec: any = {
  openapi: "3.0.1",
  info: {
    title: "Connected Admin API",
    version: "1.0.0",
    description:
      "The Admin API allows you to manage your Connected community programmatically.",
  },
  servers: [
    {
      url: "https://admin-api.connected.dev",
      description: "Production server",
    },
    {
      url: "https://admin-api.staging.connected.dev",
      description: "Staging server",
    },
  ],
  paths: {},
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "api-key",
        description: "All requests must include an API key.",
      },
      OrganizationId: {
        type: "apiKey",
        in: "header",
        name: "organization",
        description: "Most requests must include an organization ID.",
      },
    },
    schemas: {
      ...interfacesSchemas,
      ...paramsSchemas,
    },
  },
  security: [
    {
      ApiKeyAuth: [],
      OrganizationId: [],
    },
  ],
};

// Function to extract API details from query files.
function extractApiDetails(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const minified = fileContent.replace(/\s+/g, "");

  // EXTRACT API PATH
  let apiPath = fileContent.match(/`(.*?)`/)?.[1];
  if (!apiPath) throw new Error(`API path not found in ${filePath}`);
  apiPath = apiPath.replaceAll("${", "{");

  // EXTRACT API METHOD
  const method = fileContent.match(/adminApi\.(get|post|put|delete)/)?.[1];
  if (!method) throw new Error(`HTTP method not found in ${filePath}`);

  // EXTRACT NAME AND DESCRIPTION FROM COMMENTS
  const parsedComments = parse(fileContent);
  const comments = parsedComments[0];
  if (!comments) throw new Error(`Comments not found in ${filePath}`);

  const nameTag = comments.tags.find((tag) => tag.tag === "name");
  const name = nameTag ? nameTag.name : "";

  // Extract @param tags
  const paramsTags = comments.tags.filter((tag) => tag.tag === "param");

  const params = [];
  let body: Record<string, any> | undefined;
  // Process each @param tag to build a params array with extra info
  paramsTags.map((tag) => {
    // Determine if the parameter is optional by checking if the name is wrapped in square brackets
    const paramName = tag.name;
    const isOptional = tag.optional || false;

    const descriptionMatches = tag.description.match(/^\(([^)]+)\)\s*(.*)$/);
    const [, paramType, paramDescription] = descriptionMatches || [];
    if (!paramType) throw new Error(`Param type not found in ${filePath}`);
    if (!paramDescription)
      throw new Error(`Param description not found in ${filePath}`);

    if (paramType === "body") {
      body = GetTypeSchema(tag.type || "null");
    } else if (paramType === "bodyValue") {
      body = {
        ...(body || {}),
        properties: {
          ...(body?.properties || {}),
          [paramName]: GetTypeSchema(tag.type || "null"),
        },
      };
    } else if (paramType === "query" || paramType === "path") {
      params.push({
        in: paramType,
        name: paramName,
        schema: GetTypeSchema(tag.type || "null"), // e.g., "string"
        description: paramDescription,
        required: !isOptional,
      });
    } else {
      throw new Error(`Invalid param type: ${paramType} in ${filePath}`);
    }
  });

  const isInfiniteQuery = minified.includes("extendsInfiniteQueryParams");

  if (isInfiniteQuery) {
    params.push({
      in: "query",
      name: "page",
      schema: { type: "number", minimum: 1, default: 1 },
      description: "Page number",
      required: true,
    });
    params.push({
      in: "query",
      name: "pageSize",
      schema: { type: "number", minimum: 1, maximum: 100, default: 25 },
      description: "Number of items per page",
      required: true,
    });
    params.push({
      in: "query",
      name: "orderBy",
      schema: { type: "string" },
      description: "Field to order by",
      required: false,
    });
    params.push({
      in: "query",
      name: "search",
      schema: { type: "string" },
      description: "Search query",
      required: false,
    });
  }

  // EXTRACT RESPONSE TYPE WITH REGEX
  const responseTypeMatch = minified.match(
    /Promise<ConnectedXMResponse<([^>]+)>>/
  );
  if (!responseTypeMatch) {
    throw new Error(`Response type not found in ${filePath}`);
  }
  const responseType = responseTypeMatch[1];
  if (!responseType) throw new Error(`Response type not found in ${filePath}`);

  const responses: any = {
    200: {
      description: `Successful response`,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", enum: ["ok"] },
              message: { type: "string", example: "Success message." },
              data: GetTypeSchema(responseType),
            },
            required: ["status", "message", "data"],
          },
        },
      },
    },
  };

  if (isInfiniteQuery) {
    responses[200].content["application/json"].schema.properties.count = {
      type: "number",
      example: 100,
    };
  }

  let parentPath = filePath.split("queries")[1]?.split("/")[1];
  if (!parentPath) {
    parentPath = filePath.split("mutations")[1]?.split("/")[1];
  }
  if (!parentPath) throw new Error(`Parent path not found in ${filePath}`);
  parentPath = [
    parentPath?.split("")[0]?.toUpperCase() + parentPath.slice(1),
  ].join("");

  openApiSpec.paths[apiPath || filePath] = {
    ...openApiSpec.paths[apiPath || filePath],
    [method]: {
      summary: name,
      description: comments.description,
      parameters: params,
      requestBody: body
        ? {
            required: true,
            content: {
              "application/json": {
                schema: body,
              },
            },
          }
        : undefined,
      responses,
      tags: [parentPath],
    },
  };
}

// Use glob to get all relevant query files from queries and mutations.
const dir = path.join(__dirname, "../src");
const queries = glob.sync(path.join(dir, "{queries,mutations}/**/*.ts"), {
  ignore: [
    path.join(dir, "**/index.ts"),
    path.join(dir, "queries/useConnectedInfiniteQuery.ts"),
    path.join(dir, "queries/useConnectedSingleQuery.ts"),
    path.join(dir, "mutations/useConnectedMutation.ts"),
    path.join(dir, "**/*Translation*.ts"),
  ],
});

console.log(`📂 Found ${queries.length} files`);

queries.reverse().forEach((filePath) => {
  extractApiDetails(filePath);
});

// Save OpenAPI spec to a JSON file.
const outputPath = path.join(__dirname, "../openapi.json");
fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2));

const validator = new OpenAPISchemaValidator({
  version: 3,
});

console.log("🔍 Validating OpenAPI Spec...");
const { errors } = validator.validate(openApiSpec);

if (errors.length) {
  console.error("❌ OpenAPI Spec is invalid!");
  fs.writeFileSync(
    path.join(__dirname, "../openapi-errors.json"),
    JSON.stringify(errors, null, 2)
  );
} else {
  if (fs.existsSync(path.join(__dirname, "../openapi-errors.json"))) {
    fs.unlinkSync(path.join(__dirname, "../openapi-errors.json"));
  }
  console.log("✅ OpenAPI Spec valid!");
}
