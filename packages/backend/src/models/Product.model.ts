import mongoose, { Schema, Document } from "mongoose"

interface ProductDocument extends Document {
  name: string,
  catalogNumber: number
}

const nameSchema: Schema = new mongoose.Schema({
  name: { type: String, require: true },
  catalogNumber: { type: Number, require: true },
})

export const ProductModel = mongoose.model<ProductDocument>("Product", nameSchema, "products")

export default ProductModel
