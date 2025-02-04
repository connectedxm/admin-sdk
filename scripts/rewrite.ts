import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import { createGroq } from "@ai-sdk/groq";
import {
  extractReasoningMiddleware,
  generateText,
  wrapLanguageModel,
} from "ai";

const groq = createGroq({
  apiKey: "",
});

// Use glob to get all use*.ts files
// Directory where query files are stored
const dir = path.join(__dirname, "../src");

// Use glob to get all .ts files in src/queries and src/mutations, excluding specified files
const filePaths = glob.sync(path.join(dir, "{queries,mutations}/**/*.ts"), {
  ignore: [
    path.join(dir, "**/index.ts"),
    path.join(dir, "queries/useConnectedInfiniteQuery.ts"),
    path.join(dir, "queries/useConnectedSingleQuery.ts"),
    path.join(dir, "mutations/useConnectedMutation.ts"),
    path.join(dir, "**/*Translation*.ts"),
  ],
});

console.log(`📂 Found ${filePaths.length} files`);

for (const path of filePaths.slice(0, 1)) {
  const file = fs.readFileSync(path, "utf-8");
  const enhancedModel = wrapLanguageModel({
    model: groq("deepseek-r1-distill-llama-70b"),
    middleware: extractReasoningMiddleware({ tagName: "think" }),
  });

  const { text } = await generateText({
    model: enhancedModel,
    prompt:
      "Convert this file so that it does not have any JSDoc comments. Then add comments at the top of the file that has name and description tags. but nothing else. FILE: " +
      path +
      "\n" +
      file,
  });

  fs.writeFileSync(path, text);
}

console.log("✅ OpenAPI Spec generated!");
