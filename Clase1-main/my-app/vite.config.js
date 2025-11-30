import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["__test__/**/*.test.{js,jsx,ts,tsx}"],
    setupFiles: "__test__/setupTests.js",
    reporters: [
      "default",
      ["json", { outputFile: "__test__/vitest-report.json" }],
    ],
  },
});
