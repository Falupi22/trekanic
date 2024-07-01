import { Router } from "express"
import { getAppointments, createAppointment, editAppointment, deleteAppointment } from "../controllers"

const appointmentRouter = Router()

appointmentRouter.get("/appointment", getAppointments)
appointmentRouter.post("/appointment/create", createAppointment)
appointmentRouter.patch("/appointment/edit", editAppointment)
appointmentRouter.delete("/appointment/delete/:id", deleteAppointment)

export default appointmentRouter
