import mongoose, { Document, Schema } from "mongoose"
import { IssueModel } from "./Issue.model"
import { User } from "./User.model"
import { MechanicModel } from "./Mechanic.model"
import ProductModel from "./Product.model"

interface AppointmentSchema {
  issue: mongoose.Types.ObjectId
  datetime: Date
  description: string
  customer: mongoose.Types.ObjectId
  mechanic: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
}

export interface Appointment extends AppointmentSchema, Document { }

export const appointmentSchema = new mongoose.Schema<Appointment>({
  issue: { type: Schema.Types.ObjectId, required: true, ref: IssueModel },
  datetime: { type: Date, required: true },
  description: { type: String, required: true, maxLength: 250 },
  customer: { type: Schema.Types.ObjectId, required: true, ref: User },
  mechanic: { type: Schema.Types.ObjectId, required: true, ref: MechanicModel },
  product: { type: Schema.Types.ObjectId, required: true, ref: ProductModel },
})

export const AppointmentModel = mongoose.model("Appointment", appointmentSchema, "appointments")

export default Appointment
