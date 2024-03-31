import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/hypothesis-bookmarklet/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        test: resolve(__dirname, "test/index.html"),
      },
    },
  },
});
