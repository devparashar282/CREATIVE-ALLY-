"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setStatus("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (res.ok) {
      setStatus("If this email exists, a reset link has been sent.");
    } else {
      setStatus("Unable to process request right now. Please try again.");
    }

    setSaving(false);
  }

  return (
    <main className="container">
      <form className="card" onSubmit={onSubmit} style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1>Forgot Password</h1>
        <p className="small">Enter your email to receive a password reset link.</p>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Sending..." : "Send Reset Link"}
        </button>
        <p className="small">{status}</p>
        <p className="small">
          Back to <Link href="/login">User Login</Link> or <Link href="/admin/login">Admin Login</Link>
        </p>
      </form>
    </main>
  );
}
