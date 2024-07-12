import mongoose, { Schema, Document, ObjectId } from "mongoose"
import { AppointmentModel } from "./Appointment.model"

interface Mechanic extends Document {
  fullName: string
  appointments: Array<mongoose.Types.ObjectId>
}

const mechanicSchema: Schema = new mongoose.Schema({
  fullName: { type: String, require: true },
  appointments: [{ type: Schema.Types.ObjectId, require: true, ref: AppointmentModel }],
})

export const MechanicModel = mongoose.model<Mechanic>("Mechanic", mechanicSchema, "mechanics")

export default Mechanic
