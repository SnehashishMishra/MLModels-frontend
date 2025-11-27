"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import useCurrentUser from "@/hooks/useCurrentUser";

import ModelRadarChart from "../../../components/ModelRadarChart";
import ModelPredictForm from "@/components/ModelPredictForm";
import ConfusionMatrix from "@/components/ConfusionMatrix";
import ConfusionMatrixHeatmap from "@/components/ConfusionMatrixHeatmap";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const formatNum = (v) => {
  if (v === null || v === undefined || isNaN(v)) return "N/A";
  return Number(v).toFixed(3);
};

const canMakePrediction = (model, features) => {
  if (!model || !features || features.length === 0) return false;

  return (
    typeof model.accuracy === "number" &&
    typeof model.f1 === "number" &&
    typeof model.recall === "number"
  );
};

export default function ModelDetailPage() {
  const { name: rawName } = useParams();
  const modelName = decodeURIComponent(rawName);

  const { user, loadingUser } = useCurrentUser();

  const [model, setModel] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadingUser) return;

    const fetchData = async () => {
      try {
        let modelsURL = `${API_BASE}/models`;
        let featuresURL = `${API_BASE}/features`;

        if (user?._id) {
          modelsURL += `?userId=${user._id}`;
        }

        const [modelsRes, featRes] = await Promise.all([
          fetch(modelsURL),
          fetch(featuresURL),
        ]);

        const modelsData = await modelsRes.json();
        const featData = await featRes.json();

        const found = modelsData.find((m) => m.name === modelName);

        setModel(found || null);
        setFeatures(featData?.feature_names || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [modelName, user, loadingUser]);

  if (loading || loadingUser) {
    return <p className="text-muted p-6">Loading model...</p>;
  }

  if (!model) {
    return (
      <p className="text-muted p-6">❌ Model not found for this dataset</p>
    );
  }

  const confusion = model.confusion_matrix || null;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-12 px-3 sm:px-6">
      {/* ================= HEADER + METRICS ================= */}
      <section className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent">
            {model.name}
          </h1>

          <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl">
            Detailed metrics, radar visualization and real-time prediction.
          </p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Metric label="Accuracy" value={model.accuracy} />
          <Metric label="Precision" value={model.precision} />
          <Metric label="Recall" value={model.recall} />
          <Metric label="F1" value={model.f1} />
          <Metric label="ROC AUC" value={model.roc_auc} />
          <Metric label="CV Acc." value={model.cv_mean_accuracy} />
        </div>
      </section>

      {/* ================= RADAR CHART ================= */}
      <section className="w-full flex justify-center">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
          <ModelRadarChart model={model} />
        </div>
      </section>

      {/* ================= CONFUSION MATRIX ================= */}
      {confusion && (
        <section className="glass p-4 sm:p-6 rounded-xl flex flex-col gap-6">
          <h2 className="text-base sm:text-lg font-semibold text-accent text-center">
            Confusion Matrix Analysis
          </h2>

          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            <div className="w-full max-w-sm">
              <ConfusionMatrix matrix={confusion.matrix} />
            </div>

            <div className="w-full max-w-sm">
              <ConfusionMatrixHeatmap matrix={confusion.matrix} />
            </div>
          </div>
        </section>
      )}

      {/* ================= PREDICTION FORM ================= */}
      <section className="w-full">
        {canMakePrediction(model, features) ? (
          <div className="glass p-4 sm:p-6 rounded-xl">
            <ModelPredictForm
              model={model}
              features={features}
              userId={user?._id || null}
            />
          </div>
        ) : (
          <div className="glass p-6 sm:p-10 rounded-xl text-center">
            <h2 className="text-base sm:text-lg font-semibold text-accent mb-2">
              Prediction unavailable
            </h2>

            <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
              This model does not support manual feature-based prediction.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

/* ✅ RESPONSIVE METRIC CARD */
function Metric({ label, value }) {
  return (
    <div className="glass rounded-lg p-3 sm:p-4 flex flex-col gap-1 text-center">
      <span className="text-[10px] sm:text-xs text-muted">{label}</span>
      <span className="font-bold text-sm sm:text-lg text-foreground wrap-break-word">
        {formatNum(value)}
      </span>
    </div>
  );
}
