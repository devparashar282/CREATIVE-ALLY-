import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { contactSchema } from "@/lib/validators";
import { sendContactAdminEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    await connectDb();
    await ContactMessage.create(parsed.data);
    const notificationSent = await sendContactAdminEmail(parsed.data);

    return NextResponse.json({ ok: true, notificationSent });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
