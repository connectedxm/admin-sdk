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

  // First pass: collect all interfaces for reference
  const interfaces: Map<string, ts.InterfaceDeclaration> = new Map();

  function collectInterfaces(node: ts.Node) {
    if (ts.isInterfaceDeclaration(node)) {
      if (
        node.modifiers &&
        node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      ) {
        interfaces.set(node.name.text, node);
      }
    }
    ts.forEachChild(node, collectInterfaces);
  }
  ts.forEachChild(sourceFile, collectInterfaces);

  /**
   * Get all properties from an interface, including inherited ones
   */
  function getInterfaceProperties(
    interfaceName: string,
    omitProps: Set<string> = new Set()
  ): { properties: Record<string, any>; required: string[] } {
    const iface = interfaces.get(interfaceName);
    if (!iface) {
      return { properties: {}, required: [] };
    }

    const properties: Record<string, any> = {};
    const required: string[] = [];

    // First, get properties from base interfaces
    if (iface.heritageClauses) {
      for (const heritage of iface.heritageClauses) {
        if (heritage.token === ts.SyntaxKind.ExtendsKeyword) {
          for (const type of heritage.types) {
            const baseName = type.expression.getText(sourceFile);
            const baseProps = getInterfaceProperties(baseName, omitProps);
            Object.assign(properties, baseProps.properties);
            required.push(...baseProps.required);
          }
        }
      }
    }

    // Then add/override with this interface's own properties
    iface.members.forEach((member) => {
      if (
        ts.isPropertySignature(member) &&
        member.type &&
        ts.isIdentifier(member.name)
      ) {
        const propName = member.name.text;

        // Skip omitted properties
        if (omitProps.has(propName)) {
          return;
        }

        const propSchema = parseType(member.type, sourceFile);
        properties[propName] = propSchema;

        // Update required array
        const reqIndex = required.indexOf(propName);
        if (reqIndex !== -1) {
          required.splice(reqIndex, 1);
        }
        if (!member.questionToken) {
          required.push(propName);
        }
      }
    });

    return { properties, required };
  }

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

      if (name !== "ConnectedXMResponse") {
        // Check for utility type extensions like Omit<BaseX, "prop">
        let hasUtilityTypeExtension = false;
        let utilityBaseType: string | null = null;
        let omittedProps: Set<string> = new Set();

        if (node.heritageClauses) {
          for (const heritage of node.heritageClauses) {
            if (heritage.token === ts.SyntaxKind.ExtendsKeyword) {
              for (const type of heritage.types) {
                const baseName = type.expression.getText(sourceFile);

                // Check if this is a utility type
                if (
                  baseName === "Omit" &&
                  type.typeArguments &&
                  type.typeArguments.length >= 2
                ) {
                  hasUtilityTypeExtension = true;
                  // First type argument is the base type
                  utilityBaseType = type.typeArguments[0]!.getText(sourceFile);
                  // Second type argument is the omitted properties (can be a union)
                  const omitArg = type.typeArguments[1]!.getText(sourceFile);
                  // Parse omitted properties (remove quotes and split by |)
                  omitArg.split("|").forEach((prop) => {
                    const cleaned = prop.trim().replace(/^["']|["']$/g, "");
                    omittedProps.add(cleaned);
                  });
                }
                // TODO: Handle Pick, Partial, etc. if needed
              }
            }
          }
        }

        if (hasUtilityTypeExtension && utilityBaseType) {
          // Resolve the utility type by getting base properties and omitting specified ones
          const baseProps = getInterfaceProperties(
            utilityBaseType,
            omittedProps
          );

          // Add/override with current interface's own properties
          node.members.forEach((member) => {
            if (
              ts.isPropertySignature(member) &&
              member.type &&
              ts.isIdentifier(member.name)
            ) {
              const propName = member.name.text;
              const propSchema = parseType(member.type, sourceFile);
              baseProps.properties[propName] = propSchema;

              // Update required array
              const reqIndex = baseProps.required.indexOf(propName);
              if (reqIndex !== -1) {
                baseProps.required.splice(reqIndex, 1);
              }
              if (!member.questionToken) {
                baseProps.required.push(propName);
              }
            }
          });

          const schema: any = {
            type: "object",
            properties: baseProps.properties,
          };
          if (baseProps.required.length > 0) {
            schema.required = baseProps.required;
          }
          schemas[name] = schema;
        } else {
          // Handle normal interface extension
          const baseInterfaces: string[] = [];
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

              if (!member.questionToken) {
                required.push(propName);
              }
            }
          });

          if (node.heritageClauses) {
            for (const heritage of node.heritageClauses) {
              if (heritage.token === ts.SyntaxKind.ExtendsKeyword) {
                for (const type of heritage.types) {
                  const baseName = type.expression.getText(sourceFile);
                  baseInterfaces.push(baseName);
                }
              }
            }
          }

          // If the interface extends other interfaces, use allOf to compose them
          if (baseInterfaces.length > 0) {
            const allOfSchemas = baseInterfaces.map((baseName) => ({
              $ref: `#/components/schemas/${baseName}`,
            }));

            // Only add the current interface's properties if it has any
            if (Object.keys(properties).length > 0) {
              const ownSchema: any = {
                type: "object",
                properties,
              };
              if (required.length > 0) {
                ownSchema.required = required;
              }
              allOfSchemas.push(ownSchema);
            }

            schemas[name] = { allOf: allOfSchemas };
          } else {
            // No inheritance, just use the properties directly
            const schema: any = {
              type: "object",
              properties,
            };
            if (required.length > 0) {
              schema.required = required;
            }
            schemas[name] = schema;
          }
        }
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
 * Note: "organization" stays singular (not pluralized).
 */
