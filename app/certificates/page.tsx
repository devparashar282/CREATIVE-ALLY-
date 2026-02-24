"use client";

import { useState } from "react";

type Cert = {
  id: string;
  studentName: string;
  college: string;
  type: string;
  courseName: string;
  issueDate: string;
  issuer: string;
};

export default function CertificatesPage() {
  const [id, setId] = useState("");
  const [cert, setCert] = useState<Cert | null>(null);
  const [status, setStatus] = useState("");

  async function verify() {
    setStatus("Checking...");
    setCert(null);
    const res = await fetch(`/api/certificates/${encodeURIComponent(id)}`);
    if (!res.ok) {
      setStatus("Certificate not found");
      return;
    }
    const data = await res.json();
    setCert(data.certificate);
    setStatus("Verified");
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Check Your Certificate</h1>
        <p className="small">Enter certificate ID exactly as provided on your certificate.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. CA/INT/2025/001" style={{ flex: 1, minWidth: 220 }} />
          <button className="btn" onClick={verify}>Verify</button>
        </div>
        <p className="small">{status}</p>
      </section>
      {cert && (
        <section className="card" style={{ marginTop: 14 }}>
          <h3>{cert.studentName}</h3>
          <p className="small">Certificate ID: {cert.id}</p>
          <p className="small">Type: {cert.type}</p>
          <p className="small">Program: {cert.courseName}</p>
          <p className="small">College: {cert.college}</p>
          <p className="small">Issue Date: {cert.issueDate}</p>
          <p className="small">Issuer: {cert.issuer}</p>
        </section>
      )}
    </main>
  );
}

