import mongoose, { Schema, Document } from "mongoose"

interface IssueCategory extends Document {
  name: string // Duration in minutes
  duration: number
  // Define other properties
}

const issueCategorySchema: Schema = new mongoose.Schema({
  name: { type: Schema.Types.String, require: true },
  duration: { type: Schema.Types.Number, require: true },
})

export const IssueCategoryModel = mongoose.model<IssueCategory>("IssueCategory", issueCategorySchema, "issueCategories")

export default IssueCategory
