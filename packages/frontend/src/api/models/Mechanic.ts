import { Appointment } from "./Appointment"

export interface Mechanic {
  _id: string
  fullName: string
  appointments: Array<Appointment>
}
