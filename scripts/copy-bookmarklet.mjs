import fs from "fs";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const content = fs
  .readFileSync(path.join(__dirname, "../dist/lib/annotator.umd.cjs"))
  .toString()
  .trim();

const specialCharacters = ["%", '"', "<", ">", "#", "@", " ", "\\&", "\\?"];
const urlencode = (code) =>
  code.replace(
    new RegExp(specialCharacters.join("|"), "g"),
    encodeURIComponent
  );
const prefix = (code) => `javascript:${code}`;

function createBookmarklet(code) {
  return prefix(urlencode(`(function() { ${content} })()`));
}

console.log(createBookmarklet(content));
