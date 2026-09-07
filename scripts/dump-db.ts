import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "../src/data/db.json");
const db = JSON.parse(readFileSync(out, "utf8"));
writeFileSync(out, `${JSON.stringify(db, null, 2)}\n`);
console.log(`wrote ${out}`);
