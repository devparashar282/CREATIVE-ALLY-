import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/guards";

function parseWhatYouLearn(value: unknown) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  await connectDb();
  const data = await Course.find().sort({ createdAt: -1 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  try {
    await connectDb();
    const body = await req.json();
    const created = await Course.create({
      slug: String(body.slug || "").trim(),
      title: String(body.title || "").trim(),
      description: String(body.description || "").trim(),
      whatYouLearn: parseWhatYouLearn(body.whatYouLearn),
      originalPrice: Number(body.originalPrice),
      discountedPrice: Number(body.discountedPrice),
      active: body.active !== false
    });
    return NextResponse.json({ data: created });
  } catch {
    return NextResponse.json({ error: "Unable to create course" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDb();
    const body = await req.json();
    const updated = await Course.findByIdAndUpdate(
      id,
      {
        slug: String(body.slug || "").trim(),
        title: String(body.title || "").trim(),
        description: String(body.description || "").trim(),
        whatYouLearn: parseWhatYouLearn(body.whatYouLearn),
        originalPrice: Number(body.originalPrice),
        discountedPrice: Number(body.discountedPrice),
        active: body.active !== false
      },
      { new: true, runValidators: true }
    );

    if (!updated) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Unable to update course" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectDb();
  const deleted = await Course.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
