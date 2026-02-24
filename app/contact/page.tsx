"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setStatus(res.ok ? "Message submitted successfully" : "Failed to submit message");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <main className="container">
      <div className="hero">
        <section className="card">
          <h1>Contact Us</h1>
          <p className="small">Email: creativeally2811@gmail.com</p>
          <p className="small">Phone: +91-XXXXXXXXXX</p>
          <p className="small">Address: Kashi Institute of Technology, Varanasi, Uttar Pradesh</p>
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80" alt="contact" style={{ width: "100%", borderRadius: 12 }} />
        </section>
        <form className="card" onSubmit={onSubmit}>
          <div className="field"><label>Name</label><input name="name" placeholder="Enter your name" required /></div>
          <div className="field"><label>Email ID</label><input name="email" type="email" placeholder="Enter your email" required /></div>
          <div className="field"><label>Country Code</label><input name="countryCode" defaultValue="+91" required /></div>
          <div className="field"><label>Phone Number</label><input name="phone" placeholder="Enter phone number" required /></div>
          <div className="field"><label>Subject</label><select name="subject" required><option value="Course Inquiry">Course Inquiry</option><option value="Internship Inquiry">Internship Inquiry</option><option value="Payment Support">Payment Support</option><option value="General">General</option></select></div>
          <div className="field"><label>Message</label><textarea name="message" rows={5} placeholder="Enter your message" required /></div>
          <button className="btn" type="submit">Send Message</button>
          <p className="small">{status}</p>
        </form>
      </div>
    </main>
  );
}

