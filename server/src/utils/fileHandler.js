import fs from "fs/promises";
import path from "path";

export async function readJSON(filePath) {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

export async function writeJSON(filePath, data) {
  const directory = path.dirname(filePath);

  await fs.mkdir(directory, {
    recursive: true,
  });

  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}