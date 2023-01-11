const packageJson = require("./package.json");

module.exports = {
  name: packageJson.name,
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
