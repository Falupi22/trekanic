import { Router } from "express"
import { createAppointment } from "../controllers"

const appointmentRouter = Router()

appointmentRouter.post("/appointment/create", createAppointment)

export default appointmentRouter
