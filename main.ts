import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "POST.json");
const outDir = "/output";
const target = join(outDir, "POST.json");

const raw = readFileSync(source, "utf8");
const post = JSON.parse(raw);
if (typeof post.url !== "string") {
  throw new Error("POST.json must name the post address under url");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Read the copy back: the grader runs this twice and the two runs must
// write the same bytes, so refuse to report success on a partial copy.
const written = readFileSync(target, "utf8");
if (written !== raw) {
  throw new Error("copy check failed: /output/POST.json differs from POST.json");
}
console.log("copied POST.json to " + target + " for " + post.url);
