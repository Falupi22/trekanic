import mongoose, { Schema, Document, ObjectId } from "mongoose"

interface ProductDocument extends Document {
  name: string
}

const nameSchema: Schema = new mongoose.Schema({
  name: { type: String, require: true },
})

export const ProductModel = mongoose.model<ProductDocument>("Product", nameSchema, "products")

export default ProductModel
