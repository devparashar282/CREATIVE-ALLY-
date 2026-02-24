export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminCertificatesManager from "@/components/admin/AdminCertificatesManager";

export default async function AdminCertificatesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/admin/login");

  return (
    <main className="container">
      <h1>Admin Certificates</h1>
      <p className="small">Add, edit, and delete certificate records.</p>
      <AdminCertificatesManager />
    </main>
  );
}


