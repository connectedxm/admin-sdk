import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const VERSION = "1.2";

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

const CONCURRENT_LIMIT = 10; // OpenAI's recommended concurrency limit
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
      prompt: `
            You are an API that documents typescript files. You are given a typescript file. Your task is to rewrite the entire file with file comments to match the example below. 
            
            1. The Comments are for the whole file not individual functions. 
            2. DO NOT COMMENT EACH FUNCTION SEPARATELY. 
            3. DO NOT CHANGE ANYTHING OTHER THAN COMMENTS.
            4. Place the comments after the imports.

            1st Example:
            /**
             * Fetches details for a specific organization team member by their ID.
             * This function utilizes a connected single query to retrieve data about a team member within an organization.
             * It is designed to be used in applications where detailed information about a team member is required.
             * @name GetOrganizationTeamMember
             * @param {string} teamMemberId - The ID of the team member
             * @version 1.2
             * @version ${VERSION}
            **/

            2nd Example:
            /**
             * Endpoint to retrieve a specific API key associated with the current user by its unique identifier.
             * This function allows users to fetch details of their own API key using the provided API key ID.
             * @name GetSelfApiKey
             * @param {string} apiKeyId - The id of the API key
             * @version ${VERSION}
            **/

            NAME:
            1. The name of the endpoint should have the method and the endpoint name. e.g. GetAccounts, PostAccounts, PutAccounts, DeleteAccounts

            DESCRIPTION:
            1. The description should be a summary of what the endpoint does.
            2. the description should be detailed enough for public documentation
            3. the description can be multiline but should be concise and clear.
           
            LOCATING PARAMS: 
            1. Params should be pulled from the props interface
            2. Optional params MUST be marked with [paramName], Fix this if not already done.
            3. pageParam, pageSize, orderBy, search, adminApiParams should not be included in the comment EVER.

            IMPORTANT: REWRITE THE ENTIRE FILE IN YOUR RESPONSE AND ONLY CHANGE THE FILE COMMENT.

            API-VERSION: ${VERSION}

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
