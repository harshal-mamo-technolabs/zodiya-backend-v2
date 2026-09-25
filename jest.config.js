import { createDefaultEsmPreset } from "ts-jest"

const presetConfig = createDefaultEsmPreset()

/** @type {import("jest").Config} **/
export default {
    ...presetConfig,
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    coverageProvider: "v8",
    collectCoverageFrom: ["src/**/*.ts", "!tests/**", "!node_modules/**"],
    // needs the MySQL from docker-compose.yml; see DATABASE_URL in .env.test
    globalSetup: "<rootDir>/tests/globalSetup.js",
    testTimeout: 20000,
}
