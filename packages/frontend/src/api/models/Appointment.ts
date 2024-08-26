import { Issue } from "./Issue"
import { Mechanic } from "./Mechanic"
import { Product } from "./Product"
import { User } from "./User"

export interface Appointment {
  _id: string
  issue: Issue
  datetime: string
  description: string
  customer: User | string
  mechanic: Mechanic
  product: Product
}
