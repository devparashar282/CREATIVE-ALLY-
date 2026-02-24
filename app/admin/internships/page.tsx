export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminInternshipsManager from "@/components/admin/AdminInternshipsManager";

export default async function AdminInternshipsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/admin/login");

  return (
    <main className="container">
      <h1>Admin Internships</h1>
      <p className="small">Add, edit, and delete internships from one place.</p>
      <AdminInternshipsManager />
    </main>
  );
}

