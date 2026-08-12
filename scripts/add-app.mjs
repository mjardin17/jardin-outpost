#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetFile = path.join(__dirname, "..", "src", "data", "projects.ts");

const STATUSES = ["Live", "In progress", "Coming soon"];
const KINDS = ["internal", "iframe"];

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    const value = argv[i + 1];
    if (key && value !== undefined) result[key] = value;
  }
  return result;
}

function printUsage() {
  console.log(`Add a new project to the Apps gallery (src/data/projects.ts).

Usage:
  npm run add-app -- --slug "my-app" --name "My App" --description "What it does" --url "http://localhost:3005" --status "Live" --kind "iframe"

kind: "iframe" for an app running elsewhere, embedded at /apps/<slug>.
      "internal" for a page that lives inside this site (url should be a path like /my-app).
status defaults to "Coming soon". kind defaults to "iframe".`);
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escape(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.name) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const name = args.name;
  const slug = args.slug || slugify(name);
  const description = args.description || "";
  const url = args.url || "#";
  let status = args.status || "Coming soon";
  if (!STATUSES.includes(status)) {
    console.log(`"${status}" isn't a known status, defaulting to "Coming soon".`);
    status = "Coming soon";
  }
  let kind = args.kind || "iframe";
  if (!KINDS.includes(kind)) {
    console.log(`"${kind}" isn't a known kind, defaulting to "iframe".`);
    kind = "iframe";
  }

  const source = await readFile(targetFile, "utf8");

  if (source.includes(`slug: "${escape(slug)}"`)) {
    console.error(`A project with slug "${slug}" already exists in projects.ts. No changes made.`);
    process.exit(1);
  }

  const newEntry = `  {\n    slug: "${escape(slug)}",\n    name: "${escape(name)}",\n    description:\n      "${escape(description)}",\n    status: "${status}",\n    kind: "${kind}",\n    url: "${escape(url)}",\n  },\n`;

  const arrayClosePattern = /(\nexport const projects: Project\[\] = \[[\s\S]*?)(\n\];)/;
  if (!arrayClosePattern.test(source)) {
    console.error("Could not find the `projects` array in projects.ts. No changes made.");
    process.exit(1);
  }

  const updated = source.replace(arrayClosePattern, (match, body, close) => {
    return `${body}${newEntry}${close}`;
  });

  await writeFile(targetFile, updated, "utf8");

  console.log(`Added "${name}" (slug: ${slug}) to projects.ts.`);
  if (kind === "iframe") {
    console.log("It will appear in the gallery and be embedded at /apps/" + slug + ".");
    console.log("Remember: that url must be publicly reachable once deployed — localhost only works on your own machine.");
  } else {
    console.log(`It will appear in the gallery and link directly to ${url}.`);
  }
  console.log("Next: run `npm run deploy` to build and publish the live site.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
