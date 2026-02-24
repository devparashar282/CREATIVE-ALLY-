"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [resolvedEmail, setResolvedEmail] = useState("");
  const [resolvedRole, setResolvedRole] = useState<"student" | "admin">("student");

  function getLoginPath(role: string) {
    return role === "admin" ? "/admin/login" : "/login";
  }

  function getDashboardPath(role: string) {
    return role === "admin" ? "/admin" : "/dashboard";
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");

    if (!token) {
      setStatus("Reset link is invalid.");
      return;
    }

    if (password.length < 8) {
      setStatus("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });

    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      setStatus(payload?.error || "Could not reset password.");
      setSaving(false);
      return;
    }

    const role = payload?.role === "admin" ? "admin" : "student";
    const email = typeof payload?.email === "string" ? payload.email : "";

    setResolvedRole(role);
    setResolvedEmail(email);
    setStatus("Password reset successful. Redirecting to login...");
    setTimeout(() => router.push(getLoginPath(role)), 1500);
  }

  async function enterDashboard() {
    if (!resolvedEmail || password.length < 8) return;
    setSaving(true);
    setStatus("Signing you in...");

    const result = await signIn("credentials", {
      email: resolvedEmail,
      password,
      redirect: false
    });

    if (result?.error) {
      setStatus("Please login manually with your new password.");
      setSaving(false);
      return;
    }

    router.push(getDashboardPath(resolvedRole));
  }

  return (
    <main className="container">
      <form className="card" onSubmit={onSubmit} style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1>Reset Password</h1>
        <p className="small">Set a new password for your account.</p>
        <div className="field">
          <label>New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />
        </div>
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Password"}
        </button>
        {resolvedEmail ? (
          <button type="button" className="btn btn-outline" onClick={enterDashboard} disabled={saving}>
            Enter Dashboard
          </button>
        ) : null}
        <p className="small">{status}</p>
        <p className="small">
          Back to <Link href={getLoginPath(resolvedRole)}>Login</Link>
        </p>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="container"><p>Loading...</p></main>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
