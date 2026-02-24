import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/guards";
import Enrollment from "@/models/Enrollment";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  await connectDb();
  const userId = (guard.session.user as any).id;
  const user: any = await User.findById(userId).lean();
  const enrollments = await Enrollment.find({ userId }).sort({ enrolledAt: -1 }).lean();
  const payments = await Payment.find({ userId }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    user: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      countryCode: user?.countryCode,
      imageUrl: user?.imageUrl
    },
    enrollments,
    payments
  });
}

