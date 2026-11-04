import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Hoisted monorepo dependencies (react, react-dom, ...) live outside the app
  // directory. Without a common tracing root they are skipped when Next builds
  // the standalone bundle, so the production server cannot resolve them.
  outputFileTracingRoot: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  transpilePackages: ["@repo/ui", "@repo/content"],
};

export default nextConfig;
