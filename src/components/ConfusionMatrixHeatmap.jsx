"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

/* ✅ Read CSS variable safely (same logic as MetricsBarChart) */
const css = (v) =>
  getComputedStyle(document.documentElement).getPropertyValue(v).trim();

export default function ConfusionMatrixHeatmap({ matrix }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  /* -------- Detect mobile -------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* -------- Re-render on theme change -------- */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setChartKey((k) => k + 1);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!matrix || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const textColor = css("--foreground", "#e5e7eb");
    const borderColor = css("--border", "#333");
    const bgColor = css("--card", "#000");

    const max = Math.max(...matrix.flat());

    /* ✅ Heat color generator */
    const getHeatColor = (value) => {
      const intensity = Math.min(value / max, 1);

      const r = Math.floor(255 * intensity);
      const g = Math.floor(120 + 100 * (1 - intensity));
      const b = Math.floor(80 * (1 - intensity));

      return `rgb(${r},${g},${b})`;
    };

    // ✅ Plugin to draw value inside bars
    const valueLabelPlugin = {
      id: "valueLabelPlugin",
      afterDatasetsDraw(chart) {
        const { ctx } = chart;

        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);

          meta.data.forEach((bar, index) => {
            const value = dataset.data[index];

            ctx.save();
            ctx.font = isMobile ? "10px Inter" : "12px Inter";
            ctx.fillStyle = textColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const { x, y } = bar.tooltipPosition();
            ctx.fillText(value, x, y - 2);

            ctx.restore();
          });
        });
      },
    };

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Class 0", "Class 1"],
        datasets: [
          {
            label: "Actual 0",
            data: matrix[0],
            backgroundColor: matrix[0].map(getHeatColor),
            borderRadius: isMobile ? 6 : 12,
          },
          {
            label: "Actual 1",
            data: matrix[1],
            backgroundColor: matrix[1].map(getHeatColor),
            borderRadius: isMobile ? 6 : 12,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: isMobile ? "y" : "x",

        animation: {
          duration: 900,
          easing: "easeOutQuart",
        },

        layout: {
          padding: isMobile ? 8 : 14,
        },

        scales: {
          x: {
            ticks: {
              color: textColor,
              font: { size: isMobile ? 10 : 12 },
            },
            grid: {
              color: borderColor,
            },
            title: {
              display: true,
              text: "Predicted Class",
              color: textColor,
              font: { weight: "bold" },
            },
          },

          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              font: { size: isMobile ? 10 : 12 },
            },
            grid: {
              color: borderColor,
            },
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
            labels: {
              color: textColor,
              padding: isMobile ? 10 : 18,
              boxWidth: 14,
              boxHeight: 14,
              font: {
                size: isMobile ? 10 : 12,
                weight: "600",
              },
            },
          },

          tooltip: {
            backgroundColor: bgColor,
            titleColor: textColor,
            bodyColor: textColor,
            padding: 10,
            cornerRadius: 8,
          },
        },
      },

      plugins: [valueLabelPlugin],
    });

    return () => chartRef.current?.destroy();
  }, [matrix, chartKey, isMobile]);

  return (
    <div className="glass p-4 sm:p-6 rounded-xl w-full max-w-md mx-auto">
      <h3 className="text-sm sm:text-base font-semibold text-accent text-center mb-3">
        Confusion Matrix — Heatmap
      </h3>

      <div className="w-full h-[220px] sm:h-[280px] md:h-[330px]">
        <canvas ref={canvasRef} />
      </div>

      <p className="text-[11px] text-muted mt-2 text-center">
        Higher intensity = higher classification count
      </p>
    </div>
  );
}
