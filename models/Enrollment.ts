import { Schema, model, models } from "mongoose";

const enrollmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["course", "internship"], required: true },
    itemId: { type: Schema.Types.ObjectId, required: true },
    itemTitle: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    status: { type: String, default: "paid" },
    accessUnlocked: { type: Boolean, default: true },
    college: { type: String, required: true },
    phone: { type: String, required: true },
    countryCode: { type: String, required: true },
    email: { type: String, required: true }
  },
  { timestamps: { createdAt: "enrolledAt", updatedAt: true } }
);

const Enrollment = models.Enrollment || model("Enrollment", enrollmentSchema);
export default Enrollment;
