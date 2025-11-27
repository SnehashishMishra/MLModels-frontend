"use client";

import { ArrowDownToLine } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function BestModelCard({ best }) {
  const { user } = useCurrentUser();

  if (!best) return null;

  const downloadBestModel = () => {
    let url = `${API_BASE}/download-best-model`;

    if (user?._id) {
      url += `?userId=${user._id}`;
    }

    window.location.href = url;
  };

  return (
    <div className="glass p-4 text-sm w-full sm:max-w-sm">
      <p className="text-xs text-accent mb-1">Best model</p>

      <p className="text-lg font-semibold text-accent">
        {best.best_model_name}
      </p>

      <ul className="mt-3 text-xs text-muted space-y-1">
        <li>
          <b>Accuracy:</b> {best.metrics.accuracy.toFixed(3)}
        </li>
        <li>
          <b>Precision:</b> {best.metrics.precision.toFixed(3)}
        </li>
        <li>
          <b>Recall:</b> {best.metrics.recall.toFixed(3)}
        </li>
        <li>
          <b>F1:</b> {best.metrics.f1.toFixed(3)}
        </li>
      </ul>

      <button
        onClick={downloadBestModel}
        className="
          mt-4 w-full flex items-center justify-center gap-2
          rounded-md bg-accent text-primary-foreground
          font-semibold py-2 text-xs
          transition hover:opacity-90
        "
      >
        <ArrowDownToLine size={16} />
        Download Best Model
      </button>
    </div>
  );
}
