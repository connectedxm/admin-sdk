import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import { createOpenAI } from "@ai-sdk/openai";
// import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

// const groq = createGroq({
//   apiKey: "",
// });

const openai = createOpenAI({
  apiKey: "",
});

// Directory where query files are stored
const dir = path.join(__dirname, "../src");

// Use glob to get all .ts files in src/queries and src/mutations, excluding specified files
const filePaths = glob.sync(path.join(dir, "{queries,mutations}/**/*.ts"), {
  ignore: [
    path.join(dir, "**/index.ts"),
    path.join(dir, "queries/useConnectedInfiniteQuery.ts"),
    path.join(dir, "queries/useConnectedSingleQuery.ts"),
    path.join(dir, "mutations/useConnectedMutation.ts"),
  ],
});

console.log(`📂 Found ${filePaths.length} files`);

const VERSION = "1.3";
const CONCURRENT_LIMIT = 5; // OpenAI's recommended concurrency limit
const RETRY_LIMIT = 3; // Max retries for rate-limited requests

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to process a single file
async function processFile(
  filePath: string,
  attempt: number = 1
): Promise<void> {
  try {
    const file = fs.readFileSync(filePath, "utf-8");

    if (file.includes(`@version ${VERSION}`)) {
      console.log(`⚠️ Skipping ${path.basename(filePath)} (already processed)`);
      return;
    }

    let { text } = await generateText({
      model: openai("gpt-4o"),
      // model: groq("llama-3.3-70b-versatile"),
      system:
        "You are an API that documents typescript files. You only receive a typescript file and rewrite it with updated comments. You NEVER comment or chat with the user",
      prompt: `
            RULES:
            1. DO NOT COMMENT THESE PARAMS [pageParam, pageSize, orderBy, search, adminApiParams]
            2. Do not edit any part of the file except the comment after the imports.
            3. Return the entire file with the updated comment.
            4. Do not discuss your changes, just respond the file with edits.

            INSTRUCTIONS: 
            1. Look at the current params commented and compare them to the axios call and where they are used.
            2. If used in the path, mark it as (path) description
            3. if used in the params, mark it as (query) description
            4. If used as req.body, mark it as (body) description
            5. If used as a value in the body, mark it as (bodyValue) description

            EXAMPLE 
            /**
             * Endpoint to retrieve a list of stream inputs.
             * This function fetches stream input data from the server, allowing for infinite scrolling and pagination.
             * It is designed to be used in applications where a comprehensive list of stream inputs is required.
             * @name GetStreamInputs
             * @version 1.2
             **/
            const { data } = await adminApi.get("/streams", {
              params: {
                page: pageParam || undefined,
                pageSize: pageSize || undefined,
                orderBy: orderBy || undefined,
                search: search || undefined,
              },
            });

            EXAMPLE 2:
            /**
             * Endpoint to retrieve a list of stream inputs.
             * This function fetches stream input data from the server, allowing for infinite scrolling and pagination.
             * It is designed to be used in applications where a comprehensive list of stream inputs is required.
             * @name GetStreamInputs
             * @version 1.3
             **/
            export const GetStreamInputs = async ({
              pageParam,
              pageSize,
              orderBy,
              search,
              adminApiParams,
            }: GetStreamInputsParams): Promise<ConnectedXMResponse<StreamInput[]>> => {
              const adminApi = await GetAdminAPI(adminApiParams);
              const { data } = await adminApi.get("/streams", {
                params: {
                  page: pageParam || undefined,
                  pageSize: pageSize || undefined,
                  orderBy: orderBy || undefined,
                  search: search || undefined,
                },
              });

              return data;
            };

            EXAMPLE 3:
            /**
             * Endpoint to create a new account within the system.
             * This function allows for the creation of a new account by providing the necessary account details.
             * It is designed to be used in applications where account management is required.
             * @name CreateAccount
             * @param {AccountCreateInputs} account (body) The account details to be created
             * @version 1.2
             **/
            export const CreateAccount = async ({
              account,
              adminApiParams,
              queryClient,
            }: CreateAccountParams): Promise<ConnectedXMResponse<Account>> => {
              const adminApi = await GetAdminAPI(adminApiParams);
              const { data } = await adminApi.post<ConnectedXMResponse<Account>>(
                "/accounts",
                account
              );
              if (queryClient && data.status === "ok") {
                queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
                SET_ACCOUNT_QUERY_DATA(queryClient, [data?.data.id], data);
              }
              return data;
            };
         
            IMPORTANT NOTES:
            1. DO NOT COMMENT THESE PARAMS [pageParam, pageSize, orderBy, search, adminApiParams]

            UPDATE COMMENT VERSION TO: ${VERSION}

            TYPESCRIPT FILE CODE: 
            ${file}`,
    });

    // Remove markdown syntax from response
    text = text.replace(/```typescript/g, "").replace(/```/g, "");

    if (text.includes("</think>")) {
      text = text.split("</think>")[1] || text;
    }

    fs.writeFileSync(filePath, text.trim());
    console.log(`✅ Processed ${path.basename(filePath)}`);
  } catch (error: any) {
    if (error?.message?.includes("rate limit") && attempt <= RETRY_LIMIT) {
      const delayTime = Math.pow(2, attempt) * 1000; // Exponential backoff
      console.warn(
        `⚠️ Rate limit hit! Retrying ${path.basename(filePath)} in ${
          delayTime / 1000
        }s...`
      );
      await delay(delayTime);
      return processFile(filePath, attempt + 1);
    }
    console.error(
      `❌ Failed to process ${path.basename(filePath)}:`,
      error.message
    );
  }
}

// Function to process files in controlled concurrency batches
async function processFiles() {
  const totalFiles = filePaths.length;
  let processedCount = 0;

  for (let i = 0; i < filePaths.length; i += CONCURRENT_LIMIT) {
    const batch = filePaths.slice(i, i + CONCURRENT_LIMIT);
    console.log(
      `🚀 Processing batch ${i / CONCURRENT_LIMIT + 1}/${Math.ceil(
        totalFiles / CONCURRENT_LIMIT
      )}`
    );

    await Promise.allSettled(
      batch.map((filePath) => processFile(filePath))
    ).then((results) => {
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          processedCount++;
        }
      });
    });

    console.log(
      `📊 Progress: ${processedCount}/${totalFiles} files processed.`
    );
  }

  console.log("✅ All files processed!");
}

// Start processing
processFiles();
