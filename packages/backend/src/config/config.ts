import { config } from "dotenv"

config({ path: "./.env" })

export const Config = {
  port: process.env.PORT ?? 8765,
  db_connection_string: process.env.DB_CONNECTION_STRING ?? "mongodb://localhost:27017/trekanic",
  session_secret: process.env.SESSION_SECRET ?? "default",
  web_server_url: process.env.WEB_SERVER_URL ?? "http://localhost:3000",
}
