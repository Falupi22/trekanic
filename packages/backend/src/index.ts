import express, { Router } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import passport from "passport"
import mongoose from "mongoose"
import session from "express-session"
import { User } from "./models"
import { Config } from "./config"
import asyncHandler from "express-async-handler"
import { appointmentRouter, sessionRouter, alertRouter } from "./routers"

const app = express()

function connectToDB() {
  mongoose.connect(Config.db_connection_string)
}

function setMiddlewares() {
  // Using all the files from the public folder
  app.use(express.static("public"))
  app.use(bodyParser.json())
  app.use(
    session({
      secret: Config.session_secret,
      resave: false,
      saveUninitialized: false,
      cookie:
        process.env.NODE_ENV === "production"
          ? {
              secure: true, // Ensure cookies are sent only over HTTPS
              httpOnly: true, // Prevent JavaScript from accessing the cookie
              sameSite: "none", // Required for cross-origin requests
            }
          : null,
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
  // Allows access to the trekanic site only!
  app.use(
    cors({
      credentials: true,
      origin: [Config.web_server_url, "https://trekanic-fork-frontend.vercel.app"],
    }),
  )
}

function setPassport() {
  passport.use(User.createStrategy())
  passport.serializeUser((user, cb) => {
    cb(null, user)
  })
  passport.deserializeUser((user, cb) => {
    cb(null, user)
  })
}

function setRoutes() {
  app.use(sessionRouter)
  app.use(appointmentRouter)
  app.use(alertRouter)

  const checkRouter = Router()
  checkRouter.get(
    "/health",
    asyncHandler(async (req, res, next) => {
      // For cronjob
      res.status(200).json()
    }),
  )
  app.use(checkRouter)
}

connectToDB()
setMiddlewares()
setPassport()
setRoutes()

app.listen(Config.port)

export default app
