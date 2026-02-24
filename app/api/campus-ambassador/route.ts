import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import CampusAmbassadorApplication from "@/models/CampusAmbassadorApplication";
import { campusAmbassadorSchema } from "@/lib/validators";
import { sendAmbassadorEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = campusAmbassadorSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    await connectDb();
    await CampusAmbassadorApplication.create(parsed.data);
    const notificationSent = await sendAmbassadorEmail(parsed.data);

    return NextResponse.json({ ok: true, notificationSent });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
