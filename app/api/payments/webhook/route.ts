import crypto from "crypto";
import { NextResponse } from "next/server";
import { finalizeSuccessfulPayment } from "@/lib/payment-finalize";

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json({ error: "Webhook secret is not configured" }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
    }

    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    if (!signaturesMatch(expected, signature)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    if (payload.event === "payment.captured") {
      const entity = payload?.payload?.payment?.entity;
      const orderId = entity?.order_id;
      const paymentId = entity?.id;
      const method = entity?.method;

      if (!orderId || !paymentId) {
        return NextResponse.json({ ok: true, ignored: true });
      }

      const result = await finalizeSuccessfulPayment({ orderId, paymentId, method, payload });
      if (!result.ok && result.status !== 404) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
