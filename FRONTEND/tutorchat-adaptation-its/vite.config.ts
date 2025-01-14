import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "http://localhost:3000",
  server: {
    host: 'localhost',
    headers: {
      "Access-Control-Allow-Origin": "*", // Permitir cualquier origen
    },
  },
});
