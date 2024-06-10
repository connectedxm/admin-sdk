import fs from "fs/promises";
import { glob } from "glob";

// Define the regex and import statement
const regex = /const adminApi = await GetAdminAPI/g;
const importStatement = "import { GetAdminAPI } from '@src/AdminAPI';\n";

async function updateFiles() {
  try {
    // Get all files in src directory
    const files = await glob("src/**/*.*", {});

    for (const file of files) {
      try {
        const data = await fs.readFile(file, "utf8");

        // If the file matches the regex, prepend the import statement
        if (regex.test(data)) {
          const newData = importStatement + data;
          await fs.writeFile(file, newData, "utf8");
        }
      } catch (err) {
        console.error("Error while reading or writing file:", err);
      }
    }
  } catch (err) {
    console.error("Error while reading directory:", err);
  }
}

updateFiles();
