const fs = require("fs");
const path = require("path");

const targets = [
  path.join(
    __dirname,
    "..",
    "node_modules",
    "@remix-run",
    "web-fetch",
    "dist",
    "lib.node.cjs",
  ),
  path.join(
    __dirname,
    "..",
    "node_modules",
    "@remix-run",
    "web-fetch",
    "src",
    "headers.js",
  ),
];

for (const filePath of targets) {
  if (!fs.existsSync(filePath)) continue;

  const source = fs.readFileSync(filePath, "utf8");
  const patched = source.replace(
    /URLSearchParams\.prototype\[p\]\.call\(\s*receiver,/g,
    "URLSearchParams.prototype[p].call(target,",
  );

  if (patched !== source) {
    fs.writeFileSync(filePath, patched, "utf8");
    // eslint-disable-next-line no-console
    console.log(`Patched ${path.relative(process.cwd(), filePath)}`);
  }
}
