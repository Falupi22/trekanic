import { Router } from "express"
import {
  getIssues,
  getAppointments,
  getAllMechanicsTakenTime,
  createAppointment,
  editAppointment,
  deleteAppointment,
  getAppointmentsOfAllUsers,
  getMechanics,
  getMechanicsByTime,
} from "../controllers"

const appointmentRouter = Router()

appointmentRouter.get("/appointment", getAppointments)
appointmentRouter.get("/appointment/taken-time", getAllMechanicsTakenTime)
appointmentRouter.post("/appointment/create", createAppointment)
appointmentRouter.get("/appointment/:month/:year", getAppointmentsOfAllUsers)
appointmentRouter.patch("/appointment/edit", editAppointment)
appointmentRouter.delete("/appointment/delete/:id", deleteAppointment)
appointmentRouter.get("/appointment/issue", getIssues)
appointmentRouter.get("/appointment/mechanic", getMechanics)
appointmentRouter.get("/appointment/mechanic/by-date/:time", getMechanicsByTime)

export default appointmentRouter
