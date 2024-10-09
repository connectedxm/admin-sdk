import fs from "fs";
import path from "path";
import { glob } from "glob";

// Function to generate index.ts file
async function generateIndexFile(dir: string) {
  const files = fs.readdirSync(dir);
  let exports = "";

  const indexPath = path.join(dir, "index.ts");
  if (fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, "");
  }

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively generate index.ts for subdirectories
      await generateIndexFile(filePath);

      // Export the subdirectory in the index.ts file
      const exportStatement = `export * from "./${file}";\n`;
      exports += exportStatement;
    } else if (file !== "index.ts" && path.extname(file) === ".ts") {
      // Export the file in the index.ts file
      const baseName = path.basename(file, ".ts");
      const exportStatement = `export * from "./${baseName}";\n`;
      exports += exportStatement;
    }
  }

  // Write the exports to the index.ts file
  if (exports) {
    fs.appendFileSync(indexPath, exports);
  }
}

const createIndexFiles = async () => {
  const pages = await glob("src/**/*", {});

  for (const page of pages) {
    if (fs.statSync(page).isDirectory()) {
      await generateIndexFile(page);
    }
  }
};

createIndexFiles();
