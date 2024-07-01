import { Router } from "express"
import {
  getIssues,
  getAppointments,
  getAllMechanicsTakenTime,
  createAppointment,
  editAppointment,
  deleteAppointment,
} from "../controllers"

const appointmentRouter = Router()

appointmentRouter.get("/appointment", getAppointments)
appointmentRouter.get("/appointment/taken-time", getAllMechanicsTakenTime)
appointmentRouter.post("/appointment/create", createAppointment)
appointmentRouter.patch("/appointment/edit", editAppointment)
appointmentRouter.delete("/appointment/delete/:id", deleteAppointment)
appointmentRouter.get("/appointment/issue", getIssues)

export default appointmentRouter
