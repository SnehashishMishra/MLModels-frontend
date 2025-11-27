"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const formatNum = (v) => {
  if (v === null || v === undefined || isNaN(v)) return "N/A";
  return Number(v).toFixed(3);
};

export default function ModelPredictForm({ model, features, userId }) {
  const [featureValues, setFeatureValues] = useState(
    Object.fromEntries(features.map((f) => [f, ""]))
  );

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFeatureValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    setLoading(true);
    setPrediction(null);

    try {
      const featureArray = features.map((f) =>
        featureValues[f] === "" ? 0 : Number(featureValues[f])
      );

      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_name: model.name,
          features: featureArray,
          user_id: userId || null, // ✅ NEW: user-based prediction
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Prediction failed");
      }

      setPrediction(data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass p-4 sm:p-6 rounded-xl w-full">
      <h2 className="text-lg font-semibold mb-3 text-accent">
        Predict using {model.name}
      </h2>

      <p className="text-xs text-muted mb-4">
        Enter numeric values for each feature below
      </p>

      <form onSubmit={handlePredict} className="flex flex-col gap-4">
        <div
          className="
            grid gap-3
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            max-h-[45vh]
            overflow-y-auto
            pr-1
          "
        >
          {features.map((f) => (
            <div key={f} className="flex flex-col">
              <label className="text-xs font-medium mb-1 text-accent/80">
                {f}
              </label>

              <input
                type="number"
                step="any"
                value={featureValues[f]}
                onChange={(e) => handleChange(f, e.target.value)}
                className="
                  bg-background border border-border
                  rounded-md px-2 py-2
                  text-xs text-foreground
                  focus:outline-none focus:border-ring
                "
              />
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="
            self-start
            rounded-md
            bg-accent hover:bg-primary
            disabled:opacity-60
            text-primary-foreground
            font-semibold
            px-6 py-2 text-sm
            transition
          "
        >
          {loading ? "Predicting..." : "Predict"}
        </motion.button>
      </form>

      {/* RESULT */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            mt-6 p-4 rounded-lg
            bg-background
            border border-border
            text-sm space-y-1
          "
        >
          <p className="text-accent">
            <span className="font-semibold">Predicted class:</span>{" "}
            {prediction.predicted_class}{" "}
            {prediction.predicted_class === 1 ? "(benign)" : "(malignant)"}
          </p>

          <p className="text-accent">
            <span className="font-semibold">Probability (class 1):</span>{" "}
            {formatNum(prediction.predicted_proba)}
          </p>
        </motion.div>
      )}
    </section>
  );
}
