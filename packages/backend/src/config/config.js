"use strict"
exports.__esModule = true
exports.Config = void 0
var dotenv_1 = require("dotenv")
;(0, dotenv_1.config)({ path: "./.env" })
exports.Config = {
  port: process.env.PORT || 3000,
  db_connection_string: process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/trekanic",
  session_secret: process.env.SESSION_SECRET || "default",
}
