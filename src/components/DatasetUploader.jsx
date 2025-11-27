"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Loader2, CheckCircle2, XCircle } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function DatasetUploader() {
  const { user } = useCurrentUser();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("success"); // success | error

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !user?._id) {
      setType("error");
      setMessage("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user._id);
    formData.append("user_email", user.email);

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE}/train-from-file`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Upload failed");

      setType("success");
      setMessage(
        `Dataset trained: ${data.dataset_name} using ${data.best_model}`
      );

      // Refresh dataset preview + models
      window.dispatchEvent(new Event("dataset-updated"));
    } catch (err) {
      setType("error");
      setMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        w-full
        flex
        flex-col
        items-center
        gap-5
        text-center
      "
    >
      {/* Upload Box */}
      <label
        className="
          w-full
          max-w-md
          flex
          flex-col
          items-center
          justify-center
          gap-2
          border border-dashed border-border
          rounded-xl
          p-6
          cursor-pointer
          hover:border-accent
          transition
        "
      >
        <UploadCloud className="text-accent" size={28} />
        <p className="text-sm font-medium">
          {file ? file.name : "Click to upload CSV file"}
        </p>
        <p className="text-xs text-muted">Only .csv files are supported</p>

        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      {/* Train Button */}
      <button
        disabled={loading}
        className="
          px-6
          py-2.5
          bg-accent
          text-primary-foreground
          rounded-full
          font-semibold
          text-sm
          flex
          items-center
          gap-2
          hover:opacity-90
          transition
          disabled:opacity-60
          cursor-pointer
        "
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : null}
        {loading ? "Training..." : "Upload & Train"}
      </button>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            flex
            items-center
            gap-2
            text-sm
            px-4
            py-2
            rounded-lg
            ${
              type === "success"
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
            }
          `}
        >
          {type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <XCircle size={16} />
          )}
          {message}
        </motion.div>
      )}
    </motion.form>
  );
}
