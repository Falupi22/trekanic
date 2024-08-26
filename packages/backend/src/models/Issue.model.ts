import mongoose, { Schema, Document, ObjectId } from "mongoose"
import { IssueCategoryModel } from "./IssueCategory.model"

interface Issue extends Document {
  catalogNumber: number
  description: string
  price: number
  category: Schema.Types.ObjectId
  duration: number
}

const issueSchema: Schema = new mongoose.Schema({
  catalogNumber: { type: Schema.Types.Number, require: true },
  description: { type: Schema.Types.String, require: true },
  price: { type: Schema.Types.Number, require: true },
  category: { type: Schema.Types.ObjectId, require: true, ref: IssueCategoryModel },
  duration: { type: Schema.Types.Number, require: false },
})

export const IssueModel = mongoose.model<Issue>("Issue", issueSchema, "issues")

export default Issue
