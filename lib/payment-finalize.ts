import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import Payment from "@/models/Payment";
import Enrollment from "@/models/Enrollment";
import { sendPaymentReceiptEmails } from "@/lib/mail";

type FinalizePaymentInput = {
  orderId: string;
  paymentId: string;
  signature?: string;
  method?: string;
  payload?: unknown;
};

type FinalizePaymentSuccess = {
  ok: true;
  createdEnrollment: boolean;
};

type FinalizePaymentError = {
  ok: false;
  status: 404 | 500;
  error: string;
};

type FinalizePaymentResult = FinalizePaymentSuccess | FinalizePaymentError;

function fallbackText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export async function finalizeSuccessfulPayment(input: FinalizePaymentInput): Promise<FinalizePaymentResult> {
  try {
    await connectDb();
    const payment: any = await Payment.findOne({ orderId: input.orderId });
    if (!payment) {
      return { ok: false, status: 404, error: "Payment record missing" };
    }

    payment.paymentId = input.paymentId;
    if (input.signature) payment.signature = input.signature;
    if (input.method) payment.method = input.method;
    payment.status = "paid";

    if (input.payload) {
      // Keep original order notes and attach webhook payload separately.
      const currentPayload = toRecord(payment.payload) || {};
      payment.payload = { ...currentPayload, webhook: input.payload };
    }

    await payment.save();

    const payload = toRecord(payment.payload) || {};
    const notes = toRecord(payload.notes) || {};

    const enrollmentType = notes.type === "internship" ? "internship" : "course";
    const itemIdValue = fallbackText(notes.itemId, "");
    const itemId = mongoose.Types.ObjectId.isValid(itemIdValue) ? itemIdValue : payment._id;
    const studentName = fallbackText(notes.name, "Creative Ally Student");
    const college = fallbackText(notes.college, "Not Provided");
    const email = fallbackText(notes.email, "support@creativeally.local");
    const phone = fallbackText(notes.phone, "0000000000");
    const countryCode = fallbackText(notes.countryCode, "+00");
    const itemTitle = fallbackText(notes.itemTitle, "Creative Ally Program");

    const upsertResult = await Enrollment.updateOne(
      { orderId: input.orderId },
      {
        $set: {
          paymentId: input.paymentId,
          status: "paid",
          accessUnlocked: true,
          amountPaid: payment.amount
        },
        $setOnInsert: {
          userId: payment.userId,
          type: enrollmentType,
          itemId,
          itemTitle,
          amountPaid: payment.amount,
          paymentId: input.paymentId,
          orderId: input.orderId,
          status: "paid",
          accessUnlocked: true,
          college,
          email,
          phone,
          countryCode
        }
      },
      { upsert: true }
    );

    const createdEnrollment = upsertResult.upsertedCount > 0;
    if (createdEnrollment) {
      await sendPaymentReceiptEmails({
        studentName,
        email,
        phone,
        countryCode,
        college,
        itemType: enrollmentType,
        itemTitle,
        amount: payment.amount,
        orderId: input.orderId,
        paymentId: input.paymentId,
        status: "paid"
      });
    }

    return { ok: true, createdEnrollment };
  } catch (error) {
    console.error("Payment finalization failed", error);
    return { ok: false, status: 500, error: "Payment finalization failed" };
  }
}
