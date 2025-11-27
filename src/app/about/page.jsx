"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function AboutPage() {
  const year = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 py-6">
      {/* ================== HEADER ================== */}
      <motion.section {...fadeUp}>
        <h1 className="text-3xl font-bold text-accent mb-2">
          About this Machine Learning Dashboard
        </h1>

        <p className="text-sm text-muted leading-relaxed">
          This project is an end-to-end <b>Machine Learning (ML)</b> Model
          Comparison Dashboard designed to analyze, compare, visualize and
          deploy machine learning models trained on a dataset provided by the
          user. It allows interactive model inspection, statistical comparison
          and real-time predictions via a web interface powered by an
          <b> Application Programming Interface (API)</b>.
        </p>
      </motion.section>

      {/* ================== PROBLEM STATEMENT ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-2">
          🧩 Problem Statement
        </h2>

        <p className="text-sm text-muted leading-relaxed">
          In many real-world scenarios, data scientists and students struggle to
          identify the <b>best machine learning model</b> for a dataset because
          testing models individually requires coding, time, and deep ML
          knowledge. There is also a lack of interactive tools that visually
          compare models using metrics such as{" "}
          <b>Accuracy, Precision, Recall and F1-score</b>.
        </p>
      </motion.section>

      {/* ================== PROJECT GOAL & SCOPE ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-2">
          🎯 Main Objective & Scope
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li>Upload a CSV dataset</li>
          <li>Automatically preprocess & clean data</li>
          <li>Train multiple machine learning models</li>
          <li>Compare models using statistical metrics</li>
          <li>Visualize outputs with charts</li>
          <li>Download the best-performing ML model</li>
          <li>Perform predictions using manual input</li>
        </ul>
      </motion.section>

      {/* ================== SYSTEM FLOW DIAGRAM ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-4">
          🔀 System Flow Diagram (Visual Representation)
        </h2>

        <div className="space-y-4 text-sm text-muted">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap text-center">
            <FlowBox text="User" />
            <Arrow />
            <FlowBox text="Next.js Frontend" />
            <Arrow />
            <FlowBox text="FastAPI Backend" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap text-center">
            <FlowBox text="ML Models (Scikit-Learn)" />
            <Arrow />
            <FlowBox text="Trained & Evaluated" />
            <Arrow />
            <FlowBox text="Results + Charts" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap text-center">
            <FlowBox text="Best Model" />
            <Arrow />
            <FlowBox text="Download / Predict" />
          </div>
        </div>
      </motion.section>

      {/* ================== REAL WORLD USE ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-3">
          🌍 Real-World Use Cases
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li>Medical diagnosis data analysis</li>
          <li>Stock price movement prediction models</li>
          <li>Customer churn prediction in businesses</li>
          <li>Fraud detection systems</li>
          <li>Educational and research purposes</li>
          <li>Automated AI model testing labs</li>
        </ul>
      </motion.section>

      {/* ================== FUTURE IMPROVEMENTS ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-3">
          🚀 Future Improvements
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li>Support for multi-class classification</li>
          <li>Deep learning models (CNN, RNN)</li>
          <li>Drag & drop feature engineering</li>
          <li>Auto hyper-parameter tuning</li>
          <li>Cloud deployment of trained models</li>
          <li>User model history & versioning</li>
        </ul>
      </motion.section>

      {/* ================== SYSTEM ARCHITECTURE ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-3">
          🏗️ System Architecture
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li>
            <b>Frontend:</b> Next.js + Tailwind CSS
          </li>
          <li>
            <b>Backend:</b> FastAPI (Python)
          </li>
          <li>
            <b>ML:</b> Scikit-Learn
          </li>
          <li>
            <b>Auth:</b> JWT + Cookies + MongoDB
          </li>
          <li>
            <b>Charts:</b> Chart.js
          </li>
        </ul>
      </motion.section>

      {/* ================== GLOSSARY ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-3">📖 Glossary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted">
          <span>
            <b>ML</b> — Machine Learning
          </span>
          <span>
            <b>AI</b> — Artificial Intelligence
          </span>
          <span>
            <b>CSV</b> — Comma Separated Values
          </span>
          <span>
            <b>ROC</b> — Receiver Operating Characteristic
          </span>
          <span>
            <b>AUC</b> — Area Under Curve
          </span>
          <span>
            <b>TP</b> — True Positive
          </span>
          <span>
            <b>TN</b> — True Negative
          </span>
          <span>
            <b>FP</b> — False Positive
          </span>
          <span>
            <b>FN</b> — False Negative
          </span>
        </div>
      </motion.section>

      {/* ================== FOOTER ================== */}
      <motion.section
        {...fadeUp}
        className="text-center text-xs text-muted mt-6"
      >
        © {year} — ML Dashboard | Built & Designed by{" "}
        <span className="text-accent font-semibold">Snehashish</span>
      </motion.section>
    </div>
  );
}

/* ========= FLOW COMPONENTS ========= */

function FlowBox({ text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="px-4 py-2 rounded-lg border border-border glass text-accent font-medium"
    >
      {text}
    </motion.div>
  );
}

function Arrow() {
  return <span className="text-2xl text-muted hidden sm:block">→</span>;
}
