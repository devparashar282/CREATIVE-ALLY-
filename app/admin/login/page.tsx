"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) return setError("Login failed");
    router.push("/admin");
  }

  return (
    <main className="container">
      <form className="card" onSubmit={onSubmit} style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1>Admin Login</h1>
        <div className="field"><label>Email</label><input name="email" type="email" required /></div>
        <div className="field"><label>Password</label><input name="password" type="password" required /></div>
        <button className="btn" type="submit">Log In</button>
        <p className="small" style={{ color: "#ff8a8a" }}>{error}</p>
        <p className="small"><Link href="/forgot-password">Forgot password?</Link></p>
      </form>
    </main>
  );
}

