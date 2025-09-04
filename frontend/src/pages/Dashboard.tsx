import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import { API_BASE, api } from "../lib/api";

type Form = {
  _id: string;
  title: string;
  status: "draft" | "published";
  createdAt: string;
  submissionCount?: number;
};

export default function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      setForms(await api("/api/forms"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!newTitle.trim()) return;
    const form = await api("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle.trim(),
        description: "",
        status: "draft",
        fields: [],
      }),
    });
    setShowModal(false);
    setNewTitle("");
    nav(`/builder/${form._id}`);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await api(`/api/forms/${deleteId}`, { method: "DELETE" });
    setForms(forms.filter((f) => f._id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Forms</h1>
        <Button onClick={() => setShowModal(true)}>New Form</Button>
      </div>

      {/* Forms list */}
      <div className="grid gap-4">
        {loading && <div className="card">Loading…Wait for 5 sec</div>}
        {!loading && forms.length === 0 && (
          <div className="card">No forms yet</div>
        )}
        {forms.map((f) => (
          <div key={f._id} className="card flex items-center justify-between">
            <div>
              <div className="text-lg font-medium">{f.title}</div>
              <div className="text-sm text-gray-500">
                {new Date(f.createdAt).toLocaleString()} •
                <span className="badge">{f.status}</span> • Submissions:{" "}
                {f.submissionCount || 0}
              </div>
            </div>
            <div className="flex gap-2">
              <Link className="btn" to={`/builder/${f._id}`}>
                Edit
              </Link>
              {/* <Link className="btn" to={`/preview/${f._id}`}>
                Preview
              </Link> */}
              <a
                className="btn"
                href={`${API_BASE}/api/forms/${f._id}/analytics/export`}
                target="_blank"
              >
                Export CSV
              </a>
              <Link className="btn btn-primary" to={`/f/${f._id}`}>
                Public Link
              </Link>
              <button
                className="btn bg-red-600 text-white"
                onClick={() => setDeleteId(f._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Form</h2>
            <input
              type="text"
              className="input w-full mb-4"
              placeholder="Enter form title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                className="btn"
                onClick={() => {
                  setShowModal(false);
                  setNewTitle("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={create}
                disabled={!newTitle.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Delete Form?</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this form? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button className="btn" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button
                className="btn bg-red-600 text-white"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
