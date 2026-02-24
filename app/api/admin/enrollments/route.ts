import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { requireAdmin } from "@/lib/guards";

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  await connectDb();
  const data = await Enrollment.find().sort({ enrolledAt: -1 }).limit(200);
  return NextResponse.json({ data });
}
