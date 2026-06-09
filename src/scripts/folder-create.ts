import fs from "fs";
import path from "path";

const args = process.argv.slice(2);

const folderArg = args[0]?.replace(/^--/, "");
const fileName = args[1]?.replace(/^--/, "");

if (!folderArg || !fileName) {
  console.log(
    "Usage: pnpm folder-create --product/sub-category --sub-category",
  );
  process.exit(1);
}

const basePath = path.join(process.cwd(), "src", "app", "modules");

const folderPath = path.join(basePath, folderArg);

fs.mkdirSync(folderPath, {
  recursive: true,
});

const files = [
  "route",
  "interface",
  "model",
  "controller",
  "service",
  "validation",
];

files.forEach((type) => {
  const filePath = path.join(folderPath, `${fileName}.${type}.ts`);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
});

console.log(`✅ Created: ${folderPath}`);
