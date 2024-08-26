import { Issue } from "./Issue.model"
import { Mechanic } from "./Mechanic.model"
import { Product } from "./Product.model"
import { User } from "./User.model"

export type Appointment = {
  _id: string
  issue: Issue
  datetime: string
  description: string
  customer: User | string
  mechanic: Mechanic
  product: Product
}
