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
    // first MongoMemoryServer boot is slower than jest's 5s default
    testTimeout: 20000,
}
