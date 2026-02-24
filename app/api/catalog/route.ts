import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Course from "@/models/Course";
import Internship from "@/models/Internship";

export async function GET() {
  await connectDb();
  const courses = await Course.find({ active: true }).select("title discountedPrice").lean();
  const internships = await Internship.find({ active: true }).select("title price").lean();
  return NextResponse.json({ courses, internships });
}
