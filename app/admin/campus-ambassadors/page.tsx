export const dynamic = "force-dynamic";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import CampusAmbassadorApplication from "@/models/CampusAmbassadorApplication";

const statusOptions = ["new", "reviewed", "approved", "rejected"] as const;
type StatusOption = (typeof statusOptions)[number];

async function updateApplicationStatus(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as StatusOption;
  if (!id || !statusOptions.includes(status)) return;

  await connectDb();
  await CampusAmbassadorApplication.findByIdAndUpdate(id, { status });
  revalidatePath("/admin/campus-ambassadors");
}

async function deleteApplication(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") || "");
  if (!id) return;

  await connectDb();
  await CampusAmbassadorApplication.findByIdAndDelete(id);
  revalidatePath("/admin/campus-ambassadors");
}

export default async function AdminCampusAmbassadorsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/admin/login");

  await connectDb();
  const rows = await CampusAmbassadorApplication.find().sort({ createdAt: -1 }).limit(200).lean();

  return (
    <main className="container">
      <h1>Campus Ambassador Applications</h1>
      <section className="grid">
        {rows.length === 0 ? (
          <article className="card">
            <p className="small">No applications yet.</p>
          </article>
        ) : (
          rows.map((row: any) => (
            <article className="card" key={row._id.toString()}>
              <h3>{row.name}</h3>
              <p className="small">{row.college}</p>
              <p className="small">{row.email}</p>
              <p className="small">{row.countryCode} {row.phone}</p>
              <p className="small">Submitted: {new Date(row.createdAt).toLocaleString("en-IN")}</p>
              <p className="small">Current status: {row.status}</p>

              <form action={updateApplicationStatus} style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <input type="hidden" name="id" value={row._id.toString()} />
                <select name="status" defaultValue={row.status}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn">Update</button>
              </form>

              <form action={deleteApplication} style={{ marginTop: 8 }}>
                <input type="hidden" name="id" value={row._id.toString()} />
                <button type="submit" className="btn btn-outline">Delete</button>
              </form>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
