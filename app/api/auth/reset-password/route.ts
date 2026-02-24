import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/models/User";
import { resetPasswordSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const tokenHash = crypto.createHash("sha256").update(parsed.data.token).digest("hex");
    await connectDb();

    const user: any = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ error: "Reset link is invalid or expired" }, { status: 400 });
    }

    const email = String(user.email || "");
    const role = String(user.role || "student");

    user.passwordHash = await bcrypt.hash(parsed.data.password, 10);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await user.save();

    return NextResponse.json({ ok: true, email, role });
  } catch {
    return NextResponse.json({ error: "Could not reset password" }, { status: 500 });
  }
}
