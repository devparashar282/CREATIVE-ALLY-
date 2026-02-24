export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import Enrollment from "@/models/Enrollment";

export default async function AdminEnrollmentsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/admin/login");
  await connectDb();
  const rows = await Enrollment.find().sort({ enrolledAt: -1 }).limit(200).lean();

  return (
    <main className="container">
      <h1>Admin Enrollments</h1>
      <section className="card">
        <ul>
          {rows.map((r: any) => <li key={r._id.toString()}>{r.itemTitle} ({r.type}) | {r.email} | INR {r.amountPaid} | {r.status}</li>)}
        </ul>
      </section>
    </main>
  );
}


