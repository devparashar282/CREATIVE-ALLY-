import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/guards";
import { checkoutSchema } from "@/lib/validators";
import { getRazorpayClient } from "@/lib/razorpay";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import Payment from "@/models/Payment";

export async function POST(req: Request) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    await connectDb();

    const item = parsed.data.type === "course"
      ? await Course.findById(parsed.data.itemId)
      : await Internship.findById(parsed.data.itemId);

    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    const amount = parsed.data.type === "course" ? item.discountedPrice : item.price;

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `ca_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      notes: {
        userId: (guard.session.user as any).id,
        type: parsed.data.type,
        itemId: parsed.data.itemId,
        itemTitle: item.title,
        name: parsed.data.name,
        college: parsed.data.college,
        email: parsed.data.email,
        phone: parsed.data.phone,
        countryCode: parsed.data.countryCode
      }
    });

    await Payment.create({
      userId: (guard.session.user as any).id,
      orderId: order.id,
      amount,
      currency: "INR",
      status: "created",
      payload: order
    });

    return NextResponse.json({
      orderId: order.id,
      amount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
      notes: order.notes
    });
  } catch {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
