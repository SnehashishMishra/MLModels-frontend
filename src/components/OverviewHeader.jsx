"use client";

import Link from "next/link";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function OverviewHeader({ datasetName }) {
  const { user } = useCurrentUser();

  const previewUrl = user?._id
    ? `/dataset-preview?userId=${user._id}`
    : `/dataset-preview`;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl sm:text-3xl font-bold text-accent">Overview</h1>

      <p className="text-sm text-muted max-w-xl">
        Compare classic and advanced ML models trained on the current dataset.
        View metrics, explore charts and download the best performing model.
      </p>

      <div className="pt-2 space-y-2">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">
            Current Dataset:
          </span>{" "}
          {datasetName}
        </p>

        {/* ✅ User-aware Dataset Preview */}
        <Link
          href={previewUrl}
          className="
            inline-block bg-accent text-primary-foreground
            px-3 py-1.5 rounded-md text-xs font-medium
            hover:opacity-90 transition
          "
        >
          View Dataset
        </Link>
      </div>
    </div>
  );
}
