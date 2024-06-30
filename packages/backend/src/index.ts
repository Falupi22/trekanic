import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import passport from "passport"
import mongoose from "mongoose"
import session from "express-session"
import passportLocalMongoose from "passport-local-mongoose"
import { User, setUserPlugin, setUserModel } from "./models"
import { Config } from "./config"
import { appointmentRouter, sessionRouter } from "./routers"

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
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
  // Allows access to the trekanic site only!
  app.use(cors())
}

function setSchemaPlugins() {
  setUserPlugin(passportLocalMongoose)

  // The model itself is created ONLY after the plugin was set.
  setUserModel()
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
}

connectToDB()
setMiddlewares()
setSchemaPlugins()
setPassport()
setRoutes()

app.listen(Config.port, () => {
  console.log(`Express is listening at http://localhost:${Config.port}!`)
})

export default app
