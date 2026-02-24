import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import Certificate from "@/models/Certificate";
import { requireAdmin } from "@/lib/guards";

const CERT_TYPES = ["Workshop", "Internship", "Course"] as const;

function normalizeType(value: unknown) {
  const normalized = String(value || "").trim();
  return CERT_TYPES.includes(normalized as (typeof CERT_TYPES)[number]) ? normalized : "Internship";
}

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  await connectDb();
  const data = await Certificate.find().sort({ createdAt: -1 }).limit(500);
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  try {
    await connectDb();
    const body = await req.json();
    const data = await Certificate.create({
      id: String(body.id || "").trim(),
      studentName: String(body.studentName || "").trim(),
      college: String(body.college || "").trim(),
      type: normalizeType(body.type),
      courseName: String(body.courseName || "").trim(),
      issueDate: String(body.issueDate || "").trim(),
      issuer: String(body.issuer || "Creative Ally").trim()
    });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Unable to create certificate" }, { status: 500 });
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
    const updated = await Certificate.findByIdAndUpdate(
      id,
      {
        id: String(body.id || "").trim(),
        studentName: String(body.studentName || "").trim(),
        college: String(body.college || "").trim(),
        type: normalizeType(body.type),
        courseName: String(body.courseName || "").trim(),
        issueDate: String(body.issueDate || "").trim(),
        issuer: String(body.issuer || "Creative Ally").trim()
      },
      { new: true, runValidators: true }
    );

    if (!updated) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Unable to update certificate" }, { status: 500 });
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
  const deleted = await Certificate.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
