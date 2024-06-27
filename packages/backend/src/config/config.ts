import { config } from "dotenv"

config({ path: "./.env" })

export const Config = {
  port: process.env.PORT || 3000,
  db_connection_string: process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/trekanic",
  session_secret: process.env.SESSION_SECRET || "default",
}
