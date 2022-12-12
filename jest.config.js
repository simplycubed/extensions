module.exports = {
  projects: [
    "webflow-memberships"
  ],
  testPathIgnorePatterns: [
    ".*/bin/",
    ".*/lib/",
    // Ignoring otherwise tests duplicate due to Jest `projects`
    ".*/__tests__/.*.ts",
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/test-data/**",
  ],
  maxConcurrency: 10,
};
