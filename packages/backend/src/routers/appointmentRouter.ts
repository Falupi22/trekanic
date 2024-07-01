import { Router } from "express"
import { createAppointment, editAppointment } from "../controllers"

const appointmentRouter = Router()

appointmentRouter.post("/appointment/create", createAppointment)
appointmentRouter.patch("/appointment/edit", editAppointment)

export default appointmentRouter
