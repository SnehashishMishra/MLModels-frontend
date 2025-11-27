"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  UploadCloud,
  Database,
  User,
  BarChart3,
  Layers,
  Users,
  Folder,
} from "lucide-react";

import useCurrentUser from "@/hooks/useCurrentUser";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY;

export default function AdminPage() {
  const { user, loadingUser } = useCurrentUser();

  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loadingUser && user?.role === "admin") {
      loadDatasets();
    }
  }, [user, loadingUser]);

  const loadDatasets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/datasets`, {
        headers: { "X-Admin-Key": ADMIN_KEY },
      });

      const data = await res.json();
      setDatasets(data.datasets || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDataset = async (ownerId) => {
    if (!confirm("Delete this user's dataset permanently?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/datasets/${ownerId}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": ADMIN_KEY },
      });

      const result = await res.json();
      setMessage(result.message || "Deleted");

      loadDatasets();
      window.dispatchEvent(new Event("dataset-updated"));
    } catch (error) {
      console.error(error);
      setMessage("Delete failed");
    }
  };

  const uploadDefaultDataset = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Select a dataset first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setMessage("Uploading and training...");

      const res = await fetch(`${API_BASE}/admin/default-dataset`, {
        method: "POST",
        headers: { "X-Admin-Key": ADMIN_KEY },
        body: formData,
      });

      const data = await res.json();

      setMessage(
        `✅ New default dataset: ${data.dataset_name} (Best: ${data.best_model})`
      );

      loadDatasets();
      window.dispatchEvent(new Event("dataset-updated"));
    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
    }
  };

  if (loadingUser || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-muted"
        >
          Loading Admin Dashboard...
        </motion.p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-400 text-lg font-semibold">
        ❌ Admin access only
      </div>
    );
  }

  /* ----------------- CALCULATIONS ----------------- */
  const totalDatasets = datasets.length;
  const defaultDatasets = datasets.filter((d) => d.type === "default");
  const userDatasets = datasets.filter((d) => d.type === "user");

  const uniqueUsers = [
    ...new Set(datasets.map((d) => d.user_email).filter(Boolean)),
  ];

  const userUsage = {};
  datasets.forEach((d) => {
    if (d.user_email) {
      userUsage[d.user_email] = (userUsage[d.user_email] || 0) + 1;
    }
  });

  const topUsers = Object.entries(userUsage).sort((a, b) => b[1] - a[1]);

  const sortedBySize = [...datasets]
    .sort((a, b) => (b.rows || 0) - (a.rows || 0))
    .slice(0, 5);

  const recent = [...datasets].slice(-5).reverse();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-3 sm:px-6 space-y-10"
    >
      <h1 className="text-3xl font-bold text-accent flex gap-2 items-center">
        <Database /> Admin Dashboard
      </h1>

      {/* ------------ STAT CARDS ------------ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Folder />}
          label="Total Datasets"
          value={totalDatasets}
        />
        <StatCard
          icon={<Layers />}
          label="Default Datasets"
          value={defaultDatasets.length}
        />
        <StatCard
          icon={<User />}
          label="User Datasets"
          value={userDatasets.length}
        />
        <StatCard
          icon={<Users />}
          label="Total Users"
          value={uniqueUsers.length}
        />
      </div>

      {/* ------------ BAR CHART (FAKE VISUAL VERSION) ------------ */}
      <section className="glass p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-accent mb-4 flex items-center gap-2">
          <BarChart3 size={18} /> Largest Datasets (by rows)
        </h2>

        <div className="space-y-2">
          {sortedBySize.map((d, i) => (
            <div key={i} className="text-xs">
              <p className="mb-1 truncate">{d.dataset_name}</p>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(d.rows / 10, 100)}%` }}
                  className="h-full bg-accent"
                />
              </div>
              <span className="text-[10px] text-muted">{d.rows} rows</span>
            </div>
          ))}
        </div>
      </section>

      {/* ------------ RECENT UPLOADS ------------ */}
      <section>
        <h2 className="text-lg font-semibold text-accent mb-3">
          🕒 Latest uploads
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {recent.map((d, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="glass p-4 rounded-xl"
            >
              <p className="font-semibold text-accent text-sm line-clamp-1">
                {d.dataset_name}
              </p>

              <p className="text-xs text-muted mt-1">
                {d.user_email || "SYSTEM DEFAULT"}
              </p>

              <p className="text-[10px] mt-2">
                {d.rows} rows • {d.columns?.length || 0} columns
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------ USER USAGE ------------ */}
      <section>
        <h2 className="text-lg font-semibold text-accent mb-3">
          📊 Dataset usage per user
        </h2>

        <div className="space-y-2">
          {topUsers.map(([email, count], i) => (
            <div
              key={i}
              className="glass p-3 rounded-md flex justify-between items-center text-sm"
            >
              <span className="truncate">{email}</span>
              <span className="font-bold text-accent">{count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ------------ DEFAULT DATASET UPLOAD ------------ */}
      <section className="glass p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold text-accent flex gap-2 items-center">
          <UploadCloud size={18} /> Replace Default Dataset
        </h2>

        <form
          onSubmit={uploadDefaultDataset}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 text-sm"
          />

          <button className="bg-accent px-5 py-2 rounded-md text-white font-medium hover:opacity-90">
            Upload & Train
          </button>
        </form>
      </section>

      {/* ------ ADMIN DATASETS LIST ------- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-accent">📁 All datasets</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {datasets.map((ds, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="glass p-5 rounded-xl border border-border space-y-2"
            >
              <p className="font-semibold text-accent line-clamp-2">
                {ds.dataset_name || "Unnamed Dataset"}
              </p>

              <p className="text-xs text-muted">
                User: {ds.user_email || "SYSTEM DEFAULT"}
              </p>

              <p className="text-xs text-muted">
                {ds.rows} rows • {ds.columns?.length || 0} columns
              </p>

              {ds.type === "user" && (
                <button
                  onClick={() => deleteDataset(ds.owner_id)}
                  className="mt-3 flex gap-1 items-center text-xs text-red-400 hover:text-red-500"
                >
                  <Trash2 size={14} /> Delete
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-accent text-sm"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}

/* -------- STAT CARD -------- */
function StatCard({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="glass p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-center"
    >
      <div className="text-accent">{icon}</div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </motion.div>
  );
}
