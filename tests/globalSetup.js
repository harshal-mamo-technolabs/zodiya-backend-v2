/* global process, URL */
// creates the test database and applies the schema once per jest run
import { readFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { config } from "dotenv"
import mysql from "mysql2/promise"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

export default async function globalSetup() {
    config({ quiet: true, path: path.join(root, ".env.test") })
    const url = new URL(process.env.DATABASE_URL)
    const name = url.pathname.slice(1)
    url.pathname = "/"
    const connection = await mysql.createConnection({
        uri: url.toString(),
        multipleStatements: true,
    })
    await connection.query(
        `DROP DATABASE IF EXISTS \`${name}\`; CREATE DATABASE \`${name}\`; USE \`${name}\`;`,
    )
    await connection.query(
        await readFile(path.join(root, "scripts/sql/01_schema.sql"), "utf8"),
    )
    await connection.end()
}
