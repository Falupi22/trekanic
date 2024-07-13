import mongoose, { Schema } from "mongoose"

export interface Alert {
  date: Date
  title: string
}

export interface AlertDocument extends mongoose.Document, Alert {}

const alertSchema: Schema = new mongoose.Schema({
  date: { type: String, require: true },
  title: [{ type: Schema.Types.String, require: true }],
})

export const AlertModel = mongoose.model("Alert", alertSchema, "alerts")
