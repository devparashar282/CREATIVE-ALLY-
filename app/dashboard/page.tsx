export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Payment from "@/models/Payment";
import User from "@/models/User";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDb();
  const userId = (session.user as any).id;
  const user: any = await User.findById(userId).lean();
  const enrollments = await Enrollment.find({ userId }).sort({ enrolledAt: -1 }).lean();
  const payments = await Payment.find({ userId }).sort({ createdAt: -1 }).limit(10).lean();

  return (
    <main className="container">
      <section className="card">
        <h1>Student Dashboard</h1>
        <img src={user?.imageUrl || "https://images.unsplash.com/photo-1527980965255-d3b416303d12"} alt="student" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }} />
        <p className="small">Name: {user?.name}</p>
        <p className="small">Email: {user?.email}</p>
        <p className="small">Phone: {user?.countryCode} {user?.phone}</p>
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <h3>Enrolled Courses / Internships</h3>
        {enrollments.length === 0 ? <p className="small">No enrollments yet.</p> : (
          <ul>
            {enrollments.map((en: any) => (
              <li key={en._id.toString()}>{en.itemTitle} ({en.type}) - Access: {en.accessUnlocked ? "Unlocked" : "Locked"}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <h3>Recent Payments</h3>
        {payments.length === 0 ? <p className="small">No payments.</p> : (
          <ul>
            {payments.map((pay: any) => (
              <li key={pay._id.toString()}>{pay.orderId} - INR {pay.amount} - {pay.status}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}



