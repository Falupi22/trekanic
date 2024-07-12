import mongoose from "mongoose"
import passportLocalMongoose from "passport-local-mongoose"

export interface UserInterface {
  email: string
  password: string
  isAdmin: boolean
}

export interface UserDocument extends mongoose.Document, UserInterface {}

export const userSchema = new mongoose.Schema<UserDocument>()
userSchema.plugin(passportLocalMongoose)

export const User = mongoose.model("User", userSchema, "users")
