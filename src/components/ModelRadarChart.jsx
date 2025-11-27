"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Helper to read CSS variables
const css = (v) =>
  getComputedStyle(document.documentElement).getPropertyValue(v).trim();

export default function ModelRadarChart({ model }) {
  const { theme, systemTheme } = useTheme();

  const [chartKey, setChartKey] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  if (!model) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  /* ✅ Detect mobile screen */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ✅ Re-render when theme changes */
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

  /* ✅ Build chart */
  useEffect(() => {
    if (!currentTheme || !model) return;

    const labels = ["Accuracy", "Precision", "Recall", "F1", "ROC AUC"];
    const values = [
      model.accuracy,
      model.precision,
      model.recall,
      model.f1,
      model.roc_auc ?? 0,
    ];

    setChartData({
      labels,
      datasets: [
        {
          label: model.name,
          data: values,
          backgroundColor: css("--chart-3"),
          borderColor: css("--chart-1"),
          pointBackgroundColor: css("--chart-2"),
          borderWidth: 2,
          fill: true,
        },
      ],
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        r: {
          beginAtZero: true,
          max: 1,

          grid: {
            color: css("--border"),
          },

          angleLines: {
            color: css("--border"),
          },

          pointLabels: {
            color: css("--foreground"),
            font: {
              size: isMobile ? 9 : 11,
              weight: "bold",
            },
          },

          ticks: {
            display: false,
          },
        },
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          enabled: true,
          backgroundColor: css("--accent"),
          titleColor: css("--background"),
          bodyColor: css("--background"),
        },
      },
    });
  }, [model, currentTheme, isMobile, chartKey]);

  if (!chartData || !chartOptions) return null;

  return (
    <div className="w-full glass p-4 rounded-xl">
      <h3 className="text-md sm:text-lg font-semibold mb-3 text-accent text-center">
        Model Performance Radar
      </h3>

      {/* ✅ Responsive container */}
      <div className="relative w-full h-60 sm:h-[300px] md:h-[340px]">
        <Radar key={chartKey} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
