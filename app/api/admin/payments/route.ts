import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Payment from "@/models/Payment";
import { requireAdmin } from "@/lib/guards";

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  await connectDb();
  const data = await Payment.find().sort({ createdAt: -1 }).limit(200);
  return NextResponse.json({ data });
}
