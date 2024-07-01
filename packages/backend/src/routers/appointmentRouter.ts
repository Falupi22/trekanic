import { Router } from "express"
import { createAppointment, editAppointment, deleteAppointment } from "../controllers"

const appointmentRouter = Router()

appointmentRouter.post("/appointment/create", createAppointment)
appointmentRouter.patch("/appointment/edit", editAppointment)
appointmentRouter.delete("/appointment/delete/:id", deleteAppointment)

export default appointmentRouter
