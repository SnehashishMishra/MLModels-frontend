"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, Layers, Trophy } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Database,
  Sparkles,
  ShieldCheck,
  Activity,
} from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function LandingPage() {
  const { user } = useCurrentUser();

  const { scrollY } = useScroll();
  const bgY1 = useTransform(scrollY, [0, 600], [0, 80]);
  const bgY2 = useTransform(scrollY, [0, 600], [0, -60]);

  const primaryCtaHref = user ? "/train" : "/signup";
  const primaryCtaLabel = "Start Training Model";
  const secondaryCtaHref = "/overview";

  const isAdmin = user?.role === "admin";
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        let dsUrl = `${API_BASE}/current-dataset`;
        let modelsUrl = `${API_BASE}/models`;
        let bestUrl = `${API_BASE}/best-model`;

        if (user?._id) {
          const q = `?userId=${user._id}`;
          dsUrl += q;
          modelsUrl += q;
          bestUrl += q;
        }

        const [dsRes, modelsRes, bestRes] = await Promise.all([
          fetch(dsUrl),
          fetch(modelsUrl),
          fetch(bestUrl),
        ]);

        const ds = await dsRes.json();
        const models = await modelsRes.json();
        const best = await bestRes.json();

        setStats({
          dataset: ds?.dataset || ds?.name || "Default dataset",
          models: models?.length || 0,
          best_name: best?.best_model_name || "N/A",
          best_acc: best?.metrics?.accuracy || null,
        });
      } catch (err) {
        console.error("Live Stats Error:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [user]);

  return (
    <main
      className="relative min-h-screen overflow-hidden rounded-md
      bg-linear-to-b from-background via-background/70 to-background
      dark:bg-transparent"
    >
      {/* ===== PARALLAX BACKGROUND ===== */}
      <motion.div
        style={{ y: bgY1 }}
        className="
          pointer-events-none absolute -top-40 -right-40
          h-80 w-80 rounded-full
          bg-linear-to-br
          from-sky-300/50 via-blue-200/40 to-indigo-200/30
          dark:from-accent/40 dark:via-purple-500/30 dark:to-fuchsia-500/20
          blur-3xl opacity-70
        "
      />

      <motion.div
        style={{ y: bgY2 }}
        className="
          pointer-events-none absolute top-40 -left-40
          h-96 w-96 rounded-full
          bg-linear-to-tr
          from-emerald-200/50 via-sky-200/40 to-indigo-200/30
          dark:from-blue-500/30 dark:via-purple-600/20 dark:to-emerald-400/20
          blur-3xl opacity-70
        "
      />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 text-center">
        {/* ================= HERO ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                inline-flex items-center gap-2
                rounded-full px-3 py-1
                text-[11px] font-medium
                border border-accent/30
                bg-white/80 dark:bg-background/70
                backdrop-blur
              "
            >
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="uppercase tracking-wide text-accent">
                EtherML — Model Intelligence Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                text-3xl sm:text-4xl lg:text-5xl font-extrabold
                bg-linear-to-br
                from-sky-600 via-indigo-500 to-emerald-500
                dark:from-purple-600 dark:via-purple-400 dark:to-emerald-300
                bg-clip-text text-transparent
              "
            >
              Compare, visualize & deploy ML models in your browser.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm sm:text-base text-muted max-w-xl"
            >
              Upload a dataset, auto-train machine learning models and download
              the best one — all from a clean dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 justify-center lg:justify-start"
            >
              <Link
                href={primaryCtaHref}
                className="
                  inline-flex items-center gap-2
                  rounded-full px-4 py-2 text-sm font-semibold
                  bg-linear-to-r from-sky-600 via-indigo-500 to-emerald-500
                  dark:from-purple-600 dark:via-purple-500 dark:to-blue-500
                  text-white hover:opacity-90
                "
              >
                {primaryCtaLabel}
                <ArrowRight size={16} />
              </Link>

              <Link
                href={secondaryCtaHref}
                className="
                  inline-flex items-center gap-2
                  rounded-full px-4 py-2.5
                  border border-border
                  bg-white/70 dark:bg-background/70
                  hover:border-accent/60 transition
                "
              >
                View Live Overview
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="
                    inline-flex items-center gap-2
                    rounded-full px-3 py-2
                    border border-amber-500/40
                    bg-amber-500/10
                    text-amber-600 dark:text-amber-400
                  "
                >
                  Admin Panel
                </Link>
              )}
            </motion.div>
          </div>

          {/* RIGHT SIDE STATS CARD */}
          {/* RIGHT: Floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              {/* Back gradient card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="
        absolute inset-0
        bg-linear-to-br
        from-sky-400/30 via-indigo-300/20 to-emerald-300/20
        dark:from-accent/30 dark:via-purple-500/20 dark:to-sky-500/20
        rounded-3xl blur-xl opacity-80
      "
              />

              {/* Front stats card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="
        relative
        glass bg-white/70 dark:bg-card
        border border-border/70
        rounded-3xl p-4 sm:p-5
        space-y-4
      "
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted">Current dataset</p>
                    <p className="text-sm font-semibold text-foreground">
                      {statsLoading ? "Loading dataset..." : stats?.dataset}
                    </p>
                  </div>

                  <span
                    className="
            text-[10px] px-2 py-1 rounded-full
            bg-emerald-500/10 text-emerald-600
            dark:text-emerald-400
            border border-emerald-500/30
          "
                  >
                    Live demo
                  </span>
                </div>

                {statsLoading ? (
                  <p className="text-center text-xs text-muted animate-pulse">
                    Fetching live data...
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <MiniMetric label="Models" value={stats?.models ?? 0} />

                    <MiniMetric
                      label="Best Acc."
                      value={
                        stats?.best_acc
                          ? (stats.best_acc * 100).toFixed(2) + "%"
                          : "N/A"
                      }
                    />

                    <MiniMetric label="Status" value="Ready" />
                  </div>
                )}

                {/* Activity note */}
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-muted">
                    <Activity size={13} className="text-accent" />
                    <span>
                      Next upload will train{" "}
                      <span className="font-semibold text-foreground">
                        all models
                      </span>{" "}
                      automatically.
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ================= LIVE STRIP ================= */}
        <motion.section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <LiveStat
            icon={<Layers size={18} className="text-accent" />}
            label="Dataset"
            value={stats?.dataset || "—"}
          />
          <LiveStat
            icon={<BarChart3 size={18} className="text-emerald-500" />}
            label="Models"
            value={stats?.models || "—"}
          />
          <LiveStat
            icon={<Trophy size={18} className="text-yellow-500" />}
            label="Best Model"
            value={stats?.best_name || "—"}
          />
          <LiveStat
            icon={<Activity size={18} className="text-pink-500" />}
            label="Accuracy"
            value={
              stats?.best_acc ? (stats.best_acc * 100).toFixed(2) + "%" : "—"
            }
          />
        </motion.section>

        {/* ================= FEATURES ================= */}
        <section className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="Auto ML Training"
            icon="🤖"
            description="Train multiple ML algorithms instantly."
          />
          <FeatureCard
            title="Per-user Datasets"
            icon="🧩"
            description="Private datasets and secure training."
          />
          <FeatureCard
            title="Deep Analysis"
            icon="📊"
            description="Charts, matrices, metrics comparison."
          />
        </section>

        {/* ================= FINAL CTA ================= */}
        <section>
          <motion.div
            className="
      glass bg-white/70 dark:bg-card
      rounded-2xl px-6 py-8
      flex flex-col md:flex-row
      justify-between items-center gap-4
    "
          >
            <div className="space-y-1 text-center md:text-left">
              <p className="font-semibold text-accent">
                Ready to try your own dataset?
              </p>
              <p className="text-xs text-muted">
                Upload CSV and get instant results
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-3">
              {/* PRIMARY CTA */}
              <Link
                href={primaryCtaHref}
                className="
          inline-flex items-center gap-2
          rounded-full px-6 py-2.5
          bg-linear-to-r
          from-sky-600 via-indigo-500 to-emerald-500
          dark:from-purple-600 dark:to-blue-500
          text-white font-semibold
        "
              >
                {primaryCtaLabel}
                <ArrowRight size={15} />
              </Link>

              {/* LEARN HOW IT WORKS */}
              <Link
                href="/about"
                className="
          inline-flex items-center gap-2
          rounded-full px-4 py-2
          text-[11px] sm:text-xs font-medium
          border border-border
          hover:border-accent/60
          hover:bg-accent/5
          transition
        "
              >
                Learn how it works
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

/* ===== SMALL COMPONENTS ===== */

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div
      className="
        glass bg-white/70 dark:bg-card
        rounded-xl px-3 py-2
        flex flex-col gap-0.5
        border border-border/50
      "
    >
      <span className="text-[10px] text-muted">{label}</span>
      <span className="text-xs font-semibold text-foreground">{value}</span>
    </div>
  );
}

function LiveStat({ icon, label, value }) {
  return (
    <div className="glass bg-white/70 dark:bg-card rounded-xl p-4 border flex flex-col items-center gap-1.5">
      {icon}
      <span className="text-[10px] text-muted">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="glass bg-white/70 dark:bg-card rounded-xl p-5 border space-y-2">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}
