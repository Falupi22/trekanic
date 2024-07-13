import { Router } from "express"
import { getAlerts } from "../controllers"
import passport from "passport"

const alertRouter = Router()

alertRouter.get("/alert", getAlerts)

export default alertRouter
