import { IssueCategory } from "./IssueCategory.model"

export type Issue = {
  _id: string
  catalogNumber: string
  description: string
  price: number
  category: IssueCategory
  duration: number
}
