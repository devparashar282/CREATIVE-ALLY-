import { connectDb } from "@/lib/db";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import { courseSeed, internshipSeed } from "@/data/catalog";

function fallbackCourses() {
  return courseSeed.map((course) => ({
    _id: course.slug,
    active: true,
    ...course
  }));
}

function fallbackInternships() {
  return internshipSeed.map((internship) => ({
    _id: internship.slug,
    active: true,
    ...internship
  }));
}

export async function getCourses() {
  try {
    await connectDb();
    const courses = await Course.find({ active: true }).lean();
    return courses.length > 0 ? courses : fallbackCourses();
  } catch (error) {
    console.error("getCourses failed, using fallback seed data", error);
    return fallbackCourses();
  }
}

export async function getInternships() {
  try {
    await connectDb();
    const internships = await Internship.find({ active: true }).lean();
    return internships.length > 0 ? internships : fallbackInternships();
  } catch (error) {
    console.error("getInternships failed, using fallback seed data", error);
    return fallbackInternships();
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    await connectDb();
    const course = await Course.findOne({ slug, active: true }).lean();
    if (course) return course;
  } catch (error) {
    console.error(`getCourseBySlug failed for ${slug}, trying fallback`, error);
  }

  return fallbackCourses().find((course) => course.slug === slug) ?? null;
}

export async function getInternshipBySlug(slug: string) {
  try {
    await connectDb();
    const internship = await Internship.findOne({ slug, active: true }).lean();
    if (internship) return internship;
  } catch (error) {
    console.error(`getInternshipBySlug failed for ${slug}, trying fallback`, error);
  }

  return fallbackInternships().find((internship) => internship.slug === slug) ?? null;
}
