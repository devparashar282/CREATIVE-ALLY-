"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutPageContent() {
  const { data: session, status } = useSession();
  const params = useSearchParams();
  const router = useRouter();

  const [catalog, setCatalog] = useState<{ courses: any[]; internships: any[] }>({ courses: [], internships: [] });
  const [type, setType] = useState((params.get("type") as "course" | "internship") || "course");
  const [itemId, setItemId] = useState(params.get("id") || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/catalog").then((r) => r.json()).then(setCatalog).catch(() => setCatalog({ courses: [], internships: [] }));
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      const target = `/checkout?type=${encodeURIComponent(type)}&id=${encodeURIComponent(itemId || "")}`;
      router.replace(`/login?next=${encodeURIComponent(target)}`);
    }
  }, [status, router, type, itemId]);

  const items = useMemo(() => (type === "course" ? catalog.courses : catalog.internships), [catalog, type]);
  const selected = items.find((x: any) => x._id === itemId);
  const amount = selected ? (type === "course" ? selected.discountedPrice : selected.price) : 0;

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForPaymentConfirmation(orderId: string, attempts = 6, intervalMs = 1200) {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const statusRes = await fetch(`/api/payments/status?orderId=${encodeURIComponent(orderId)}`, {
        method: "GET",
        cache: "no-store"
      });
      if (statusRes.ok) {
        const statusPayload = await statusRes.json();
        if (statusPayload?.status === "paid") return true;
      }
      await sleep(intervalMs);
    }
    return false;
  }

  async function handlePayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user) return;

    const fd = new FormData(e.currentTarget);
    const payload = {
      type,
      itemId,
      name: String(fd.get("name") || ""),
      college: String(fd.get("college") || ""),
      email: String(fd.get("email") || ""),
      countryCode: String(fd.get("countryCode") || ""),
      phone: String(fd.get("phone") || "")
    };

    const orderRes = await fetch("/api/enrollments/checkout-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!orderRes.ok) {
      const errorPayload = await orderRes.json().catch(() => null);
      setMessage(errorPayload?.error || "Order creation failed");
      return;
    }

    const order = await orderRes.json();
    if (!window.Razorpay) {
      setMessage("Payment gateway could not be loaded. Please refresh and try again.");
      return;
    }

    const rzp = new window.Razorpay({
      key: order.key,
      amount: order.amount * 100,
      currency: "INR",
      name: "Creative Ally",
      description: `${type} enrollment`,
      order_id: order.orderId,
      handler: async (response: any) => {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        });

        if (verifyRes.ok) {
          setMessage("Payment successful. Redirecting...");
          setTimeout(() => router.push("/"), 1200);
        } else {
          setMessage("Payment received. Confirming status...");
          const paid = await waitForPaymentConfirmation(order.orderId);
          if (paid) {
            setMessage("Payment successful. Redirecting...");
            setTimeout(() => router.push("/"), 1200);
          } else {
            setMessage(`Payment verification failed. Please contact support with Order ID: ${order.orderId}`);
          }
        }
      },
      prefill: {
        name: payload.name,
        email: payload.email,
        contact: `${payload.countryCode}${payload.phone}`
      },
      theme: { color: "#08d9d6" }
    });

    rzp.open();
  }

  if (status === "loading") return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      <form className="card" onSubmit={handlePayment} style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1>Enrollment Payment</h1>
        <div className="field"><label>Name</label><input name="name" placeholder="Enter your name" required /></div>
        <div className="field"><label>College / University</label><input name="college" placeholder="Enter college or university" required /></div>
        <div className="field"><label>Phone Country Code</label><input name="countryCode" defaultValue="+91" required /></div>
        <div className="field"><label>Phone Number</label><input name="phone" placeholder="Enter phone number" required /></div>
        <div className="field"><label>Email ID</label><input name="email" type="email" defaultValue={session?.user?.email || ""} required /></div>
        <div className="field"><label>Select Type</label><select value={type} onChange={(e) => { setType(e.target.value as any); setItemId(""); }}><option value="course">Course</option><option value="internship">Internship</option></select></div>
        <div className="field"><label>Select {type === "course" ? "Course" : "Internship"}</label><select value={itemId} onChange={(e) => setItemId(e.target.value)} required><option value="">Select</option>{items.map((it: any) => <option key={it._id} value={it._id}>{it.title}</option>)}</select></div>
        <p className="price-new">Amount: INR {amount || 0}</p>
        <button type="submit" className="btn" disabled={!itemId}>Proceed to Payment</button>
        <p className="small">{message}</p>
      </form>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="container"><p>Loading checkout...</p></main>}>
      <CheckoutPageContent />
    </Suspense>
  );
}

