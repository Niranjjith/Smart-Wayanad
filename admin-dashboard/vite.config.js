import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      include: "**/*.{js,jsx,ts,tsx}",
    }),
  ],

  // Needed for Vercel build
  build: {
    outDir: "dist",
  },

  // Optional – local dev customization
  server: {
    port: 5173,
    open: true,
  },
});
