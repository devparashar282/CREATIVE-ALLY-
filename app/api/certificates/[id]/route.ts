import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Certificate from "@/models/Certificate";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;
  const cert = await Certificate.findOne({ id: { $regex: `^${id}$`, $options: "i" } }).lean();
  if (!cert) return NextResponse.json({ certificate: null }, { status: 404 });
  return NextResponse.json({ certificate: cert });
}
