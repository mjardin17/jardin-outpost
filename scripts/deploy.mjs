#!/usr/bin/env node
import { spawn } from "node:child_process";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: true });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function main() {
  if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
    console.error(
      "Missing CLOUDFLARE_API_TOKEN and/or CLOUDFLARE_ACCOUNT_ID environment variables.\n" +
        "Set both before running `npm run deploy`, e.g.:\n" +
        '  $env:CLOUDFLARE_API_TOKEN="..."; $env:CLOUDFLARE_ACCOUNT_ID="848f7089f33791acf118742130ae8bc7"; npm run deploy'
    );
    process.exit(1);
  }

  console.log("Building static export...\n");
  await run("npx", ["next", "build"]);

  console.log("\nDeploying to Cloudflare Pages...\n");
  await run("npx", [
    "wrangler",
    "pages",
    "deploy",
    "out",
    "--project-name=jardins-outpost",
    "--commit-dirty=true",
  ]);

  console.log("\nDone. Live at https://jardins-outpost.pages.dev");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
