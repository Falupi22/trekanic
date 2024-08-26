import { IssueCategory } from "./IssueCategory"

export interface Issue {
  _id: string
  catalogNumber: string
  description: string
  price: number
  category: IssueCategory
  duration: number
}
