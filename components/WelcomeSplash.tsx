"use client";

import { useEffect, useState } from "react";

export default function WelcomeSplash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("ca_seen_welcome");
    if (!seen) {
      setShow(true);
      const t = setTimeout(() => {
        localStorage.setItem("ca_seen_welcome", "1");
        setShow(false);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, []);

  if (!show) return null;
  return (
    <div className="welcome-overlay">
      <div style={{ display: "grid", gap: 6, placeItems: "center" }}>
        <span>Welcome to Creative Ally</span>
        <span className="small" style={{ color: "rgba(223, 244, 255, 0.88)" }}>Build, Design, Grow</span>
      </div>
    </div>
  );
}
