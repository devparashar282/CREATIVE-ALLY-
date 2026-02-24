"use client";

import { useState } from "react";

export default function CampusAmbassadorPage() {
  const [status, setStatus] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const res = await fetch("/api/campus-ambassador", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setStatus(res.ok ? "Application submitted" : "Submission failed");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Campus Ambassador Program</h1>
        <p className="small">Represent Creative Ally on your campus and gain leadership, networking, and career growth opportunities.</p>
      </section>
      <form className="card" style={{ marginTop: 14 }} onSubmit={onSubmit}>
        <div className="field"><label>Name</label><input name="name" placeholder="Enter your name" required /></div>
        <div className="field"><label>College / University</label><input name="college" placeholder="Enter college or university" required /></div>
        <div className="field"><label>Email ID</label><input name="email" type="email" placeholder="Enter your email" required /></div>
        <div className="field"><label>Country Code</label><input name="countryCode" defaultValue="+91" required /></div>
        <div className="field"><label>Phone Number</label><input name="phone" placeholder="Enter phone number" required /></div>
        <button className="btn" type="submit">Apply Now</button>
        <p className="small">{status}</p>
      </form>
    </main>
  );
}

