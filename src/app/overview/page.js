"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import MetricsBarChart from "@/components/MetricsBarChart";
import ModelTable from "@/components/ModelTable";
import OverviewHeader from "@/components/OverviewHeader";
import BestModelCard from "@/components/BestModelCard";
import BestModelHeatmap from "@/components/BestModelHeatmap";
import useCurrentUser from "@/hooks/useCurrentUser";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function OverviewPage() {
  const { user } = useCurrentUser();

  const [models, setModels] = useState([]);
  const [best, setBest] = useState(null);
  const [datasetName, setDatasetName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let modelsUrl = `${API_BASE}/models`;
        let bestUrl = `${API_BASE}/best-model`;
        let dsUrl = `${API_BASE}/current-dataset`;

        if (user?._id) {
          const q = `?userId=${user._id}`;
          modelsUrl += q;
          bestUrl += q;
          dsUrl += q;
        }

        const [modelsRes, bestRes, dsRes] = await Promise.all([
          fetch(modelsUrl),
          fetch(bestUrl),
          fetch(dsUrl),
        ]);

        const modelsJson = await modelsRes.json();
        const bestJson = await bestRes.json();
        const dsJson = await dsRes.json();

        setModels(modelsJson || []);
        setBest(bestJson || null);

        setDatasetName(dsJson?.name || dsJson?.dataset || "Unknown dataset");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <p className="text-sm text-muted animate-pulse text-center">
          Loading models & dataset...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-12">
      {/* ================= HEADER + BEST MODEL ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview */}
        <div className="glass p-5 sm:p-6 rounded-xl lg:col-span-2">
          <OverviewHeader datasetName={datasetName} />
        </div>

        {/* Best model card */}
        <div className="glass p-5 sm:p-6 rounded-xl flex items-center justify-center">
          <BestModelCard best={best} />
        </div>
      </section>

      {/* ================= MODELS TABLE ================= */}
      <section className="glass p-4 sm:p-6 rounded-xl space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-accent">
          📋 All Trained Models
        </h2>

        <div className="relative w-full overflow-x-auto pb-2">
          <div className="min-w-[700px] sm:min-w-full">
            <ModelTable models={models} />
          </div>
        </div>
      </section>

      {/* ================= BEST MODEL HEATMAP ================= */}
      {best?.metrics?.confusion_matrix && (
        <section className="glass p-4 sm:p-6 rounded-xl space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-accent">
            🧮 Best Model — Confusion Matrix
          </h2>

          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <BestModelHeatmap />
            </div>
          </div>
        </section>
      )}

      {/* ================= BAR CHART ================= */}
      <section className="glass p-4 sm:p-6 rounded-xl space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-accent">
          📊 Models Comparison Chart
        </h2>

        <div className="w-full overflow-x-auto pb-2">
          <div className="min-w-[750px] sm:min-w-full">
            <MetricsBarChart models={models} />
          </div>
        </div>
      </section>

      {/* ================= FOOTER CTA ================= */}
      <section className="text-center pt-4">
        <p className="text-xs sm:text-sm text-muted mb-3">
          Want to see more details of each model?
        </p>

        <Link
          href="/models"
          className="
            inline-block
            px-6 py-2.5
            rounded-full
            bg-accent
            text-background
            font-semibold
            text-sm
            hover:opacity-90
            transition
          "
        >
          Explore Models →
        </Link>
      </section>
    </div>
  );
}
