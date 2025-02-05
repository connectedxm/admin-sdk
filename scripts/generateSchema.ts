import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import ts from "typescript";
import { parse } from "comment-parser"; // Parses JSDoc comments

/**
 * Parse exported interfaces, type aliases, and enums into JSON Schemas.
 */
function parseSchemas(sourceFile: ts.SourceFile): Record<string, any> {
  const schemas: Record<string, any> = {};

  function visit(node: ts.Node) {
    // Process exported interfaces.
    if (ts.isInterfaceDeclaration(node)) {
      if (
        !node.modifiers ||
        !node.modifiers.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
        )
      ) {
        return;
      }
      const name = node.name.text;

      if (name === "ConnectedXMResponse") {
        return;
      }

      const properties: Record<string, any> = {};

      node.members.forEach((member) => {
        if (
          ts.isPropertySignature(member) &&
          member.type &&
          ts.isIdentifier(member.name)
        ) {
          const propName = member.name.text;
          properties[propName] = parseType(member.type, sourceFile);
        }
      });

      schemas[name] = {
        type: "object",
        properties,
      };
    }

    // Process exported type aliases.
    if (ts.isTypeAliasDeclaration(node)) {
      if (
        !node.modifiers ||
        !node.modifiers.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
        )
      ) {
        return;
      }
      const name = node.name.text;
      const typeDefinition = parseType(node.type, sourceFile);
      schemas[name] = typeDefinition;
    }

    // Process exported enums.
    if (ts.isEnumDeclaration(node)) {
      if (
        !node.modifiers ||
        !node.modifiers.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
        )
      ) {
        return;
      }
      const name = node.name.text;
      const enumValues: (string | number)[] = [];

      node.members.forEach((member) => {
        let value: string | number;
        // If an initializer is provided, use it.
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
          // Otherwise, use the member name.
          value = member.name.getText(sourceFile);
        }
        enumValues.push(value);
      });

      schemas[name] = {
        type: "string", // Assuming string enums; adjust if necessary
        enum: enumValues,
      };
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
  if (ts.isTypeReferenceNode(typeNode)) {
    return {
      $ref: `#/components/schemas/${typeNode.typeName.getText(sourceFile)}`,
    };
  }
  if (ts.isUnionTypeNode(typeNode)) {
    return { oneOf: typeNode.types.map((t) => parseType(t, sourceFile)) };
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

  const text = typeNode.getText(sourceFile);
  const typeMap: Record<string, string> = {
    string: "string",
    number: "number",
    boolean: "boolean",
    any: "object",
    null: "null",
  };

  return { type: typeMap[text] || "object" };
}

const GetTypeSchema = (responseType: string) => {
  switch (responseType) {
    case "null":
      return { nullable: true };
    case "string":
      return { type: "string" };
    case "number":
      return { type: "number" };
    case "boolean":
      return { type: "boolean" };
    case "any":
      return { type: "object" };
    default:
      if (responseType.endsWith("[]")) {
        return {
          type: "array",
          items: {
            $ref: `#/components/schemas/${responseType.replace("[]", "")}`,
          },
        };
      } else {
        return {
          $ref: `#/components/schemas/${responseType}`,
        };
      }
  }
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
  openapi: "3.0.0",
  info: {
    title: "Admin SDK API",
    version: "1.0.0",
    description: "Auto-generated OpenAPI spec from TypeScript queries",
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
      OrganizationId: {
        type: "apiKey",
        in: "header",
        name: "organization",
      },
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "api-key",
      },
      TokenAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
      },
    },
    schemas: {
      ...interfacesSchemas,
      ...paramsSchemas,
    },
  },
  security: [
    {
      OrganizationId: [],
      ApiKeyAuth: [],
    },
    {
      OrganizationId: [],
      TokenAuth: [],
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

  // Process each @param tag to build a params array with extra info
  const params: any = paramsTags.map((tag) => {
    // Determine if the parameter is optional by checking if the name is wrapped in square brackets
    let paramName = tag.name;
    let isOptional = false;
    if (paramName.startsWith("[") && paramName.endsWith("]")) {
      isOptional = true;
      // Remove the square brackets from the name
      paramName = paramName.substring(1, paramName.length - 1);
    }
    const isPathParam = apiPath.includes(`{${paramName}}`);

    return {
      in: isPathParam ? "path" : "query",
      name: paramName,
      schema: GetTypeSchema(tag.type || "null"), // e.g., "string"
      description: tag.description,
      required: !isOptional,
    };
  });

  if (minified.includes("extendsInfiniteQueryParams")) {
    params.push({
      in: "query",
      name: "page",
      schema: { type: "number", minimum: 1, maximum: 100, default: 25 },
      description: "Page number",
      required: true,
    });
    params.push({
      in: "query",
      name: "pageSize",
      schema: { type: "number", minimum: 1, default: 1 },
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

  // params.push({
  //   in: "header",
  //   name: "organization",
  //   schema: { type: "string" },
  //   description: "Organization ID to use",
  //   required: true,
  // })

  // params.push({
  //   in: "header",
  //   name: "api-key",
  //   schema: { type: "string" },
  //   description: "API Key ",
  //   required: true,
  // })

  // EXTRACT RESPONSE TYPE WITH REGEX
  const responseTypeMatch = minified.match(
    /Promise<ConnectedXMResponse<([^>]+)>>/
  );
  if (!responseTypeMatch) {
    throw new Error(`Response type not found in ${filePath}`);
  }
  const responseType = responseTypeMatch[1];
  if (!responseType) throw new Error(`Response type not found in ${filePath}`);

  const multipleResponseTypes = responseType.includes("|");

  openApiSpec.paths[apiPath || filePath] = {
    ...openApiSpec.paths[apiPath || filePath],
    [method]: {
      summary: name,
      description: comments.description,
      parameters: params,
      responses: {
        200: {
          description: `Successful response`,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", enum: ["ok", "error"] },
                  message: { type: "string" },
                  count: { type: "number", nullable: true },
                  data: multipleResponseTypes
                    ? {
                        oneOf: responseType.split("|").map(GetTypeSchema),
                      }
                    : GetTypeSchema(responseType),
                },
                required: ["status", "message", "data"],
              },
            },
          },
        },
      },
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

console.log("✅ OpenAPI Spec generated!");
