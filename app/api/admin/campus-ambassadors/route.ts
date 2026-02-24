import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import CampusAmbassadorApplication from "@/models/CampusAmbassadorApplication";
import { requireAdmin } from "@/lib/guards";

const STATUS_VALUES = ["new", "reviewed", "approved", "rejected"] as const;
type AmbassadorStatus = (typeof STATUS_VALUES)[number];

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  await connectDb();
  const data = await CampusAmbassadorApplication.find().sort({ createdAt: -1 }).limit(200);
  return NextResponse.json({ data });
}

export async function PATCH(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  try {
    const body = await req.json();
    const id = String(body?.id || "");
    const status = String(body?.status || "") as AmbassadorStatus;

    if (!mongoose.Types.ObjectId.isValid(id) || !STATUS_VALUES.includes(status)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await connectDb();
    const updated = await CampusAmbassadorApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: "Application not found" }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Unable to update application" }, { status: 500 });
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
  const deleted = await CampusAmbassadorApplication.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
