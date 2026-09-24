import js from "@eslint/js"
import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

export default defineConfig([
    globalIgnores(["dist/**", "coverage/**", "logs/**", "node_modules/**"]),
    js.configs.recommended,
    {
        files: ["**/*.ts"],
        extends: [
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // express 5 forwards rejected async handlers to next(), so passing
            // them where a void-returning handler is expected is fine
            "@typescript-eslint/no-misused-promises": [
                "error",
                { checksVoidReturn: { arguments: false } },
            ],
            "@typescript-eslint/consistent-type-imports": [
                "error",
                { fixStyle: "inline-type-imports" },
            ],
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", caughtErrors: "none" },
            ],
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                { accessibility: "no-public" },
            ],
            eqeqeq: ["error", "always"],
            "no-console": "warn",
        },
    },
    {
        files: ["**/*.{js,mjs}"],
        extends: [tseslint.configs.disableTypeChecked],
    },
    prettier,
])
