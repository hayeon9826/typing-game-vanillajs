/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  moduleFileExtensions: ["js", "json"],
  transform: {
    "^.+\\.(js)?$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "<rootDir>/**/*.test.(js)",
    "<rootDir>/(tests/unit/**/*.spec.(js)|**/__tests__/*.(js))",
  ],
  setupFilesAfterEnv: ["./test/setUpFile.js"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
