// TODO: Install mongoose package: npm install mongoose
// import mongoose, { Model } from "mongoose";

export interface IProductView {
  _id: string;
  productId: string;
  productHandle: string;
  viewCount: number;
  lastViewedAt: Date;
  createdAt: Date;
}

// const ProductViewSchema = new mongoose.Schema<IProductView>({
//   productId: { type: String, required: true, unique: true },
//   productHandle: { type: String, required: true },
//   viewCount: { type: Number, default: 0 },
//   lastViewedAt: { type: Date, default: Date.now },
//   createdAt: { type: Date, default: Date.now },
// });

// // Index for faster queries
// ProductViewSchema.index({ viewCount: -1 });
// ProductViewSchema.index({ lastViewedAt: -1 });

// export const ProductView: Model<IProductView> =
//   (mongoose.models.ProductView as Model<IProductView>) ||
//   mongoose.model<IProductView>("ProductView", ProductViewSchema);

export const ProductView: any = null;
