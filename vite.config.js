import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    build: {
      sourcemap: !isProduction, // Enable sourcemap only in development
      rollupOptions: {
        input: {
          main: "./index.html",
        },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [
          { src: "public/*.json", dest: "" }, // Copy all JSON files from public
          { src: "src/*.js", dest: "" }, // Copy all JS files from src
          { src: "src/*.css", dest: "" }, // Copy all CSS files from src
        ],
      }),
      tailwindcss(),
    ],
  };
});
