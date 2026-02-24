export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import Payment from "@/models/Payment";
import ContactMessage from "@/models/ContactMessage";

export default async function AdminHomePage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/admin/login");

  await connectDb();
  const [students, enrollments, paidPayments, messages] = await Promise.all([
    User.countDocuments({ role: "student" }),
    Enrollment.countDocuments(),
    Payment.find({ status: "paid" }),
    ContactMessage.countDocuments()
  ]);

  const revenue = paidPayments.reduce((sum, p: any) => sum + p.amount, 0);

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <section className="grid">
        <article className="card"><h3>Students</h3><p>{students}</p></article>
        <article className="card"><h3>Enrollments</h3><p>{enrollments}</p></article>
        <article className="card"><h3>Revenue</h3><p>INR {revenue}</p></article>
        <article className="card"><h3>Messages</h3><p>{messages}</p></article>
      </section>
      <section className="card" style={{ marginTop: 14 }}>
        <h3>Manage</h3>
        <p><Link href="/admin/courses">Courses</Link> | <Link href="/admin/internships">Internships</Link> | <Link href="/admin/enrollments">Enrollments</Link> | <Link href="/admin/payments">Payments</Link> | <Link href="/admin/messages">Messages</Link> | <Link href="/admin/campus-ambassadors">Campus Ambassadors</Link> | <Link href="/admin/certificates">Certificates</Link></p>
      </section>
    </main>
  );
}


