"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type InternshipRow = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  whatYouLearn: string[];
  price: number;
  active: boolean;
};

type InternshipForm = {
  slug: string;
  title: string;
  description: string;
  whatYouLearn: string;
  price: string;
  active: boolean;
};

const emptyForm: InternshipForm = {
  slug: "",
  title: "",
  description: "",
  whatYouLearn: "",
  price: "",
  active: true
};

function asLearnText(items: string[] = []) {
  return items.join(", ");
}

function normalizeForm(row: InternshipRow): InternshipForm {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    whatYouLearn: asLearnText(row.whatYouLearn),
    price: String(row.price),
    active: row.active
  };
}

function toPayload(form: InternshipForm) {
  return {
    slug: form.slug.trim(),
    title: form.title.trim(),
    description: form.description.trim(),
    whatYouLearn: form.whatYouLearn,
    price: Number(form.price),
    active: form.active
  };
}

export default function AdminInternshipsManager() {
  const [rows, setRows] = useState<InternshipRow[]>([]);
  const [createForm, setCreateForm] = useState<InternshipForm>(emptyForm);
  const [editForm, setEditForm] = useState<InternshipForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const sortedRows = useMemo(() => [...rows], [rows]);

  async function loadRows() {
    setLoading(true);
    const res = await fetch("/api/admin/internships", { cache: "no-store" });
    const payload = await res.json().catch(() => ({ data: [] }));
    setRows(Array.isArray(payload?.data) ? payload.data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadRows().catch(() => {
      setMessage("Unable to load internships");
      setLoading(false);
    });
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setMessage("Saving...");

    const res = await fetch("/api/admin/internships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(createForm))
    });

    if (!res.ok) {
      setMessage("Unable to add internship");
      return;
    }

    const payload = await res.json();
    if (payload?.data) setRows((prev) => [payload.data, ...prev]);
    setCreateForm(emptyForm);
    setMessage("Internship added");
  }

  function startEdit(row: InternshipRow) {
    setEditingId(row._id);
    setEditForm(normalizeForm(row));
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  async function handleUpdate(id: string) {
    setMessage("Updating...");
    const res = await fetch(`/api/admin/internships?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(editForm))
    });

    if (!res.ok) {
      setMessage("Unable to update internship");
      return;
    }

    const payload = await res.json();
    if (payload?.data) {
      setRows((prev) => prev.map((row) => (row._id === id ? payload.data : row)));
    }
    setEditingId(null);
    setMessage("Internship updated");
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Delete this internship?");
    if (!ok) return;

    setMessage("Deleting...");
    const res = await fetch(`/api/admin/internships?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      setMessage("Unable to delete internship");
      return;
    }

    setRows((prev) => prev.filter((row) => row._id !== id));
    if (editingId === id) cancelEdit();
    setMessage("Internship deleted");
  }

  return (
    <>
      <section className="card" style={{ marginTop: 12 }}>
        <h3>Add New Internship</h3>
        <form className="grid" onSubmit={handleCreate}>
          <div className="field"><label>Slug</label><input value={createForm.slug} onChange={(e) => setCreateForm((p) => ({ ...p, slug: e.target.value }))} required /></div>
          <div className="field"><label>Title</label><input value={createForm.title} onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))} required /></div>
          <div className="field"><label>Description</label><input value={createForm.description} onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))} required /></div>
          <div className="field"><label>What You Learn (comma separated)</label><input value={createForm.whatYouLearn} onChange={(e) => setCreateForm((p) => ({ ...p, whatYouLearn: e.target.value }))} required /></div>
          <div className="field"><label>Price</label><input type="number" min={0} value={createForm.price} onChange={(e) => setCreateForm((p) => ({ ...p, price: e.target.value }))} required /></div>
          <div className="field">
            <label>
              <input type="checkbox" checked={createForm.active} onChange={(e) => setCreateForm((p) => ({ ...p, active: e.target.checked }))} /> Active
            </label>
          </div>
          <button type="submit" className="btn">Add Internship</button>
        </form>
        <p className="small">{message}</p>
      </section>

      <section className="grid" style={{ marginTop: 12 }}>
        {loading ? (
          <article className="card"><p className="small">Loading internships...</p></article>
        ) : (
          sortedRows.map((row) => {
            const isEditing = editingId === row._id;
            return (
              <article key={row._id} className="card">
                {isEditing ? (
                  <>
                    <div className="field"><label>Slug</label><input value={editForm.slug} onChange={(e) => setEditForm((p) => ({ ...p, slug: e.target.value }))} required /></div>
                    <div className="field"><label>Title</label><input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} required /></div>
                    <div className="field"><label>Description</label><input value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} required /></div>
                    <div className="field"><label>What You Learn (comma separated)</label><input value={editForm.whatYouLearn} onChange={(e) => setEditForm((p) => ({ ...p, whatYouLearn: e.target.value }))} required /></div>
                    <div className="field"><label>Price</label><input type="number" min={0} value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))} required /></div>
                    <div className="field"><label><input type="checkbox" checked={editForm.active} onChange={(e) => setEditForm((p) => ({ ...p, active: e.target.checked }))} /> Active</label></div>
                    <div className="btn-row">
                      <button className="btn" type="button" onClick={() => handleUpdate(row._id)}>Save</button>
                      <button className="btn btn-outline" type="button" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>{row.title}</h3>
                    <p className="small">{row.slug}</p>
                    <p className="small">INR {row.price}</p>
                    <p className="small">{row.active ? "Active" : "Inactive"}</p>
                    <div className="btn-row">
                      <button className="btn" type="button" onClick={() => startEdit(row)}>Edit</button>
                      <button className="btn btn-outline" type="button" onClick={() => handleDelete(row._id)}>Delete</button>
                    </div>
                  </>
                )}
              </article>
            );
          })
        )}
      </section>
    </>
  );
}
