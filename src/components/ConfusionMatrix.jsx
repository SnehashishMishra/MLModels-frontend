"use client";

import { motion } from "framer-motion";

/* ✅ Read theme variable */
const css = (v, fallback = "") => {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(v).trim() ||
    fallback
  );
};

export default function ConfusionMatrix({ matrix }) {
  if (!matrix) return null;

  const [[tn, fp], [fn, tp]] = matrix;

  const Card = ({ label, value, bg }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.25 }}
      className="
        rounded-xl
        p-3 sm:p-4
        text-center
        flex flex-col justify-center items-center
        min-h-20 sm:min-h-[110px]
        shadow-inner
        border border-border
        backdrop-blur-md
      "
      style={{
        background: bg,
      }}
    >
      <p className="text-[10px] sm:text-xs font-medium text-foreground mb-1">
        {label}
      </p>

      <motion.p
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl sm:text-3xl font-bold text-heatmap-numbers"
      >
        {value}
      </motion.p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        glass
        p-4 sm:p-6
        rounded-xl
        w-full
        max-w-md
        mx-auto
      "
    >
      <h3 className="text-sm sm:text-lg font-semibold text-accent text-center mb-1">
        Confusion Matrix
      </h3>

      <p className="text-[11px] sm:text-xs text-muted text-center mb-4">
        Actual vs Predicted
      </p>

      {/* AXIS LABELS */}
      <div className="text-[11px] text-muted mb-2 text-center">
        <span className="font-semibold">Predicted →</span>
      </div>

      {/* MATRIX GRID */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        {/* Y AXIS LABEL */}
        <div className="flex items-center justify-center text-[10px] sm:text-xs text-muted font-semibold">
          Actual ↓
        </div>

        {/* Predicted labels */}
        <div className="text-xs sm:text-sm font-bold">0</div>
        <div className="text-xs sm:text-sm font-bold">1</div>

        {/* Actual 0 Row */}
        <div className="text-[11px] sm:text-xs text-primary font-bold flex flex-col items-center justify-center">
          0
        </div>

        <Card
          label="True Negative"
          value={tn}
          bg={css("--heatmap-chart-1", "rgba(59,130,246,0.15)")}
        />

        <Card
          label="False Positive"
          value={fp}
          bg={css("--heatmap-chart-2", "rgba(239,68,68,0.15)")}
        />

        {/* Actual 1 Row */}
        <div className="text-[11px] sm:text-xs text-primary font-bold flex flex-col items-center justify-center">
          1
        </div>

        <Card
          label="False Negative"
          value={fn}
          bg={css("--heatmap-chart-3", "rgba(234,179,8,0.15)")}
        />

        <Card
          label="True Positive"
          value={tp}
          bg={css("--heatmap-chart-4", "rgba(34,197,94,0.15)")}
        />
      </div>
    </motion.div>
  );
}
