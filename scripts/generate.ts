/* eslint-disable no-undef */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as glob from "glob";
import ts from "typescript";
import OpenAPISchemaValidatorModule from "openapi-schema-validator";
// Handle both default export and named export patterns
const OpenAPISchemaValidator =
  (OpenAPISchemaValidatorModule as any).default || OpenAPISchemaValidatorModule;

// ESM equivalent of __dirname
// @ts-expect-error - import.meta works with tsx
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      const required: string[] = [];

      node.members.forEach((member) => {
        if (
          ts.isPropertySignature(member) &&
          member.type &&
          ts.isIdentifier(member.name)
        ) {
          const propName = member.name.text;
          const propSchema = parseType(member.type, sourceFile);
          properties[propName] = propSchema;

          // If the property doesn't have a question mark, it's required
          if (!member.questionToken) {
            required.push(propName);
          }
        }
      });

      if (name !== "ConnectedXMResponse") {
        const schema: any = {
          type: "object",
          properties,
        };
        // Only add required array if there are required properties
        if (required.length > 0) {
          schema.required = required;
        }
        schemas[name] = schema;
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

    // Check if all non-null types are string literals -> convert to enum
    const allStringLiterals = nonNullTypes.every(
      (t) => ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal)
    );
    if (allStringLiterals && nonNullTypes.length > 0) {
      const enumValues = nonNullTypes.map((t) => {
        const literal = (t as ts.LiteralTypeNode).literal as ts.StringLiteral;
        return literal.text;
      });
      const schema: any = { type: "string", enum: enumValues };
      if (isNullable) {
        schema.nullable = true;
      }
      return schema;
    }

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

    // Filter out null from oneOf and add nullable instead
    if (isNullable) {
      const schemas = nonNullTypes.map((t) => parseType(t, sourceFile));
      if (schemas.length === 1) {
        return { ...schemas[0], nullable: true };
      }
      return { oneOf: schemas, nullable: true };
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

    // Handle TypeScript utility types
    if (typeName === "Record") {
      // Record<string, T> -> object with additionalProperties
      return { type: "object", additionalProperties: true };
    }
    if (
      typeName === "Omit" ||
      typeName === "Pick" ||
      typeName === "Partial" ||
      typeName === "Required"
    ) {
      // These utility types are complex - just treat as object
      return { type: "object" };
    }
    if (typeName === "Array") {
      // Array<T> -> array
      if (typeNode.typeArguments && typeNode.typeArguments.length > 0) {
        return {
          type: "array",
          items: parseType(typeNode.typeArguments[0]!, sourceFile),
        };
      }
      return { type: "array" };
    }
    if (typeName === "Promise") {
      // Unwrap Promise<T>
      if (typeNode.typeArguments && typeNode.typeArguments.length > 0) {
        return parseType(typeNode.typeArguments[0]!, sourceFile);
      }
      return { type: "object" };
    }
    if (
      typeName === "void" ||
      typeName === "never" ||
      typeName === "undefined"
    ) {
      return { type: "object" };
    }
    if (typeName === "true" || typeName === "false") {
      return { type: "boolean", enum: [typeName === "true"] };
    }

    return { $ref: `#/components/schemas/${typeName}` };
  }

  if (ts.isArrayTypeNode(typeNode)) {
    return {
      type: "array",
      items: parseType(typeNode.elementType, sourceFile),
    };
  }

  if (ts.isLiteralTypeNode(typeNode)) {
    const literalText = typeNode.literal.getText(sourceFile);
    // Handle boolean literals
    if (literalText === "true" || literalText === "false") {
      return { type: "boolean", enum: [literalText === "true"] };
    }
    // Handle numeric literals
    if (/^\d+$/.test(literalText)) {
      return { type: "integer", enum: [parseInt(literalText, 10)] };
    }
    return {
      type: "string",
      enum: [literalText.replace(/"/g, "").replace(/'/g, "")],
    };
  }

  // Handle inline object types like { questionId: string; value: string }
  if (ts.isTypeLiteralNode(typeNode)) {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    typeNode.members.forEach((member) => {
      if (ts.isPropertySignature(member) && member.type && member.name) {
        const propName = member.name.getText(sourceFile);
        properties[propName] = parseType(member.type, sourceFile);
        if (!member.questionToken) {
          required.push(propName);
        }
      }
    });

    const schema: any = { type: "object", properties };
    if (required.length > 0) {
      schema.required = required;
    }
    return schema;
  }

  // Handle parenthesized types
  if (ts.isParenthesizedTypeNode(typeNode)) {
    return parseType(typeNode.type, sourceFile);
  }

  // Handle intersection types (A & B)
  if (ts.isIntersectionTypeNode(typeNode)) {
    return {
      allOf: typeNode.types.map((t) => parseType(t, sourceFile)),
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
  if (responseType === "any" || responseType === "object") {
    return { type: "object" };
  }
  if (
    responseType === "void" ||
    responseType === "never" ||
    responseType === "undefined"
  ) {
    return { type: "object" };
  }

  // Handle union types (e.g., "string | null" or "\"public\" | \"private\"")
  if (responseType.includes("|")) {
    const unionTypes = responseType.split("|").map((t) => t.trim());
    const isNullable = unionTypes.includes("null");
    const nonNullTypes = unionTypes.filter((t) => t !== "null");

    // Check if all non-null types are string literals (quoted strings)
    const allStringLiterals = nonNullTypes.every(
      (t) =>
        (t.startsWith('"') && t.endsWith('"')) ||
        (t.startsWith("'") && t.endsWith("'"))
    );

    if (allStringLiterals && nonNullTypes.length > 0) {
      const enumValues = nonNullTypes.map((t) => t.replace(/^["']|["']$/g, ""));
      const schema: any = { type: "string", enum: enumValues };
      if (isNullable) {
        schema.nullable = true;
      }
      return schema;
    }

    // Simple nullable type
    if (isNullable && nonNullTypes.length === 1) {
      const baseSchema = GetTypeSchema(nonNullTypes[0]!);
      // If it's a $ref, we need to wrap in allOf to add nullable
      if (baseSchema.$ref) {
        return { allOf: [baseSchema], nullable: true };
      }
      return { ...baseSchema, nullable: true };
    }

    // Multiple types - use oneOf
    return { oneOf: nonNullTypes.map((t) => GetTypeSchema(t)) };
  }

  if (responseType.endsWith("[]")) {
    return {
      type: "array",
      items: GetTypeSchema(responseType.replace("[]", "")),
    };
  }

  // Handle quoted string literal (single value enum)
  if (
    (responseType.startsWith('"') && responseType.endsWith('"')) ||
    (responseType.startsWith("'") && responseType.endsWith("'"))
  ) {
    return { type: "string", enum: [responseType.replace(/^["']|["']$/g, "")] };
  }

  // If the type looks like raw TypeScript code or contains special characters,
  // just return a generic object type to avoid invalid refs
  if (
    responseType.includes("{") ||
    responseType.includes(";") ||
    responseType.includes(":") ||
    responseType === "true" ||
    responseType === "false" ||
    responseType === "null"
  ) {
    return { type: "object" };
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
// Track all unique tags for root-level tags array
const usedTags = new Set<string>();

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
  tags: [], // Will be populated after processing all files
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

/**
 * Convert a function name like "GetAccount" or "UpdateEventSession" to a human-readable summary.
 * e.g., "GetAccount" -> "Get Account", "UpdateEventSession" -> "Update Event Session"
 */
function functionNameToSummary(name: string): string {
  // Insert space before each capital letter (except the first one)
  return name.replace(/([A-Z])/g, " $1").trim();
}

/**
 * Normalize a tag to consistent plural lowercase form.
 * Handles common singular/plural variations.
 */
function normalizeTag(tag: string): string {
  // Convert to lowercase
  let normalized = tag.toLowerCase();

  // Handle hyphenated tags - convert to camelCase
  if (normalized.includes("-")) {
    normalized = normalized
      .split("-")
      .map((part, i) =>
        i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join("");
  }

  // Common singular -> plural mappings
  const singularToPlural: Record<string, string> = {
    account: "accounts",
    activation: "activations",
    activity: "activities",
    advertisement: "advertisements",
    announcement: "announcements",
    attendee: "attendees",
    benefit: "benefits",
    booking: "bookings",
    channel: "channels",
    cohost: "coHosts",
    dashboard: "dashboards",
    email: "emails",
    event: "events",
    file: "files",
    followup: "followups",
    group: "groups",
    image: "images",
    import: "imports",
    integration: "integrations",
    interest: "interests",
    invoice: "invoices",
    level: "levels",
    login: "logins",
    meeting: "meetings",
    module: "modules",
    notification: "notifications",
    organization: "organizations",
    package: "packages",
    pass: "passes",
    payment: "payments",
    preference: "preferences",
    question: "questions",
    registration: "registrations",
    report: "reports",
    reservation: "reservations",
    section: "sections",
    series: "series",
    session: "sessions",
    sideeffect: "sideEffects",
    speaker: "speakers",
    sponsorshiplevel: "sponsorshipLevels",
    storage: "storage",
    stream: "streams",
    subscription: "subscriptions",
    supportticket: "supportTickets",
    survey: "surveys",
    tier: "tiers",
    thread: "threads",
    ticket: "tickets",
    translation: "translations",
    transfer: "transfers",
    user: "users",
    video: "videos",
  };

  // Check if it's a known singular form
  if (singularToPlural[normalized]) {
    normalized = singularToPlural[normalized] ?? normalized;
  }

  // Capitalize first letter for OpenAPI tag
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

/**
 * Extract hierarchical tag from file path using :: separator.
 * e.g., "src/queries/events/passes/useGetEventPasses.ts" -> "Events::Passes"
 * e.g., "src/queries/accounts/useGetAccount.ts" -> "Accounts"
 */
function extractTagFromPath(filePath: string): string {
  let pathAfterType = filePath.split("queries")[1];
  if (!pathAfterType) {
    pathAfterType = filePath.split("mutations")[1];
  }
  if (!pathAfterType) {
    return "General";
  }

  // Split into parts: ["", "events", "passes", "useGetEventPasses.ts"]
  const parts = pathAfterType.split("/").filter((p) => p && !p.endsWith(".ts"));
  
  if (parts.length === 0) {
    return "General";
  }

  // Build hierarchical tag: normalize each part and join with ::
  const tagParts = parts.map((part) => normalizeTag(part));
  
  // Return hierarchical tag (e.g., "Events::Passes" or just "Accounts")
  return tagParts.join("::");
}

/**
 * Extract path parameters from a URL template string.
 * e.g., "/accounts/${accountId}/events/${eventId}" -> ["accountId", "eventId"]
 */
function extractPathParams(urlTemplate: string): string[] {
  const params: string[] = [];
  const regex = /\$\{(\w+)\}/g;
  let match;
  while ((match = regex.exec(urlTemplate)) !== null) {
    if (match[1]) {
      params.push(match[1]);
    }
  }
  return params;
}

/**
 * Find the interface that a function's parameter extends from.
 * Returns info about whether it's an infinite query, single query, or mutation.
 */
interface FunctionInfo {
  functionName: string;
  isInfiniteQuery: boolean;
  isSingleQuery: boolean;
  isMutation: boolean;
  paramsInterfaceName: string | null;
  responseType: string | null;
  apiPath: string | null;
  httpMethod: string | null;
  bodyParamName: string | null;
  bodyTypeName: string | null;
  pathParams: string[];
  queryParams: Array<{ name: string; type: string; optional: boolean }>;
}

/**
 * Parse a TypeScript file and extract API details using AST.
 */
function extractApiDetailsFromAST(filePath: string): FunctionInfo | null {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  let result: FunctionInfo = {
    functionName: "",
    isInfiniteQuery: false,
    isSingleQuery: false,
    isMutation: false,
    paramsInterfaceName: null,
    responseType: null,
    apiPath: null,
    httpMethod: null,
    bodyParamName: null,
    bodyTypeName: null,
    pathParams: [],
    queryParams: [],
  };

  // Store all interfaces found in the file for later lookup
  const interfaces: Map<string, ts.InterfaceDeclaration> = new Map();

  // First pass: collect all interfaces
  function collectInterfaces(node: ts.Node) {
    if (ts.isInterfaceDeclaration(node)) {
      interfaces.set(node.name.text, node);
    }
    ts.forEachChild(node, collectInterfaces);
  }
  ts.forEachChild(sourceFile, collectInterfaces);

  // Find the main exported async function (the API caller, not the hook)
  function findMainFunction(node: ts.Node): boolean {
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      for (const decl of node.declarationList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.initializer &&
          ts.isArrowFunction(decl.initializer)
        ) {
          const funcName = decl.name.text;
          // Skip hook functions (useGetXxx, useCreateXxx, etc.)
          if (funcName.startsWith("use")) {
            continue;
          }
          // Skip query key functions and setter functions
          if (funcName.endsWith("_QUERY_KEY") || funcName.startsWith("SET_")) {
            continue;
          }
          // Skip utility functions
          if (
            funcName.startsWith("GetBase") ||
            funcName === "setFirstPageData"
          ) {
            continue;
          }

          result.functionName = funcName;

          const arrowFunc = decl.initializer;

          // Check the function's parameter type to determine query type
          if (arrowFunc.parameters.length > 0) {
            const param = arrowFunc.parameters[0];
            if (param && param.type) {
              const paramTypeText = param.type.getText(sourceFile);
              result.paramsInterfaceName =
                paramTypeText.split("<")[0]?.trim() || null;

              // Check what the interface extends
              if (result.paramsInterfaceName) {
                const iface = interfaces.get(result.paramsInterfaceName);
                if (iface && iface.heritageClauses) {
                  for (const heritage of iface.heritageClauses) {
                    for (const type of heritage.types) {
                      const extendedType = type.expression.getText(sourceFile);
                      if (extendedType === "InfiniteQueryParams") {
                        result.isInfiniteQuery = true;
                      } else if (extendedType === "SingleQueryParams") {
                        result.isSingleQuery = true;
                      } else if (extendedType === "MutationParams") {
                        result.isMutation = true;
                      }
                    }
                  }
                }
              }
            }
          }

          // Extract return type (response type)
          if (arrowFunc.type) {
            const returnTypeText = arrowFunc.type.getText(sourceFile);
            // Extract the type from Promise<ConnectedXMResponse<Type>>
            const match = returnTypeText.match(
              /Promise<ConnectedXMResponse<(.+)>>/
            );
            if (match && match[1]) {
              result.responseType = match[1];
            }
          }

          // Find API call within the function body
          function findApiCall(node: ts.Node) {
            if (ts.isCallExpression(node)) {
              const callExpr = node.expression;
              if (ts.isPropertyAccessExpression(callExpr)) {
                const methodName = callExpr.name.text;
                if (
                  ["get", "post", "put", "delete", "patch"].includes(methodName)
                ) {
                  result.httpMethod = methodName;

                  // Get the first argument (URL template)
                  if (node.arguments.length > 0) {
                    const urlArg = node.arguments[0];
                    if (urlArg && ts.isTemplateExpression(urlArg)) {
                      // Template literal with expressions
                      let urlPath = urlArg.head.text;
                      for (const span of urlArg.templateSpans) {
                        if (ts.isIdentifier(span.expression)) {
                          urlPath += `{${span.expression.text}}`;
                        } else {
                          urlPath += `{param}`;
                        }
                        urlPath += span.literal.text;
                      }
                      result.apiPath = urlPath;
                      result.pathParams = extractPathParams(
                        urlArg.getText(sourceFile)
                      );
                    } else if (
                      urlArg &&
                      ts.isNoSubstitutionTemplateLiteral(urlArg)
                    ) {
                      // Simple template literal without expressions
                      result.apiPath = urlArg.text;
                    } else if (urlArg && ts.isStringLiteral(urlArg)) {
                      // Regular string literal
                      result.apiPath = urlArg.text;
                    }
                  }

                  // For POST/PUT, get the second argument (request body)
                  if (
                    (methodName === "post" ||
                      methodName === "put" ||
                      methodName === "patch") &&
                    node.arguments.length > 1
                  ) {
                    const bodyArg = node.arguments[1];
                    if (bodyArg && ts.isIdentifier(bodyArg)) {
                      result.bodyParamName = bodyArg.text;
                    }
                  }
                }
              }
            }
            ts.forEachChild(node, findApiCall);
          }

          if (arrowFunc.body) {
            findApiCall(arrowFunc.body);
          }

          return true;
        }
      }
    }
    return false;
  }

  // Search for the main function
  let found = false;
  ts.forEachChild(sourceFile, (node) => {
    if (!found) {
      found = findMainFunction(node);
    }
  });

  if (!result.functionName || !result.apiPath || !result.httpMethod) {
    return null;
  }

  // Find the body type from the params interface
  if (result.bodyParamName && result.paramsInterfaceName) {
    const iface = interfaces.get(result.paramsInterfaceName);
    if (iface) {
      for (const member of iface.members) {
        if (
          ts.isPropertySignature(member) &&
          ts.isIdentifier(member.name) &&
          member.name.text === result.bodyParamName &&
          member.type
        ) {
          result.bodyTypeName = member.type.getText(sourceFile);
          break;
        }
      }
    }
  }

  // Extract query params from the interface (non-path params, non-body params)
  if (result.paramsInterfaceName) {
    const iface = interfaces.get(result.paramsInterfaceName);
    if (iface) {
      for (const member of iface.members) {
        if (
          ts.isPropertySignature(member) &&
          ts.isIdentifier(member.name) &&
          member.type
        ) {
          const propName = member.name.text;
          // Skip internal params, path params, and body param
          if (
            propName === "adminApiParams" ||
            propName === "queryClient" ||
            propName === "pageParam" ||
            propName === "pageSize" ||
            propName === "orderBy" ||
            propName === "search" ||
            result.pathParams.includes(propName) ||
            propName === result.bodyParamName
          ) {
            continue;
          }
          const isOptional = !!member.questionToken;
          const propType = member.type.getText(sourceFile);
          result.queryParams.push({
            name: propName,
            type: propType,
            optional: isOptional,
          });
        }
      }
    }
  }

  return result;
}

/**
 * Process a single file and add its API details to the OpenAPI spec.
 */
function extractApiDetails(filePath: string) {
  const info = extractApiDetailsFromAST(filePath);
  if (!info) {
    console.warn(`⚠️  Skipping ${filePath} - could not extract API details`);
    return;
  }

  const params: any[] = [];

  // Add path parameters
  for (const pathParam of info.pathParams) {
    params.push({
      in: "path",
      name: pathParam,
      schema: { type: "string" },
      description: `The ${pathParam.replace(/Id$/, "")} identifier`,
      required: true,
    });
  }

  // Add query parameters from the interface
  for (const queryParam of info.queryParams) {
    params.push({
      in: "query",
      name: queryParam.name,
      schema: GetTypeSchema(queryParam.type),
      description: `Filter by ${queryParam.name}`,
      required: !queryParam.optional,
    });
  }

  // Add pagination parameters for infinite queries
  if (info.isInfiniteQuery) {
    params.push({
      in: "query",
      name: "page",
      schema: { type: "integer", minimum: 1, default: 1 },
      description: "Page number",
      required: false,
    });
    params.push({
      in: "query",
      name: "pageSize",
      schema: { type: "integer", minimum: 1, maximum: 100, default: 25 },
      description: "Number of items per page",
      required: false,
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

  // Build request body if present
  let requestBody: any = undefined;
  if (info.bodyTypeName) {
    requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: GetTypeSchema(info.bodyTypeName),
        },
      },
    };
  }

  // Build response schema
  const responseSchema: any = {
    type: "object",
    properties: {
      status: { type: "string", enum: ["ok"] },
      message: { type: "string", example: "Success message." },
      data: info.responseType
        ? GetTypeSchema(info.responseType)
        : { type: "object" },
    },
    required: ["status", "message", "data"],
  };

  if (info.isInfiniteQuery) {
    responseSchema.properties.count = {
      type: "integer",
      example: 100,
    };
  }

  const responses: any = {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: responseSchema,
        },
      },
    },
  };

  // Generate summary and tag
  const summary = functionNameToSummary(info.functionName);
  const tag = extractTagFromPath(filePath);

  // Add to OpenAPI spec
  const apiPath = info.apiPath || filePath;
  const httpMethod = info.httpMethod as string;
  openApiSpec.paths[apiPath] = {
    ...openApiSpec.paths[apiPath],
    [httpMethod]: {
      operationId: info.functionName,
      summary: summary,
      description: `${summary} endpoint`,
      parameters: params.length > 0 ? params : undefined,
      requestBody: requestBody,
      responses: responses,
      tags: [tag],
    },
  };

  // Track the tag for root-level tags array
  usedTags.add(tag);
}

// Use glob to get all relevant query files from queries and mutations.
const dir = path.join(__dirname, "../src");
const queries = glob.sync(path.join(dir, "{queries,mutations}/**/*.ts"), {
  ignore: [
    path.join(dir, "**/index.ts"),
    path.join(dir, "queries/useConnectedInfiniteQuery.ts"),
    path.join(dir, "queries/useConnectedSingleQuery.ts"),
    path.join(dir, "queries/useConnectedCursorQuery.ts"),
    path.join(dir, "mutations/useConnectedMutation.ts"),
    path.join(dir, "**/*Translation*.ts"),
  ],
});

console.log(`📂 Found ${queries.length} files`);

queries.reverse().forEach((filePath) => {
  extractApiDetails(filePath);
});

// Populate root-level tags array with descriptions
const tagDescriptions: Record<string, string> = {
  Accounts: "Operations for managing user accounts",
  Activities: "Operations for managing activities and activity feeds",
  Advertisements: "Operations for managing advertisements",
  Announcements: "Operations for managing announcements",
  ApiLogs: "Operations for viewing API logs",
  AuthSessions: "Operations for managing authentication sessions",
  Benefits: "Operations for managing membership benefits",
  Bookings: "Operations for managing bookings",
  Channels: "Operations for managing communication channels",
  Dashboards: "Operations for dashboard data",
  EmailReceipts: "Operations for managing email receipts",
  Events: "Operations for managing events",
  Files: "Operations for managing files",
  Groups: "Operations for managing groups",
  Images: "Operations for managing images",
  Imports: "Operations for data imports",
  Interests: "Operations for managing interests",
  Invoices: "Operations for managing invoices",
  Levels: "Operations for managing membership levels",
  Logins: "Operations for managing login records",
  Meetings: "Operations for managing meetings",
  Notifications: "Operations for managing notifications",
  Organizations: "Operations for managing organizations",
  Payments: "Operations for managing payments",
  Preferences: "Operations for managing preferences",
  PushDevices: "Operations for managing push notification devices",
  Reports: "Operations for generating reports",
  Searchlists: "Operations for managing search lists",
  Self: "Operations for the authenticated user",
  Series: "Operations for managing event series",
  Storage: "Operations for storage management",
  Streams: "Operations for managing streams",
  SupportTickets: "Operations for managing support tickets",
  Surveys: "Operations for managing surveys",
  Threads: "Operations for managing discussion threads",
  Tiers: "Operations for managing membership tiers",
  Videos: "Operations for managing videos",
};

openApiSpec.tags = Array.from(usedTags)
  .sort()
  .map((tag) => ({
    name: tag,
    description: tagDescriptions[tag] || `Operations for ${tag.toLowerCase()}`,
  }));

console.log(`🏷️  Generated ${openApiSpec.tags.length} tags`);

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
