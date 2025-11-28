"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* Read CSS variable safely */
const css = (v, fb = "#999") =>
  typeof window === "undefined"
    ? fb
    : getComputedStyle(document.documentElement).getPropertyValue(v).trim();

/* Shorten labels for small screens */
const shorten = (label, max = 10) =>
  label.length > max ? label.slice(0, max) + "…" : label;

export default function MetricsBarChart({ models }) {
  const [isMobile, setIsMobile] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [chartKey, setChartKey] = useState(0);

  if (!models || models.length === 0) return null;

  /* Detect mobile screen */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Re-render on theme change */
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

  /* Build Chart Data */
  useEffect(() => {
    const labels = models.map((m) => (isMobile ? shorten(m.name) : m.name));

    setChartData({
      labels,
      datasets: [
        {
          label: "Accuracy",
          data: models.map((m) => Number(m.accuracy.toFixed(3))), // precise
          backgroundColor: css("--chart-5", "rgba(56,189,248,0.8)"),
          borderRadius: isMobile ? 5 : 10,
          barThickness: isMobile ? 8 : 30,
        },
        {
          label: "F1 Score",
          data: models.map((m) => Number(m.f1.toFixed(3))), // precise
          backgroundColor: css("--chart-3", "rgba(167,139,250,0.8)"),
          borderRadius: isMobile ? 5 : 10,
          barThickness: isMobile ? 8 : 30,
        },
      ],
    });
  }, [models, isMobile, chartKey]);

  if (!chartData) return null;

  return (
    <div className="glass p-4 sm:p-5 rounded-xl border border-border/60">
      <h2 className="text-lg font-semibold text-accent mb-4">
        Model Accuracy & F1 Score
      </h2>

      <div className="relative w-full h-[260px] sm:h-[330px] md:h-[430px]">
        <Bar
          key={chartKey}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 900,
              easing: "easeOutQuart",
            },

            layout: {
              padding: isMobile ? 4 : 10,
            },

            plugins: {
              legend: {
                position: isMobile ? "bottom" : "top",
                labels: {
                  color: css("--foreground"),
                  font: {
                    size: isMobile ? 10 : 12,
                    weight: "500",
                  },
                  padding: 12,
                },
              },

              tooltip: {
                backgroundColor: css("--card"),
                titleColor: css("--foreground"),
                bodyColor: css("--foreground"),
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  /* Show full model name */
                  title: (items) => {
                    const idx = items[0].dataIndex;
                    return models[idx]?.name || "";
                  },
                  /* 3-decimal metric precision */
                  label: (item) => {
                    const v = Number(item.raw).toFixed(3);
                    return `${item.dataset.label}: ${v}`;
                  },
                },
              },
            },

            scales: {
              x: {
                ticks: {
                  color: css("--accent"),
                  font: { size: isMobile ? 9 : 11 },
                },
                grid: {
                  color: css("--border"),
                },
              },

              y: {
                beginAtZero: true,
                max: 1,
                ticks: {
                  color: css("--accent"),
                  font: { size: isMobile ? 9 : 11 },
                  callback: (value) => value.toFixed(2), // axis precision
                },
                grid: {
                  color: css("--border"),
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
