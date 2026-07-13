import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@open-sync/core": fileURLToPath(new URL("../core/src/index.ts", import.meta.url)),
      "@open-sync/shared": fileURLToPath(new URL("../shared/src/index.ts", import.meta.url))
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    isolate: true
  }
});