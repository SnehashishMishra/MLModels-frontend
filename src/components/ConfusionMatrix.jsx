"use client";

import { motion } from "framer-motion";

/* Helper to read CSS variables */
const css = (v, fallback = "") => {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(v).trim() ||
    fallback
  );
};

export default function ConfusionMatrix({ matrix, labels }) {
  if (!matrix) return null;

  const n = matrix.length;
  const labelArray =
    labels && labels.length === n
      ? labels
      : Array.from({ length: n }, (_, i) => String(i));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass p-4 sm:p-6 rounded-xl w-full max-w-lg mx-auto"
    >
      <h3 className="text-sm sm:text-lg font-semibold text-accent text-center mb-1">
        Confusion Matrix
      </h3>

      <p className="text-[11px] sm:text-xs text-muted text-center mb-4">
        Actual vs Predicted
      </p>

      {/* AXIS LABEL */}
      <div className="text-[11px] text-muted mb-2 text-center">
        <span className="font-semibold">Predicted →</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[10px] text-muted pr-2">Actual ↓</th>
              {labelArray.map((lbl, i) => (
                <th
                  key={i}
                  className="text-[11px] sm:text-xs font-semibold text-center px-2 text-foreground"
                >
                  {lbl}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {/* Actual label */}
                <td className="text-[11px] sm:text-xs font-bold text-primary pr-2 text-center">
                  {labelArray[i]}
                </td>

                {/* Predicted cells */}
                {row.map((value, j) => {
                  const intensity = Math.min(value / Math.max(...row, 1), 1);

                  // Smooth heatmap color mixing
                  const bg = `rgba(99,102,241,${0.1 + intensity * 0.25})`;

                  return (
                    <td key={j} className="p-1">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.2 }}
                        className="
                          rounded-lg
                          p-2 text-center
                          border border-border/40
                          backdrop-blur-md
                          shadow-inner
                        "
                        style={{ background: bg }}
                      >
                        <p className="text-xs sm:text-sm font-semibold text-foreground">
                          {value}
                        </p>
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
