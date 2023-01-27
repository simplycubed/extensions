import type { Config } from "jest";

const packageJson = require("./package.json");

const config: Config = {
  displayName: packageJson.name,
  preset: "ts-jest",
  testMatch: ["**/__tests__/*.test.ts"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/test-data/**",
  ],
  collectCoverage: true,
  coverageReporters: ["json", "html"],
  setupFilesAfterEnv: [],
};

export default config;
