"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setStatus("Registration successful. Please log in.");
      router.push("/login");
      return;
    }
    const data = await res.json();
    setStatus(data.error || "Signup failed");
  }

  return (
    <main className="container">
      <form className="card" onSubmit={onSubmit} style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1>Sign Up</h1>
        <div className="field"><label>Name</label><input name="name" placeholder="Enter your name" required /></div>
        <div className="field"><label>Email ID</label><input name="email" type="email" placeholder="Enter your email" required /></div>
        <div className="field"><label>Country Code</label><input name="countryCode" defaultValue="+91" required /></div>
        <div className="field"><label>Phone Number</label><input name="phone" placeholder="Enter phone number" required /></div>
        <div className="field"><label>Password</label><input name="password" type="password" required minLength={8} /></div>
        <button className="btn" type="submit">Create Account</button>
        <p className="small">{status}</p>
        <p className="small">Already registered? <Link href="/login">Log in</Link></p>
      </form>
    </main>
  );
}

