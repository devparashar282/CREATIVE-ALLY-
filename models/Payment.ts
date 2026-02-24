import { Schema, model, models } from "mongoose";

const paymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    method: { type: String },
    payload: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Payment = models.Payment || model("Payment", paymentSchema);
export default Payment;
