"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

// Safe CSS reader
const css = (v, f = "") => {
  if (typeof window === "undefined") return f;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(v).trim() || f
  );
};

export default function ConfusionMatrixHeatmap({ matrix, labels }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  // Detect mobile screen
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Re-render when theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => setChartKey((k) => k + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Render Heatmap
  useEffect(() => {
    if (!matrix || !canvasRef.current) return;

    const n = matrix.length;

    // Labels must match class count
    const classLabels =
      labels?.length === n
        ? labels
        : Array.from({ length: n }, (_, i) => `${i}`);

    const ctx = canvasRef.current.getContext("2d");
    if (chartRef.current) chartRef.current.destroy();

    const textColor = css("--foreground", "#e5e7eb");
    const darkText = css("--foreground", "#e5e7eb");
    const lightText = "#ffffff";
    const borderColor = css("--border", "#444");
    const bgColor = css("--card", "#111");

    const maxValue = Math.max(...matrix.flat());

    // Heatmap gradient generator
    const heatColor = (v) => {
      const t = Math.min(v / (maxValue || 1), 1);
      const r = Math.floor(255 * t);
      const g = Math.floor(150 + 50 * (1 - t));
      const b = Math.floor(100 * (1 - t));
      return `rgb(${r},${g},${b})`;
    };

    // Auto-adjust bar thickness depending on class count
    const baseBarThickness = Math.max(8, 30 - n * 2);
    const baseBarPercentage = Math.max(0.3, 0.8 - n * 0.04);

    // Text inside bars plugin
    const valueLabels = {
      id: "valueLabels",
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((bar, j) => {
            const val = dataset.data[j];
            const bg = dataset.backgroundColor[j];
            if (!val && val !== 0) return;

            const [r, g, b] = bg
              .replace("rgb(", "")
              .replace(")", "")
              .split(",")
              .map(Number);

            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            const textInside = luminance < 140 ? lightText : darkText;

            ctx.save();
            ctx.fillStyle = textInside;
            ctx.font = isMobile ? "10px Inter" : "12px Inter";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const pos = bar.tooltipPosition();

            // Push text slightly downward to sit INSIDE peak
            const adjustedY = isMobile ? pos.y : pos.y - 6;

            ctx.fillText(val, pos.x, adjustedY);
            ctx.restore();
          });
        });
      },
    };

    // Heatmap = stacked vertical bars → each actual class is a dataset row
    const datasets = matrix.map((row, i) => ({
      label: `Actual ${classLabels[i]}`,
      data: row,
      backgroundColor: row.map(heatColor),
      borderRadius: 4,
      barThickness: baseBarThickness,
      maxBarThickness: baseBarThickness + 2,
      categoryPercentage: baseBarPercentage,
      barPercentage: baseBarPercentage,
    }));

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: classLabels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        // Horizontal for mobile = more readable
        indexAxis: isMobile ? "y" : "x",

        layout: { padding: 5 },

        scales: {
          x: {
            stacked: true,
            ticks: { color: textColor, font: { size: isMobile ? 10 : 12 } },
            grid: { color: borderColor },
            title: {
              display: true,
              text: "Predicted",
              color: textColor,
              font: { weight: "bold" },
            },
          },
          y: {
            stacked: true,
            ticks: { color: textColor },
            grid: { color: borderColor },
            beginAtZero: true,
            title: {
              display: true,
              text: "Count",
              color: textColor,
              font: { weight: "bold" },
            },
          },
        },

        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor, padding: 10 },
          },
          tooltip: {
            backgroundColor: bgColor,
            titleColor: textColor,
            bodyColor: textColor,
          },
        },
      },
      plugins: [valueLabels],
    });

    return () => chartRef.current?.destroy();
  }, [matrix, labels, chartKey, isMobile]);

  return (
    <div className="glass p-4 sm:p-6 rounded-xl w-full max-w-lg mx-auto">
      <h3 className="text-center text-sm sm:text-base font-semibold text-accent mb-3">
        Confusion Matrix — Heatmap
      </h3>

      {/* Auto-height adjusts for large matrices */}
      <div
        className="w-full"
        style={{
          height:
            matrix.length <= 3
              ? "260px"
              : matrix.length <= 6
              ? "340px"
              : "480px",
        }}
      >
        <canvas ref={canvasRef} />
      </div>

      <p className="text-[11px] text-muted mt-2 text-center">
        Darker = more predictions in that cell
      </p>
    </div>
  );
}
