import { connectDb } from "@/lib/db";
import Course from "@/models/Course";
import Internship from "@/models/Internship";

export async function getCourses() {
  await connectDb();
  return Course.find({ active: true }).lean();
}

export async function getInternships() {
  await connectDb();
  return Internship.find({ active: true }).lean();
}

export async function getCourseBySlug(slug: string) {
  await connectDb();
  return Course.findOne({ slug, active: true }).lean();
}

export async function getInternshipBySlug(slug: string) {
  await connectDb();
  return Internship.findOne({ slug, active: true }).lean();
}
