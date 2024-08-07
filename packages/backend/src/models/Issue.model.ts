import mongoose, { Schema, Document, ObjectId } from "mongoose"
import { IssueCategoryModel } from "./IssueCategory.model"

interface Issue extends Document {
  code: string
  title: string
  price: number
  category: Schema.Types.ObjectId
  duration: number
}

const issueSchema: Schema = new mongoose.Schema({
  code: { type: Schema.Types.String, require: true },
  title: { type: Schema.Types.String, require: true },
  price: { type: Schema.Types.Number, require: true },
  category: { type: Schema.Types.ObjectId, require: true, ref: IssueCategoryModel },
  duration: { type: Schema.Types.Number, require: true },
})

export const IssueModel = mongoose.model<Issue>("Issue", issueSchema, "issues")

export default Issue
