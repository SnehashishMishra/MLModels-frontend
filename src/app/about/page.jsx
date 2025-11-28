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
        <h1 className="text-3xl font-bold text-accent mb-2">About EtherML</h1>

        <p className="text-sm text-muted leading-relaxed">
          EtherML is an end-to-end <b>Machine Learning (ML)</b> Model Comparison
          Dashboard that allows users to upload datasets, automatically train
          models, visualize results, compare metrics, and generate predictions —
          all through a clean and interactive interface powered by a scalable
          <b> Application Programming Interface (API)</b>.
        </p>
      </motion.section>

      {/* ================== PROBLEM STATEMENT ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-2">
          🧩 Problem Statement
        </h2>

        <p className="text-sm text-muted leading-relaxed">
          In real-world scenarios, beginners and professionals often struggle to
          identify the <b>best-performing machine learning model</b> for a
          dataset. Training, comparing, and testing different models typically
          requires coding experience, time, and knowledge of ML concepts.
          Additionally, there is a lack of interactive tools that can clearly
          visualize model performance using metrics such as
          <b> Accuracy, Precision, Recall, F1-score,</b> and more.
        </p>
      </motion.section>

      {/* ================== PROJECT GOAL & SCOPE ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-2">
          🎯 Main Objective & Scope
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li>Upload a CSV dataset effortlessly</li>
          <li>Automatic preprocessing & cleaning</li>
          <li>Train multiple machine learning models instantly</li>
          <li>Compare results using key statistical metrics</li>
          <li>Visualize performance through charts & tables</li>
          <li>Download the highest-performing trained model</li>
          <li>Perform predictions using manual feature input</li>
        </ul>
      </motion.section>

      {/* ================== SYSTEM FLOW ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-4">
          🔀 System Flow Diagram (Visual Overview)
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
            <FlowBox text="Training & Evaluation" />
            <Arrow />
            <FlowBox text="Metrics + Visualizations" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap text-center">
            <FlowBox text="Best Model Selected" />
            <Arrow />
            <FlowBox text="Download / Make Predictions" />
          </div>
        </div>
      </motion.section>

      {/* ================== USE CASES ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-3">
          🌍 Real-World Use Cases
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li>Medical diagnosis & health risk analysis</li>
          <li>Stock and financial trend predictions</li>
          <li>Customer churn forecasting</li>
          <li>Fraud detection & anomaly checks</li>
          <li>Education, ML learning & research projects</li>
          <li>Automated ML experimentation environments</li>
        </ul>
      </motion.section>

      {/* ================== FUTURE IMPROVEMENTS ================== */}
      <motion.section {...fadeUp} className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-accent mb-3">
          🚀 Future Improvements
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li>Support for advanced multi-class & multi-label datasets</li>
          <li>Deep learning support (CNNs, RNNs, Transformers)</li>
          <li>Drag & drop visual feature engineering</li>
          <li>Automated hyper-parameter tuning (AutoML style)</li>
          <li>Cloud-based deployment & model endpoints</li>
          <li>User model history, version tracking & audit logs</li>
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
        © {year} — EtherML | Crafted & Designed by{" "}
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
