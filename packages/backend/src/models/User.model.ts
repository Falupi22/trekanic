import mongoose, { PassportLocalModel } from "mongoose"
import passportLocalMongoose from "passport-local-mongoose"

export interface UserDocument extends mongoose.Document {
  email: mongoose.Schema.Types.String
  password: mongoose.Schema.Types.String
}

export const userSchema = new mongoose.Schema<UserDocument>()
userSchema.plugin(passportLocalMongoose)

export const User = mongoose.model("User", userSchema, "users")
