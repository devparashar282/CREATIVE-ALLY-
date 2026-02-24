import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validators";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await connectDb();

    const email = parsed.data.email.toLowerCase();
    const user: any = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      user.passwordResetTokenHash = resetTokenHash;
      user.passwordResetExpiresAt = expiresAt;
      await user.save();

      const origin = process.env.NEXTAUTH_URL || new URL(req.url).origin;
      const resetLink = `${origin}/reset-password?token=${encodeURIComponent(resetToken)}`;
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetLink
      });
    }

    return NextResponse.json({
      ok: true,
      message: "If this email exists, a reset link has been sent."
    });
  } catch {
    return NextResponse.json({ error: "Could not process request" }, { status: 500 });
  }
}
