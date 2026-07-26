// TODO: Install mongoose package: npm install mongoose
// import mongoose, { Model } from "mongoose";

export interface IOrderItem {
  merchandiseId: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ICustomerDetails {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  district?: string;
  city?: string;
  notes?: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  txCode: string;
  status?:
    | "Processing"
    | "Payment Processing"
    | "Payment Approved"
    | "On Delivery"
    | "Delivered"
    | "Cancelled";
  customerDetails?: ICustomerDetails;
  items: IOrderItem[];
  totalAmount: number;
  createdAt: Date;
}

// const OrderSchema = new mongoose.Schema<IOrder>({
//   userId: { type: String, required: true },
//   txCode: { type: String, required: true, unique: true },
//   status: {
//     type: String,
//     enum: [
//       "Processing",
//       "Payment Processing",
//       "Payment Approved",
//       "On Delivery",
//       "Delivered",
//       "Cancelled",
//     ],
//     default: "Processing",
//   },
//   customerDetails: {
//     firstName: String,
//     lastName: String,
//     email: String,
//     phone: String,
//     address: String,
//     district: String,
//     city: String,
//     notes: String,
//   },
//   items: [
//     {
//       merchandiseId: String,
//       title: String,
//       quantity: Number,
//       price: Number,
//       image: String,
//     },
//   ],
//   totalAmount: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// export const Order: Model<IOrder> =
//   (mongoose.models.Order as Model<IOrder>) ||
//   mongoose.model<IOrder>("Order", OrderSchema);

export const Order: any = null;
