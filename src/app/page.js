"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, Layers, Table2, Trophy } from "lucide-react";
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
  const { user, loadingUser } = useCurrentUser();

  const { scrollY } = useScroll();
  const bgY1 = useTransform(scrollY, [0, 600], [0, 80]); // parallax layer 1
  const bgY2 = useTransform(scrollY, [0, 600], [0, -60]); // parallax layer 2

  const primaryCtaHref = user
    ? "/train" // logged-in → go directly to training
    : "/signup"; // logged-out → sign up first

  const primaryCtaLabel = "Start Training Model";

  const secondaryCtaHref = "/overview";

  const isAdmin = user?.role === "admin";

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  console.log(stats);
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
          rows: ds?.rows || 0,
          columns: ds?.columns?.length || 0,
          models: models?.length || 0,
          best_name: best?.model || best?.name || "N/A",
          best_acc:
            best?.metrics?.accuracy ||
            best?.accuracy ||
            best?.metrics?.Accuracy ||
            null,
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
    <main className="relative min-h-screen overflow-hidden rounded-md">
      {/* ===== PARALLAX BACKGROUND BLOBS ===== */}
      <motion.div
        style={{ y: bgY1 }}
        className="
          pointer-events-none
          absolute -top-40 -right-40
          h-80 w-80
          rounded-full
          bg-linear-to-br from-accent/40 via-purple-500/30 to-fuchsia-500/20
          blur-3xl
          opacity-70
        "
      />
      <motion.div
        style={{ y: bgY2 }}
        className="
          pointer-events-none
          absolute top-40 -left-40
          h-96 w-96
          rounded-full
          bg-linear-to-tr from-blue-500/30 via-purple-600/20 to-emerald-400/20
          blur-3xl
          opacity-70
        "
      />

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 text-center">
        {/* ================= HERO ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: Text */}
          <div className="space-y-6">
            {/* Tiny pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="
                inline-flex items-center gap-2
                rounded-full px-3 py-1
                text-[11px] font-medium
                border border-accent/40
                bg-background/70 backdrop-blur-md
              "
            >
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="uppercase tracking-wide text-accent">
                EtherML — Model Intelligence Platform
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="
                text-3xl sm:text-4xl lg:text-5xl
                font-extrabold
                bg-linear-to-br from-purple-600 via-purple-400 to-emerald-300
                bg-clip-text text-transparent
                leading-tight
              "
            >
              Compare, visualize & deploy{" "}
              <span className="whitespace-nowrap">ML models</span> in your
              browser.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="text-sm sm:text-base text-muted max-w-xl leading-relaxed"
            >
              Upload a dataset, auto-train multiple machine learning algorithms,
              compare their metrics side by side and download the best model —
              all from a beautiful web dashboard powered by FastAPI + Next.js.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-wrap items-center gap-3 pt-2 justify-center lg:justify-start"
            >
              <Link
                href={primaryCtaHref}
                className="
                  inline-flex items-center gap-2
                  rounded-full px-5 py-2.5
                  text-sm font-semibold
                  bg-linear-to-r from-purple-600 via-purple-500 to-blue-500
                  text-background
                  shadow-md shadow-purple-400/40
                  hover:shadow-lg hover:shadow-purple-400/40
                  hover:-translate-y-px
                  transition
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
                  text-xs sm:text-sm font-medium
                  border border-border
                  bg-background/70
                  hover:border-accent/60 hover:bg-accent/5
                  transition
                "
              >
                View Live Overview
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="
                    inline-flex items-center gap-2
                    rounded-full px-4 py-2.5
                    text-xs sm:text-sm font-medium
                    border border-amber-500/50
                    bg-amber-500/10
                    text-amber-400
                    hover:bg-amber-500/20
                    transition
                  "
                >
                  Admin Panel
                </Link>
              )}
            </motion.div>

            {/* Small trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-3 text-[11px] text-muted justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                Secure auth with JWT + cookies
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Database size={13} className="text-sky-400" />
                Per-user datasets, admin controls
              </span>
            </motion.div>
          </div>

          {/* RIGHT: Floating cards / fake preview */}
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
                  bg-linear-to-br from-accent/30 via-purple-500/20 to-sky-500/20
                  rounded-3xl blur-xl opacity-80
                "
              />

              {/* Front stats card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="
                  relative glass border border-border/70
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
                      bg-emerald-500/10 text-emerald-300
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
                    <MiniMetric label="Models" value={stats.dataset} />
                    <MiniMetric
                      label="Best Acc."
                      value={
                        stats.best_acc
                          ? (stats.best_acc * 100).toFixed(2) + "%"
                          : "N/A"
                      }
                    />
                    <MiniMetric label="F1 Score" value="0.97" />
                  </div>
                )}

                {/* Fake tiny chart bars */}
                <div className="mt-3 space-y-1 hidden">
                  <p className="text-[11px] text-muted">Model accuracy</p>
                  <div className="flex items-end gap-1.5 h-16">
                    <ChartBar height="80%" active />
                    <ChartBar height="60%" />
                    <ChartBar height="72%" />
                    <ChartBar height="50%" />
                    <ChartBar height="65%" />
                    <ChartBar height="78%" />
                  </div>
                </div>

                {/* Activity pill */}
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
        {/* ================= LIVE STATS STRIP ================= */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="
    glass
    rounded-2xl
    border border-border/60
    px-4 py-4 sm:px-6
  "
        >
          {statsLoading ? (
            <p className="text-center text-xs text-muted animate-pulse">
              Fetching live data...
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <LiveStat
                icon={<Layers size={16} className="text-accent" />}
                label="Dataset"
                value={stats.dataset}
              />

              <LiveStat
                icon={<BarChart3 size={16} className="text-emerald-400" />}
                label="Models Trained"
                value={stats.models}
              />

              <LiveStat
                icon={<Trophy size={16} className="text-yellow-400" />}
                label="Best Model"
                value={stats.best_name}
              />

              <LiveStat
                icon={<Activity size={16} className="text-pink-400" />}
                label="Best Accuracy"
                value={
                  stats.best_acc
                    ? (stats.best_acc * 100).toFixed(2) + "%"
                    : "N/A"
                }
              />
            </div>
          )}
        </motion.section>

        {/* ================= FEATURES ================= */}
        <section className="space-y-5 text-left">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-xl sm:text-2xl font-semibold text-accent"
          >
            Built like a real ML SaaS product.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              title="Automatic Model Training"
              icon="🤖"
              description="Upload a CSV and automatically train Logistic Regression, Random Forest, SVM, k-NN, Naive Bayes, MLP and more."
            />
            <FeatureCard
              title="Per-user Datasets"
              icon="🧑‍💻"
              description="Each user gets their own isolated dataset and best model, while admins can inspect and clean up everything."
            />
            <FeatureCard
              title="Interactive Visuals"
              icon="📊"
              description="Compare models with charts, confusion matrices and radar plots powered by Chart.js and custom components."
            />
          </div>
        </section>

        {/* ================= WORKFLOW ================= */}
        <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] items-start text-left">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="glass rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-accent">
              How it works
            </h2>

            <ol className="space-y-3 text-sm text-muted">
              <Step
                index={1}
                title="Upload your dataset"
                body="Provide a CSV file with features and label column. The backend cleans, encodes and validates your data."
              />
              <Step
                index={2}
                title="Train multiple models"
                body="FastAPI triggers scikit-learn pipelines to train a suite of classifiers, computing Accuracy, F1, ROC AUC and more."
              />
              <Step
                index={3}
                title="Compare & download"
                body="Use the dashboard to inspect charts, confusion matrices and then download the best performing model as a .pkl file."
              />
            </ol>
          </motion.div>

          {/* Tech stack card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="
              glass rounded-2xl p-5 sm:p-6
              border border-accent/30
              space-y-3
            "
          >
            <p className="text-xs uppercase tracking-[0.18em] text-accent">
              Tech stack
            </p>
            <div className="space-y-2 text-sm text-muted">
              <p>
                <span className="font-semibold text-foreground">
                  Frontend:{" "}
                </span>
                Next.js 16, React, Tailwind CSS, Framer Motion
              </p>
              <p>
                <span className="font-semibold text-foreground">Backend: </span>
                FastAPI, scikit-learn, Python
              </p>
              <p>
                <span className="font-semibold text-foreground">Storage: </span>
                MongoDB (users & auth), file-based model artifacts
              </p>
            </div>

            <div className="pt-3 text-[11px] text-muted">
              Designed & built by{" "}
              <span className="text-accent font-semibold">Snehashish</span> —
              EtherML
            </div>
          </motion.div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="pb-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="
              glass rounded-2xl px-5 py-6 sm:px-7 sm:py-7
              flex flex-col md:flex-row items-center justify-between gap-4
            "
          >
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm font-semibold text-accent">
                Ready to see your own dataset in action?
              </p>
              <p className="text-xs text-muted">
                Upload a CSV, let the models compete and ship the winner — all
                from your browser.
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-3">
              <Link
                href={primaryCtaHref}
                className="
                  inline-flex items-center gap-2
                  rounded-full px-5 py-2.5
                  text-xs sm:text-sm font-semibold
                  bg-accent text-background
                  hover:bg-accent/80
                  transition
                "
              >
                {primaryCtaLabel}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/about"
                className="
                  inline-flex items-center gap-2
                  rounded-full px-4 py-2
                  text-[11px] sm:text-xs font-medium
                  border border-border
                  hover:border-accent/60 hover:bg-accent/5
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

/* ========== SMALL SUB-COMPONENTS ========== */
function LiveStat({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="
        glass
        px-3 py-3
        rounded-xl
        border border-border/50
        flex flex-col items-center justify-center gap-1.5
      "
    >
      <div className="mb-0.5">{icon}</div>
      <span className="text-[10px] uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="text-xs font-semibold text-foreground text-center">
        {value}
      </span>
    </motion.div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="glass rounded-xl px-3 py-2 flex flex-col gap-0.5 border border-border/50">
      <span className="text-[10px] text-muted">{label}</span>
      <span className="text-xs font-semibold text-foreground">{value}</span>
    </div>
  );
}

function ChartBar({ height, active }) {
  return (
    <div
      className={`
        flex-1 rounded-full
        bg-linear-to-t
        ${
          active
            ? "from-accent/80 to-emerald-400/80"
            : "from-border to-accent/40"
        }
      `}
      style={{ height }}
    />
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="
        glass rounded-2xl p-4 sm:p-5
        border border-border/60
        space-y-2
      "
    >
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-accent/15 flex items-center justify-center">
          <span className="text-base">{icon}</span>
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          {title}
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-muted leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function Step({ index, title, body }) {
  return (
    <div className="flex gap-3 items-start">
      <div
        className="
          h-6 w-6 rounded-full
          bg-accent/15 border border-accent/50
          flex items-center justify-center
          text-[11px] font-semibold text-accent
          mt-0.5
        "
      >
        {index}
      </div>
      <div className="space-y-0.5">
        <p className="text-xs sm:text-sm font-semibold text-foreground">
          {title}
        </p>
        <p className="text-[11px] sm:text-xs text-muted leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
}
