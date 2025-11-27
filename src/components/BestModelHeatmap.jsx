"use client";

import { useEffect, useState } from "react";
import ConfusionMatrixHeatmap from "./ConfusionMatrixHeatmap";
import ConfusionMatrix from "./ConfusionMatrix";
import useCurrentUser from "@/hooks/useCurrentUser";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function BestModelHeatmap() {
  const { user } = useCurrentUser();
  const [data, setData] = useState(null);

  const fetchBest = async () => {
    try {
      let url = `${API_BASE}/best-model`;

      if (user?._id) {
        url += `?userId=${user._id}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      setData(json);
    } catch (err) {
      console.error("Error loading best model confusion matrix:", err);
    }
  };

  useEffect(() => {
    fetchBest();
  }, [user?._id]);

  // Auto refresh after upload or admin delete
  useEffect(() => {
    const refresh = () => fetchBest();
    window.addEventListener("dataset-updated", refresh);
    return () => window.removeEventListener("dataset-updated", refresh);
  }, [user?._id]);

  if (!data?.metrics?.confusion_matrix) return null;

  const matrix = data.metrics.confusion_matrix.matrix;

  return (
    <div className="glass p-4 sm:p-6 rounded-xl mt-6 space-y-4">
      {/* HEADER */}
      <div className="text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-semibold text-accent mb-1">
          Best Model — Confusion Matrix
        </h2>

        <p className="text-xs text-muted">
          Best Model:{" "}
          <span className="text-accent font-medium">
            {data.best_model_name}
          </span>
        </p>
      </div>

      {/* ✅ GRID: STACK ON MOBILE, SIDE BY SIDE ON LARGE */}
      <div
        className="
          grid grid-cols-1
          lg:grid-cols-2
          gap-6
          place-items-center
        "
      >
        {/* MATRIX NUMBERS */}
        <div className="w-full max-w-sm">
          <ConfusionMatrix matrix={matrix} />
        </div>

        {/* HEATMAP */}
        <div className="w-full max-w-md">
          <ConfusionMatrixHeatmap matrix={matrix} />
        </div>
      </div>
    </div>
  );
}
