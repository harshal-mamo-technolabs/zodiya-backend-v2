import { createPublicKey } from "crypto"
import { config as dotenvConfig } from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const NODE_ENV = process.env.NODE_ENV ?? "development"

dotenvConfig({
    quiet: true,
    path: path.join(__dirname, `../../.env.${NODE_ENV}`),
})

function requireEnv(key: string): string {
    const value = process.env[key]
    if (value === undefined || value === "") {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
}

function requirePem(key: string): string {
    const value = requireEnv(key).replace(/\\n/g, "\n")
    if (!value.startsWith("-----BEGIN")) {
        throw new Error(`Environment variable ${key} is not a valid PEM key`)
    }
    return value
}

const PRIVATE_KEY = requirePem("PRIVATE_KEY")

export const config = {
    PORT: requireEnv("PORT"),
    NODE_ENV: requireEnv("NODE_ENV"),
    MONGO_URI: requireEnv("MONGO_URI"),
    REFRESH_TOKEN_SECRET: requireEnv("REFRESH_TOKEN_SECRET"),
    PRIVATE_KEY,
    // derived from the private key so the verifier never drifts from the signer
    PUBLIC_KEY: createPublicKey(PRIVATE_KEY)
        .export({ type: "spki", format: "pem" })
        .toString(),
    GOOGLE_MAPS_API_KEY: requireEnv("GOOGLE_MAPS_API_KEY"),
}
