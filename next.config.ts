import type { NextConfig } from "next";
import path from "path";

// Set by scripts/package-php.js: the PHP hosting build is plain HTML, and
// godaddy-php/api/ai-respond.php replaces the app/api route, which pageExtensions leaves out.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  output: staticExport ? "export" : "standalone",
  ...(staticExport ? { trailingSlash: true, pageExtensions: ["tsx"] } : {}),
  outputFileTracingRoot: path.join(__dirname),
  // Tailwind CSS v4 is compiled through its Turbopack loader.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
