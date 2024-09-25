import mongoose, { Schema, Document } from "mongoose"

export interface ProductDocument {
  name: string
  catalogNumber: number
}

const productSchema: Schema = new mongoose.Schema({
  name: { type: String, require: true },
  catalogNumber: { type: Number, require: true },
})

export const ProductModel = mongoose.model<ProductDocument>("Product", productSchema, "products")

export default ProductModel
