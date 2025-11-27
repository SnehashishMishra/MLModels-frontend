"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import useCurrentUser from "@/hooks/useCurrentUser";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function ModelsPage() {
  const { user, loadingUser } = useCurrentUser();

  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadingUser) return;

    const fetchModels = async () => {
      try {
        let url = `${API_BASE}/models`;
        if (user?._id) {
          url += `?userId=${user._id}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        setModels(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [user, loadingUser]);

  if (loading || loadingUser) {
    return <p className="text-muted p-6">Loading models...</p>;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* HEADER */}
      <div className="px-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-accent">Models</h1>

        <p className="text-sm text-muted mt-1 max-w-xl leading-relaxed">
          Tap a model to view its metrics, charts and prediction form.
        </p>
      </div>

      {/* GRID */}
      <div
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {models.map((m, index) => (
          <Link
            key={m.name + index}
            href={`/models/${encodeURIComponent(m.name)}`}
            className="group"
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="
                h-full
                glass p-4 sm:p-5
                border border-border
                rounded-xl
                transition-all
                hover:border-accent/70
                flex flex-col justify-between
              "
            >
              {/* TITLE */}
              <p
                className="
                  font-semibold mb-2 text-accent
                  wrap-break-word
                  text-sm sm:text-base
                "
              >
                {m.name}
              </p>

              {/* METRICS */}
              <div className="space-y-1 text-xs sm:text-sm text-muted">
                <p>
                  <span className="font-medium text-foreground">Accuracy:</span>{" "}
                  {m.accuracy?.toFixed(3)}
                </p>

                <p>
                  <span className="font-medium text-foreground">F1:</span>{" "}
                  {m.f1?.toFixed(3)}
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    CV Accuracy:
                  </span>{" "}
                  {m.cv_mean_accuracy ? m.cv_mean_accuracy.toFixed(3) : "-"}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
