import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import User from "@/models/User";
import { signupSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await connectDb();

    const email = parsed.data.email.toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Already have an account, please log in" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    await User.create({
      name: parsed.data.name,
      email,
      passwordHash,
      countryCode: parsed.data.countryCode,
      phone: parsed.data.phone,
      role: "student"
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
