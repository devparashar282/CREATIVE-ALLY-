export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import Payment from "@/models/Payment";

export default async function AdminPaymentsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/admin/login");
  await connectDb();
  const rows = await Payment.find().sort({ createdAt: -1 }).limit(200).lean();

  return (
    <main className="container">
      <h1>Admin Payments</h1>
      <section className="card">
        <ul>
          {rows.map((r: any) => <li key={r._id.toString()}>{r.orderId} | INR {r.amount} | {r.status} | {r.paymentId || "-"}</li>)}
        </ul>
      </section>
    </main>
  );
}


