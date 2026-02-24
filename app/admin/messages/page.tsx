export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/admin/login");
  await connectDb();
  const rows = await ContactMessage.find().sort({ createdAt: -1 }).limit(200).lean();

  return (
    <main className="container">
      <h1>Admin Messages</h1>
      <section className="card">
        <ul>
          {rows.map((r: any) => <li key={r._id.toString()}>{r.name} | {r.email} | {r.subject}</li>)}
        </ul>
      </section>
    </main>
  );
}


