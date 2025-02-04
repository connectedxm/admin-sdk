import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

import { parse } from "comment-parser"; // Parses JSDoc comments
import { Config, createGenerator } from "ts-json-schema-generator";

// Define input Schema files files
const config: Config = {
  path: path.join(__dirname, "../src/{interfaces,params}.ts"),
  tsconfig: "./tsconfig.json",
  type: "*", // Extract all types
  expose: "export",
  skipTypeCheck: true,
};

// Generate JSON schema
const generator = createGenerator(config);
const schemas = generator.createSchema("*");

// OpenAPI Spec Structure
const openApiSpec: any = {
  openapi: "3.0.0",
  info: {
    title: "Admin SDK API",
    version: "1.0.0",
    description: "Auto-generated OpenAPI spec from TypeScript queries",
  },
  paths: {},
  components: {
    schemas: schemas.definitions,
  },
};

// Function to extract API details from query files
function extractApiDetails(filePath: string) {
  console.log(`🔍 Extracting API details from ${filePath}`);

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsedComments = parse(fileContent);

  // EXTRACT API PATH
  let apiPath = fileContent.match(/`(.*?)`/)?.[0];
  if (apiPath) {
    apiPath = apiPath.replace(/\${(.*?)}/g, ":$1");
  }
  if (!apiPath) throw new Error(`API path not found in ${filePath}`);

  // EXTRACT API METHOD
  const method = fileContent.match(/adminApi.(get|post|put|delete)/)?.[1];
  if (!method) throw new Error(`HTTP method not found in ${filePath}`);

  // EXTRACT NAME AND DESCRIPTION FROM COMMENTs
  const comments = parsedComments[0];
  if (!comments) throw new Error(`Comments not found in ${filePath}`);

  console.log(comments.tags);
  const name = comments.tags.find((tag) => tag.tag === "name")?.name;
  const description = comments.tags.find(
    (tag) => tag.tag === "description"
  )?.name;

  openApiSpec.paths[apiPath || filePath] = {
    ...openApiSpec.paths[apiPath || filePath],
    [method]: {
      name,
      description,
      // responses: {
      //   200: {
      //     description: `Successful response`,
      //     content: {
      //       "application/json": {
      //         // schema: { $ref: `#/components/schemas/${responseType}` },
      //       },
      //     },
      //   },
      // },
    },
  };
}

// Use glob to get all use*.ts files
// Directory where query files are stored
const dir = path.join(__dirname, "../src");

// Use glob to get all .ts files in src/queries and src/mutations, excluding specified files
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

queries
  .reverse()
  // .slice(1, 2)
  .forEach((filePath) => {
    extractApiDetails(filePath);
  });

// Save OpenAPI spec to a JSON file
const outputPath = path.join(__dirname, "../openapi.json");
fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2));

console.log("✅ OpenAPI Spec generated!");
