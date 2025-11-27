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

// Read CSS variable safely
const css = (v) =>
  getComputedStyle(document.documentElement).getPropertyValue(v).trim();

// Shorten long labels for mobile
const shorten = (label, max = 10) =>
  label.length > max ? label.slice(0, max) + "…" : label;

export default function MetricsBarChart({ models }) {
  const [chartKey, setChartKey] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  if (!models || models.length === 0) return null;

  // Detect screen size
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Re-render chart on theme change
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

  // Build data
  useEffect(() => {
    const labels = models.map((m) => (isMobile ? shorten(m.name) : m.name));

    setChartData({
      labels,
      datasets: [
        {
          label: "Accuracy",
          data: models.map((m) => m.accuracy),
          backgroundColor: css("--chart-5"),
          borderRadius: 8,

          // ✅ FINAL MOBILE FIX
          barThickness: isMobile ? 5 : 28,
          categoryPercentage: isMobile ? 0.45 : 0.8,
          barPercentage: isMobile ? 0.45 : 0.9,
        },
        {
          label: "F1 Score",
          data: models.map((m) => m.f1),
          backgroundColor: css("--chart-3"),
          borderRadius: 8,

          // ✅ FINAL MOBILE FIX
          barThickness: isMobile ? 5 : 28,
          categoryPercentage: isMobile ? 0.45 : 0.8,
          barPercentage: isMobile ? 0.45 : 0.9,
        },
      ],
    });
  }, [models, chartKey, isMobile]);

  if (!chartData) return null;

  return (
    <div className="glass p-4">
      <h2 className="text-lg font-semibold text-accent mb-3">
        Model Accuracy & F1
      </h2>

      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[450px]">
        <Bar
          key={chartKey}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,

            layout: {
              padding: isMobile ? 6 : 10,
            },

            plugins: {
              legend: {
                position: isMobile ? "bottom" : "top",
                labels: {
                  color: css("--foreground"),
                  font: {
                    size: isMobile ? 10 : 12,
                  },
                  padding: 12,
                },
              },

              tooltip: {
                callbacks: {
                  title: (tooltipItems) => {
                    const index = tooltipItems[0].dataIndex;
                    return models[index]?.name || ""; // ✅ FULL model name
                  },
                  label: (tooltipItem) => {
                    return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
                  },
                },
              },
            },

            scales: {
              x: {
                offset: true,
                ticks: {
                  color: css("--accent"),
                  font: {
                    size: isMobile ? 9 : 11,
                  },
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
                  font: {
                    size: isMobile ? 9 : 11,
                  },
                  stepSize: 0.2,
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
