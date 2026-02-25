import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/guards";
import Enrollment from "@/models/Enrollment";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const userId = (guard.session.user as any).id;
  let user: any = null;
  let enrollments: any[] = [];
  let payments: any[] = [];

  try {
    await connectDb();
    user = await User.findById(userId).lean();
    enrollments = await Enrollment.find({ userId }).sort({ enrolledAt: -1 }).lean();
    payments = await Payment.find({ userId }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error("Dashboard API fallback mode: DB unavailable", error);
  }

  return NextResponse.json({
    user: {
      name: user?.name || guard.session.user.name,
      email: user?.email || guard.session.user.email,
      phone: user?.phone || (guard.session.user as any).phone,
      countryCode: user?.countryCode || (guard.session.user as any).countryCode,
      imageUrl: user?.imageUrl
    },
    enrollments,
    payments
  });
}

