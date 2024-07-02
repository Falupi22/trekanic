import { Router } from "express"
import { login, logout, authenticate } from "../controllers"

const sessionRouter = Router()

sessionRouter.post("/login", login)
sessionRouter.post("/logout", logout)
sessionRouter.get("/authenticate", authenticate)

export default sessionRouter
