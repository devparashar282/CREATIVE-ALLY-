import { NextResponse } from "next/server";
import { requireUser } from "@/lib/guards";
import { connectDb } from "@/lib/db";
import Payment from "@/models/Payment";

export async function GET(req: Request) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId")?.trim();
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  await connectDb();
  const payment: any = await Payment.findOne({
    orderId,
    userId: (guard.session.user as any).id
  }).select("status paymentId orderId");

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json({
    orderId: payment.orderId,
    paymentId: payment.paymentId || null,
    status: payment.status
  });
}
