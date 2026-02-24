"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type CertificateType = "Workshop" | "Internship" | "Course";

type CertificateRow = {
  _id: string;
  id: string;
  studentName: string;
  college: string;
  type: CertificateType;
  courseName: string;
  issueDate: string;
  issuer: string;
};

type CertificateForm = {
  id: string;
  studentName: string;
  college: string;
  type: CertificateType;
  courseName: string;
  issueDate: string;
  issuer: string;
};

const typeOptions: CertificateType[] = ["Internship", "Course", "Workshop"];

const emptyForm: CertificateForm = {
  id: "",
  studentName: "",
  college: "",
  type: "Internship",
  courseName: "",
  issueDate: "",
  issuer: "Creative Ally"
};

function normalizeForm(row: CertificateRow): CertificateForm {
  return {
    id: row.id,
    studentName: row.studentName,
    college: row.college,
    type: row.type,
    courseName: row.courseName,
    issueDate: row.issueDate,
    issuer: row.issuer
  };
}

function toPayload(form: CertificateForm) {
  return {
    id: form.id.trim(),
    studentName: form.studentName.trim(),
    college: form.college.trim(),
    type: form.type,
    courseName: form.courseName.trim(),
    issueDate: form.issueDate.trim(),
    issuer: form.issuer.trim() || "Creative Ally"
  };
}

export default function AdminCertificatesManager() {
  const [rows, setRows] = useState<CertificateRow[]>([]);
  const [createForm, setCreateForm] = useState<CertificateForm>(emptyForm);
  const [editForm, setEditForm] = useState<CertificateForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const sortedRows = useMemo(() => [...rows], [rows]);

  async function loadRows() {
    setLoading(true);
    const res = await fetch("/api/admin/certificates", { cache: "no-store" });
    const payload = await res.json().catch(() => ({ data: [] }));
    setRows(Array.isArray(payload?.data) ? payload.data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadRows().catch(() => {
      setMessage("Unable to load certificates");
      setLoading(false);
    });
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setMessage("Saving...");

    const res = await fetch("/api/admin/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(createForm))
    });

    if (!res.ok) {
      setMessage("Unable to add certificate");
      return;
    }

    const payload = await res.json();
    if (payload?.data) setRows((prev) => [payload.data, ...prev]);
    setCreateForm(emptyForm);
    setMessage("Certificate added");
  }

  function startEdit(row: CertificateRow) {
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
    const res = await fetch(`/api/admin/certificates?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(editForm))
    });

    if (!res.ok) {
      setMessage("Unable to update certificate");
      return;
    }

    const payload = await res.json();
    if (payload?.data) {
      setRows((prev) => prev.map((row) => (row._id === id ? payload.data : row)));
    }
    setEditingId(null);
    setMessage("Certificate updated");
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Delete this certificate?");
    if (!ok) return;

    setMessage("Deleting...");
    const res = await fetch(`/api/admin/certificates?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      setMessage("Unable to delete certificate");
      return;
    }

    setRows((prev) => prev.filter((row) => row._id !== id));
    if (editingId === id) cancelEdit();
    setMessage("Certificate deleted");
  }

  return (
    <>
      <section className="card" style={{ marginTop: 12 }}>
        <h3>Add New Certificate</h3>
        <form className="grid" onSubmit={handleCreate}>
          <div className="field"><label>Certificate ID</label><input value={createForm.id} onChange={(e) => setCreateForm((p) => ({ ...p, id: e.target.value }))} required /></div>
          <div className="field"><label>Student Name</label><input value={createForm.studentName} onChange={(e) => setCreateForm((p) => ({ ...p, studentName: e.target.value }))} required /></div>
          <div className="field"><label>College</label><input value={createForm.college} onChange={(e) => setCreateForm((p) => ({ ...p, college: e.target.value }))} required /></div>
          <div className="field"><label>Type</label><select value={createForm.type} onChange={(e) => setCreateForm((p) => ({ ...p, type: e.target.value as CertificateType }))}>{typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
          <div className="field"><label>Program Name</label><input value={createForm.courseName} onChange={(e) => setCreateForm((p) => ({ ...p, courseName: e.target.value }))} required /></div>
          <div className="field"><label>Issue Date</label><input type="date" value={createForm.issueDate} onChange={(e) => setCreateForm((p) => ({ ...p, issueDate: e.target.value }))} required /></div>
          <div className="field"><label>Issuer</label><input value={createForm.issuer} onChange={(e) => setCreateForm((p) => ({ ...p, issuer: e.target.value }))} required /></div>
          <button type="submit" className="btn">Add Certificate</button>
        </form>
        <p className="small">{message}</p>
      </section>

      <section className="grid" style={{ marginTop: 12 }}>
        {loading ? (
          <article className="card"><p className="small">Loading certificates...</p></article>
        ) : (
          sortedRows.map((row) => {
            const isEditing = editingId === row._id;
            return (
              <article key={row._id} className="card">
                {isEditing ? (
                  <>
                    <div className="field"><label>Certificate ID</label><input value={editForm.id} onChange={(e) => setEditForm((p) => ({ ...p, id: e.target.value }))} required /></div>
                    <div className="field"><label>Student Name</label><input value={editForm.studentName} onChange={(e) => setEditForm((p) => ({ ...p, studentName: e.target.value }))} required /></div>
                    <div className="field"><label>College</label><input value={editForm.college} onChange={(e) => setEditForm((p) => ({ ...p, college: e.target.value }))} required /></div>
                    <div className="field"><label>Type</label><select value={editForm.type} onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value as CertificateType }))}>{typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div className="field"><label>Program Name</label><input value={editForm.courseName} onChange={(e) => setEditForm((p) => ({ ...p, courseName: e.target.value }))} required /></div>
                    <div className="field"><label>Issue Date</label><input type="date" value={editForm.issueDate} onChange={(e) => setEditForm((p) => ({ ...p, issueDate: e.target.value }))} required /></div>
                    <div className="field"><label>Issuer</label><input value={editForm.issuer} onChange={(e) => setEditForm((p) => ({ ...p, issuer: e.target.value }))} required /></div>
                    <div className="btn-row">
                      <button className="btn" type="button" onClick={() => handleUpdate(row._id)}>Save</button>
                      <button className="btn btn-outline" type="button" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>{row.studentName}</h3>
                    <p className="small">{row.id}</p>
                    <p className="small">{row.type} | {row.courseName}</p>
                    <p className="small">Issued: {row.issueDate}</p>
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
