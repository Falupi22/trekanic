import { Appointment } from "./Appointment.model"

export type Mechanic = {
  _id: string
  fullName: string
  appointments: Array<Appointment>
}
