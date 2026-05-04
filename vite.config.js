import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/HKU-POLI3148-Group/",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true
  }
});
