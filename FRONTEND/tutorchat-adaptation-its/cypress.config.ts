import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://betatutorchat.uv.es",
  },
  chromeWebSecurity: false,
});
