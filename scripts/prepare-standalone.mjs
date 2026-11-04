/**
 * Prepares Next's standalone output for hosts (for example Hostinger) that
 * always start `.next/standalone/server.js`.
 *
 * With `outputFileTracingRoot` set to the repository root, a monorepo app is
 * emitted at `.next/standalone/<relative-app-path>/` while hoisted dependencies
 * land in `.next/standalone/node_modules`. Next also never copies `.next/static`
 * or `public` into the standalone directory.
 *
 * This script flattens the nested app into `.next/standalone/`, so `server.js`,
 * `.next`, `node_modules` and `public` sit side by side exactly like a
 * single-package project, and copies the static assets the server needs at
 * runtime.
 *
 * Usage: `node ../../scripts/prepare-standalone.mjs [app-dir]`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.resolve(process.cwd(), process.argv[2] ?? ".");
const standaloneDir = path.join(appDir, ".next", "standalone");
const relativeAppDir = path.relative(repoRoot, appDir);

if (!fs.existsSync(standaloneDir)) {
  console.log("[standalone] No standalone output found; nothing to prepare.");
  process.exit(0);
}

if (relativeAppDir.startsWith("..") || path.isAbsolute(relativeAppDir)) {
  console.error(`[standalone] App directory ${appDir} is not inside ${repoRoot}.`);
  process.exit(1);
}

const nestedDir = path.join(standaloneDir, relativeAppDir);

if (relativeAppDir !== "" && fs.existsSync(path.join(nestedDir, "server.js"))) {
  fs.cpSync(nestedDir, standaloneDir, { recursive: true, force: true });
  fs.rmSync(nestedDir, { recursive: true, force: true });

  // Remove now-empty ancestor directories (for example `.next/standalone/apps`).
  let dir = path.dirname(nestedDir);
  while (dir !== standaloneDir && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }

  console.log(`[standalone] Flattened ${relativeAppDir} into .next/standalone`);
}

// The standalone server serves these from its own directory, but Next does not
// copy them into the standalone output.
for (const [source, destination] of [
  [path.join(appDir, ".next", "static"), path.join(standaloneDir, ".next", "static")],
  [path.join(appDir, "public"), path.join(standaloneDir, "public")],
]) {
  if (!fs.existsSync(source)) continue;
  fs.cpSync(source, destination, { recursive: true, force: true });
  console.log(
    `[standalone] Copied ${path.relative(appDir, source)} -> ${path.relative(appDir, destination)}`,
  );
}

if (!fs.existsSync(path.join(standaloneDir, "server.js"))) {
  console.error("[standalone] Expected .next/standalone/server.js after preparation.");
  process.exit(1);
}
