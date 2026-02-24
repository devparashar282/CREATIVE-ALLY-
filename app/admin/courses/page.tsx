export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminCoursesManager from "@/components/admin/AdminCoursesManager";

export default async function AdminCoursesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/admin/login");

  return (
    <main className="container">
      <h1>Admin Courses</h1>
      <p className="small">Add, edit, and delete courses from one place.</p>
      <AdminCoursesManager />
    </main>
  );
}