function normalizeTag(tag: string): string {
  // Convert to lowercase
  let normalized = tag.toLowerCase();

  // Special case: organizations should be singular (organization)
  if (normalized === "organizations") {
    normalized = "organization";
  }

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
  // Note: organization is intentionally excluded to keep it singular
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

  // Check if it's a known singular form (skip organization to keep it singular)
  if (normalized !== "organization" && singularToPlural[normalized]) {
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
  // Main tags
  Accounts:
    "The command center for managing client profiles, tracking community data, and monitoring all member interactions",
  Activities: "Keep your community active with engagement in the Activity Feed",
  Advertisements:
    "Drive revenue, boost sponsor brand visibility, and engage directly with your community using advertisements",
  Announcements:
    "Keep your community in the loop with important updates, news, and highlights directly to your audience",
  ApiLogs: "Operations for viewing API logs",
  AuthSessions: "Operations for managing authentication sessions",
  Benefits:
    "Create and manage exclusive offers or discounts provided to accounts in the community",
  Bookings:
    "Attendees can book specific time-slots for event experiences with bookings",
  Channels:
    "Channels combines versatile video hosting with written updates to help you effectively reach, inform, and entertain your community",
  Dashboards: "Operations for dashboard data",
  EmailReceipts: "Operations for managing email receipts",
  Events:
    "Organize and manage events effortlessly with seamless registration, detailed scheduling, and real-time updates",
  Files: "Operations for managing files",
  Groups:
    "Create and manage dedicated groups within your community to foster collaboration and connection",
  Images: "Operations for managing images",
  Imports: "Operations for data imports",
  Interests:
    "A community-wide tagging system that acts like hashtags and allows users to share trending topics",
  Invoices:
    "Streamline your event invoicing and gain complete financial oversight with instant differentiation between paid and outstanding invoices",
  Logins: "Operations for managing login records",
  Meetings:
    "A scalable solution for virtual events, featuring structured sessions, efficient presets, and integrated recordings for lasting engagement",
  Notifications: "Operations for managing notifications",
  Organization:
    "Ensure that your community runs according to your liking by using the Control Center feature for centralized command center adjustments",
  Payments:
    "View a comprehensive record of all past transactions and payment activities",
  Preferences: "Operations for managing preferences",
  PushDevices: "Operations for managing push notification devices",
  Reports:
    "Easily review and gain data-driven insights for community management",
  Searchlists: "Operations for managing search lists",
  Self: "Operations for the authenticated user",
  Series: "Operations for managing event series",
  "Series::Registrations":
    "Manage account registrations for event series",
  Sponsors: "Operations for managing sponsorship levels",
  Storage:
    "Seamless and secure media storage for video, image, and file storage related to live events",
  Streams: "Operations for managing streams",
  Support:
    "Monitor and support areas within the community that require attention to ensure consistent care and engagement",
  SupportTickets: "Operations for managing support tickets",
  Surveys: "Easily gather insights and feedback by using surveys",
  Threads:
    "A collection of messages around a specific topic for seamless, real-time collaboration",
  Tiers: "Operations for managing membership tiers",
  Videos: "Operations for managing videos",

  // Nested tags - Accounts
  "Accounts::Addresses":
    "Store and manage physical addresses associated with accounts for shipping, billing, or location purposes",
  "Accounts::Followers":
    "Track and manage accounts who follow a specific account, enabling social connections and activity feed customization",
  "Accounts::Following":
    "Manage which accounts an account chooses to follow, allowing users to curate their activity feed and stay connected with relevant content",
  "Accounts::Groups":
    "View and manage group memberships for accounts, showing which groups an account belongs to and enabling group-based permissions",
  "Accounts::Interests":
    "Associate hashtag-like interests with accounts to categorize content, enable discovery, and personalize the user experience",
  "Accounts::Invitations":
    "Create an email allowlist that controls who can sign up and join your private community, restricting access to authorized email addresses",
  "Accounts::Leads":
    "Track and manage lead information associated with accounts for sales and marketing purposes",
  "Accounts::Tiers":
    "Associate accounts with membership tiers and segments to grant access to exclusive content, pricing, and features",

  // Nested tags - Activities
  "Activities::Schedule":
    "Schedule activities to be published at specific times, allowing for planned content releases and coordinated community engagement",

  // Nested tags - Announcements
  "Announcements::Schedule":
    "Schedule announcements to go live at the most impactful times, ensuring important messages reach your audience when they're most likely to see them",

  // Nested tags - Bookings
  "Bookings::Availabilities":
    "Define available time slots for bookable spaces, allowing attendees to reserve specific times for activities like meetings or photo sessions",
  "Bookings::Blackouts":
    "Set blackout periods when bookings are unavailable, preventing reservations during maintenance, holidays, or other restricted times",
  "Bookings::Places":
    "Define top-level venues that contain bookable spaces, such as hotels, conference centers, or virtual platforms, providing context for all reservable areas",
  "Bookings::Spaces":
    "Create specific, individual areas within a larger place that attendees can reserve for time-slots, such as meeting rooms, booths, or photo-op locations",

  // Nested tags - Dashboards
  "Dashboards::Widgets":
    "Configure and customize dashboard widgets to display key metrics, KPIs, and visualizations for monitoring community activity and performance",

  // Nested tags - Events
  "Events::Access":
    "Configure access controls for events, determining who can view, register for, or participate in event content and activities",
  "Events::Activations":
    "Manage on-site check-ins, control access activations for special zones or sessions, and set permissions for scanning devices and staff",
  "Events::Addons":
    "Offer supplementary items or services like exclusive workshops, networking upgrades, merchandise, or special amenities that enhance the attendee experience",
  "Events::Attendees":
    "Track accounts that have started or completed registration for an event, monitor registration status, and manage attendee information",
  "Events::Attendees::Packages":
    "View and manage packages purchased by event attendees, tracking bundled pass combinations and package-specific benefits",
  "Events::Attendees::Reservations":
    "Manage lodging and accommodation reservations made by event attendees, including room assignments and reservation details",
  "Events::Benefits":
    "Associate exclusive offers or discounts with events, providing special perks to attendees or members",
  "Events::Bypass":
    "Bypass standard registration requirements to grant direct access to events or passes, useful for comps, sponsors, or special circumstances",
  "Events::Cohosts":
    "Assign co-hosts to events who can help manage and moderate event activities, content, and attendee interactions",
  "Events::Coupons":
    "Create and manage promotional discount codes that attendees can apply at checkout to reduce pass prices and drive registrations",
  "Events::Emails":
    "Send and manage event-related email communications to attendees, including confirmations, updates, and promotional messages",
  "Events::Faqs":
    "Create and manage frequently asked questions for events, providing attendees with answers to common inquiries about registration, logistics, and event details",
  "Events::Followups":
    "Send follow-up communications to event attendees after the event concludes, including surveys, thank you messages, and next steps",
  "Events::Matches":
    "Create customizable pairings to group attendees together for activities like golf foursomes, table assignments, or networking sessions",
  "Events::Media":
    "Upload, organize, and manage media files associated with events, including images, videos, and documents for event pages and content",
  "Events::OnSite":
    "Configure on-site check-in processes, manage access activations, and set scan permissions to ensure smooth and secure attendee access throughout the event",
  "Events::Packages":
    "Create bundled pass offerings that combine multiple pass types into a single purchase, often at a discounted rate, simplifying registration for families or groups",
  "Events::Packages::Passes":
    "Configure which pass types are included in event packages and set quantity limits for each pass type within the package",
  "Events::Pages":
    "Customize event page content, including descriptions, images, FAQs, sponsor information, and other details that appear on the public event page",
  "Events::Passes":
    "Manage individual passes purchased by attendees, tracking pass status, check-ins, and access permissions for event registration",
  "Events::Passtypes":
    "Create and configure pass types with unique names, descriptions, prices, access levels, and rules that define what each pass enables",
  "Events::Passtypes::Priceschedules":
    "Set dynamic pricing that automatically changes on specific dates, allowing for early bird pricing, regular pricing, and late registration fees",
  "Events::Passtypes::Refundschedules":
    "Define refund policies that specify how much money attendees receive if they cancel their pass, based on cancellation timing and pass type",
  "Events::Questions":
    "Create custom registration questions to collect essential attendee information, enabling better event planning and personalized experiences",
  "Events::Rooms":
    "Manage specific room assignments and room numbers for event accommodations, allowing attendees to select or be assigned particular rooms",
  "Events::Roomtypes":
    "Define room categories for event accommodations, such as single, double, or suite, with pricing, capacity, and availability settings",
  "Events::Sections":
    "Organize event content into sections for better navigation and structure, grouping related information or activities together",
  "Events::Sessions":
    "Create, schedule, and configure individual sessions within your event agenda, including details, speakers, locations, and registration requirements",
  "Events::Sessions::Accesses":
    "Control who can access specific sessions, setting restrictions based on pass types, capacity limits, or registration requirements",
  "Events::Sessions::Locations":
    "Define physical venues, rooms, or virtual spaces where sessions occur, providing clear navigational information for attendees",
  "Events::Sessions::Matches":
    "Create matchmaking pairings for session-specific activities, grouping attendees together for networking or collaborative sessions",
  "Events::Sessions::Questions":
    "Add custom questions to session registration, collecting additional information from attendees who register for specific sessions",
  "Events::Sessions::Sections":
    "Organize session content into sections, grouping related sessions or activities for better agenda navigation",
  "Events::Speakers":
    "Create detailed speaker profiles with biographies, photos, company information, and social media links to showcase event presenters",
  "Events::Sponsors":
    "Create and display sponsor profiles on the event page, recognizing supporters with logos, descriptions, and website links",
  "Events::Sponsorshiplevels":
    "Create sponsorship level categories like Platinum, Gold, or Silver to organize sponsors by contribution level and display them accordingly",
  "Events::Sponsorships":
    "Manage sponsorship relationships and benefits, tracking sponsor contributions and associated perks or visibility",
  "Events::Templates":
    "Save event configurations as templates to quickly create new events with similar settings, streamlining event setup and ensuring consistency",
  "Events::Tracks":
    "Categorize sessions into thematic tracks with color coding, helping attendees filter complex schedules and find content aligned with their interests",

  // Nested tags - Groups
  "Groups::Events":
    "Associate events with groups, allowing group members to discover and register for group-specific events or activities",
  "Groups::Interests":
    "Tag groups with interests to help members discover relevant groups and enable interest-based filtering and recommendations",
  "Groups::Invitations":
    "Send direct invitations to specific users to join private groups, tracking invitation status and proactively growing group membership",
  "Groups::Members":
    "View the complete roster of group members, add or remove members, and adjust roles to maintain a well-organized community",
  "Groups::Moderators":
    "Assign elevated privileges to trusted group members, enabling them to help moderate content, manage members, and maintain community standards",
  "Groups::Requests":
    "Review membership requests for private groups, approving or denying access to ensure appropriate membership and maintain group exclusivity",
  "Groups::Sponsors":
    "Associate sponsors with groups, recognizing supporting organizations or individuals within group contexts",

  // Nested tags - Invoices
  "Invoices::Lineitems":
    "View and manage individual line items on invoices, tracking specific charges, quantities, and prices for detailed financial records",

  // Nested tags - Levels
  "Sponsors::Accounts":
    "Associate accounts with membership levels to grant tier-based access, pricing, and benefits based on membership status",

  // Nested tags - Logins
  "Logins::Accounts":
    "Link login credentials to accounts, enabling the flexible system where one login can access multiple accounts or one account can be accessed by multiple logins",

  // Nested tags - Meetings
  "Meetings::Links":
    "Generate and manage meeting links for virtual sessions, providing secure access URLs for participants to join meetings",
  "Meetings::Livestreams":
    "Configure and manage livestream settings for meetings, enabling real-time video broadcasting to larger audiences",
  "Meetings::Participants":
    "Manage meeting participants, including adding attendees, tracking attendance, and controlling participant permissions",
  "Meetings::Presets":
    "Create reusable meeting configuration presets to reduce setup time and ensure consistent settings across similar meeting types",
  "Meetings::Recordings":
    "Access and manage meeting recordings, enabling content curation and sharing value long after meetings conclude",
  "Meetings::Sessions":
    "Structure complex meetings into multiple sessions, organizing content and activities within a single meeting event",

  // Nested tags - Organization (note: singular, not Organizations)
  "Organization::Attributes":
    "Create custom account fields with specific rules to capture essential user data beyond default profile fields, building richer profiles and enabling better segmentation",
  "Organization::Domains":
    "Configure allowed email domains for organization accounts, controlling who can register and join the community",
  "Organization::Integrations":
    "Connect third-party software and services to extend platform capabilities, automate workflows, and sync data between systems",
  "Organization::Modules":
    "Enable or disable platform modules and features, customizing which capabilities are available to your organization",
  "Organization::Modules::Custom":
    "Configure custom modules and features specific to your organization's needs and requirements",
  "Organization::Modules::Tiers":
    "Set tier-based module access, determining which features are available to different membership levels",
  "Organization::Payments":
    "Configure payment integrations and settings, including payment processors, tax handling, and transaction management",
  "Organization::Sideeffects":
    "Configure automated actions that occur when specific events happen, such as granting access or sending notifications based on triggers",
  "Organization::Tax":
    "Set up tax calculation and collection settings, including tax codes, rates, and integration with tax services like Avalara",
  "Organization::Teammembers":
    "Manage team members and administrators for the organization, assigning roles and permissions for platform access",
  "Organization::Users":
    "Manage user accounts and access for the organization, controlling who can use the platform and what permissions they have",
  "Organization::Webhooks":
    "Configure webhook endpoints to receive real-time notifications about platform events, enabling integration with external systems and automation",

  // Nested tags - Reports
  "Reports::Users":
    "Generate detailed reports about user activity, behavior, and engagement to gain insights into community participation and trends",

  // Nested tags - Searchlists
  "Searchlists::Values":
    "Manage predefined values for search lists used in registration questions and forms, providing dropdown options and controlled input choices",

  // Nested tags - Self
  "Self::Apikeys":
    "Generate and manage API keys for the authenticated user, enabling programmatic access to platform features and data",
  "Self::Images":
    "Upload and manage profile images and photos for the authenticated user's account",

  // Nested tags - Streams
  "Streams::Outputs":
    "Configure stream output destinations and settings, controlling where and how video streams are broadcast or recorded",
  "Streams::Sessions":
    "Manage streaming sessions, including starting, stopping, and monitoring live video streams for events or content delivery",

  // Nested tags - Support
  "Support::Messages":
    "Send and receive support messages with users, enabling direct communication to resolve issues and provide assistance",
  "Support::Notes":
    "Add internal notes to support tickets for team collaboration, tracking resolution steps, and maintaining support history",

  // Nested tags - SupportTickets
  "Supporttickets::Messages":
    "Exchange messages within support tickets, facilitating communication between support staff and users to resolve issues",
  "Supporttickets::Notes":
    "Add administrative notes to support tickets for internal tracking, documenting resolution steps, and team coordination",

  // Nested tags - Surveys
  "Surveys::Questions":
    "Create and configure survey questions to gather feedback, opinions, and insights from your community",
  "Surveys::Sections":
    "Organize survey questions into logical sections, improving survey structure and user experience",
  "Surveys::Submissions":
    "View and analyze survey responses submitted by participants, extracting insights and feedback data",

  // Nested tags - Threads
  "Threads::Circles":
    "Create circles that bring together sets of accounts around specific goals, teams, or purposes, enabling focused group communication",
  "Threads::Circles::Accounts":
    "Manage which accounts belong to thread circles, adding or removing members to control circle membership and access",
  "Threads::Members":
    "Manage thread membership, controlling who can participate in specific thread conversations",
  "Threads::Messages":
    "Send and manage messages within threads, enabling real-time collaboration and discussion around specific topics",
  "Threads::Messages::Files":
    "Attach and manage files within thread messages, sharing documents and resources in conversation context",
  "Threads::Messages::Images":
    "Attach and manage images within thread messages, enabling visual communication and content sharing",
  "Threads::Messages::Reactions":
    "Add reactions to thread messages, enabling quick feedback and engagement without requiring full replies",
  "Threads::Messages::Videos":
    "Attach and manage videos within thread messages, sharing video content in conversation threads",

  // Nested tags - Videos
  "Videos::Captions":
    "Upload, manage, and configure closed captions and subtitles for videos, improving accessibility and multilingual support",
};

openApiSpec.tags = Array.from(usedTags)
  .sort()
  .map((tag) => ({
    name: tag,
    description: tagDescriptions[tag] || `Operations for ${tag.toLowerCase()}`,
  }));

console.log(`🏷️  Generated ${openApiSpec.tags.length} tags`);

/**
 * Sort HTTP methods within each path by CRUD order:
 * GET (Read) -> POST (Create) -> PUT (Update) -> PATCH (Update) -> DELETE (Delete)
 */
function sortPathsByCRUD(paths: Record<string, any>): Record<string, any> {
  const crudOrder: Record<string, number> = {
    get: 1,
    post: 2,
    put: 3,
    patch: 4,
    delete: 5,
  };

  const sortedPaths: Record<string, any> = {};

  // Sort paths alphabetically for consistency
  const sortedPathKeys = Object.keys(paths).sort();

  for (const pathKey of sortedPathKeys) {
    const pathMethods = paths[pathKey];
    const sortedMethods: Record<string, any> = {};

    // Get all method keys and sort them by CRUD order
    const methodKeys = Object.keys(pathMethods).sort((a, b) => {
      const orderA = crudOrder[a.toLowerCase()] || 99;
      const orderB = crudOrder[b.toLowerCase()] || 99;
      return orderA - orderB;
    });

    // Rebuild the path object with sorted methods
    for (const method of methodKeys) {
      sortedMethods[method] = pathMethods[method];
    }

    sortedPaths[pathKey] = sortedMethods;
  }

  return sortedPaths;
}

// Sort paths by CRUD operations
openApiSpec.paths = sortPathsByCRUD(openApiSpec.paths);

console.log(
  `📋 Sorted ${Object.keys(openApiSpec.paths).length} paths by CRUD operations`
);

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
