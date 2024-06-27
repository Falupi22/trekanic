import mongoose, { PassportLocalModel } from "mongoose"

export interface UserDocument extends mongoose.Document {
  email: mongoose.Schema.Types.String
  password: mongoose.Schema.Types.String
}

export let User: PassportLocalModel<UserDocument> | null = null

export const userSchema = new mongoose.Schema<UserDocument>()

export function setUserModel() {
  if (!User) {
    User = mongoose.model("User", userSchema, "users")
  }
}

export function setUserPlugin(plugin) {
  userSchema.plugin(plugin)
}
