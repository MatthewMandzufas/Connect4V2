const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    bundle: true,
    platform: "node",
    tsconfig: "./tsconfig.json",
    external: ["nock", "mock-aws-s3", "aws-sdk"],
    alias: {
      "@": "./src",
    },
    loader: {
      ".ts": "ts",
      ".html": "text",
      ".node": "file",
    },
  })
  .catch(() => process.exit(1));
