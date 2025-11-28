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

/* Read theme variable */
const css = (v, fb = "#888") =>
  typeof window === "undefined"
    ? fb
    : getComputedStyle(document.documentElement).getPropertyValue(v).trim();

export default function ModelRadarChart({ model }) {
  const { theme, systemTheme } = useTheme();

  const [chartKey, setChartKey] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

  if (!model) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  /* Detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
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

  /* Build Radar Chart */
  useEffect(() => {
    if (!model || !currentTheme) return;

    /* 🎯 ROUND VALUES TO 3 DECIMALS */
    const round3 = (v) => Number(Number(v).toFixed(3));

    const labels = ["Accuracy", "Precision", "Recall", "F1", "ROC AUC"];

    const values = [
      round3(model.accuracy),
      round3(model.precision),
      round3(model.recall),
      round3(model.f1),
      round3(model.roc_auc ?? 0),
    ];

    setChartData({
      labels,
      datasets: [
        {
          label: model.name,
          data: values,
          backgroundColor: css("--chart-3", "rgba(140,120,255,0.28)"),
          borderColor: css("--chart-1", "#6366F1"),
          pointBackgroundColor: css("--chart-2", "#4ADE80"),
          pointBorderColor: css("--foreground"),
          borderWidth: 2.2,
          fill: true,
        },
      ],
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,

      animation: {
        duration: 900,
        easing: "easeOutQuart",
      },

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
              size: isMobile ? 9 : 12,
              weight: "600",
            },
          },

          ticks: {
            display: false,
          },
        },
      },

      plugins: {
        legend: { display: false },

        tooltip: {
          backgroundColor: css("--card"),
          titleColor: css("--foreground"),
          bodyColor: css("--foreground"),
          padding: 10,
          cornerRadius: 8,

          callbacks: {
            /* 🎯 Precision tooltip values */
            label: (item) => `${item.label}: ${round3(item.raw)}`,
          },
        },
      },
    });
  }, [model, currentTheme, isMobile, chartKey]);

  if (!chartData || !chartOptions) return null;

  return (
    <div className="w-full glass p-4 rounded-xl border border-border/60">
      <h3 className="text-md sm:text-lg font-semibold mb-3 text-accent text-center">
        Model Performance Radar
      </h3>

      <div className="relative w-full h-60 sm:h-[300px] md:h-[340px]">
        <Radar key={chartKey} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
