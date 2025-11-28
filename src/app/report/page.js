"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  BrainCircuit,
  Table2,
  BarChart3,
  Info,
  ArrowRight,
  BookUser,
  Trophy,
} from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";

/**
 * app/report/page.js
 * - Generic dataset-aware model interpretation report
 * - Option C: dynamically generate representative examples from dataset preview
 *
 * Expects backend endpoints:
 * GET /current-dataset
 * GET /dataset-preview?page=1
 * GET /models
 * GET /best-model
 * GET /confusion-matrix/{modelName}
 *
 * Paste directly into app/report/page.js
 */

/* ---------- small helpers ---------- */
function pctString(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return "N/A";
  return `${(Number(v) * 100).toFixed(2)}%`;
}
function safeGet(obj, path, fallback = null) {
  try {
    return (
      path
        .split(".")
        .reduce((s, p) => (s && s[p] !== undefined ? s[p] : null), obj) ??
      fallback
    );
  } catch {
    return fallback;
  }
}

/* Compute per-class metrics from NxN confusion matrix */
function computePerClassFromMatrix(matrix) {
  if (!matrix || !Array.isArray(matrix) || matrix.length === 0) return null;
  const n = matrix.length;
  const support = Array(n).fill(0);
  const tp = Array(n).fill(0);
  const fp = Array(n).fill(0);
  const fn = Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = Number(matrix[i][j] ?? 0);
      support[i] += v; // actual row i total
      if (i === j) tp[i] += v;
      else {
        fn[i] += v; // actual i but predicted other
        fp[j] += v; // predicted j but actual other
      }
    }
  }

  const precision = tp.map((t, i) =>
    t + fp[i] === 0 ? null : t / (t + fp[i])
  );
  const recall = tp.map((t, i) => (support[i] === 0 ? null : t / support[i]));
  const f1 = precision.map((p, i) => {
    const r = recall[i];
    if (p === null || r === null || p + r === 0) return null;
    return (2 * p * r) / (p + r);
  });

  return { n, support, tp, fp, fn, precision, recall, f1 };
}

/* Choose representative numeric features for a sample row */
function pickRepresentativeFeatures(sampleRow, limit = 3) {
  if (!sampleRow) return null;
  const entries = Object.entries(sampleRow).filter(([k]) => k !== "target");
  // prefer numeric features, then fallback to first ones
  const numeric = entries.filter(([, v]) => typeof v === "number");
  const chosen = (numeric.length ? numeric : entries).slice(0, limit);
  return chosen.map(([k, v]) => ({ key: k, value: v }));
}

/* ---------- component ---------- */
export default function ReportPage() {
  const { user } = useCurrentUser();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [models, setModels] = useState([]);
  const [best, setBest] = useState(null);
  const [bestCM, setBestCM] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError("");
      try {
        const userQuery = user && user._id ? `?userId=${user._id}` : "";

        const [dsRes, previewRes, modelsRes, bestRes] = await Promise.all([
          fetch(`${API_BASE}/current-dataset${userQuery}`),
          fetch(`${API_BASE}/dataset-preview?page=1${userQuery}`),
          fetch(`${API_BASE}/models${userQuery}`),
          fetch(`${API_BASE}/best-model${userQuery}`),
        ]);

        if (cancelled) return;

        const dsJson = dsRes.ok ? await dsRes.json() : null;
        const previewJson = previewRes.ok ? await previewRes.json() : null;
        const modelsJson = modelsRes.ok ? await modelsRes.json() : [];
        const bestJson = bestRes.ok ? await bestRes.json() : null;

        setDatasetInfo(dsJson);
        setPreview(previewJson);
        setModels(Array.isArray(modelsJson) ? modelsJson : []);
        setBest(bestJson);

        // Try to fetch confusion matrix for best model
        const bestName =
          (bestJson && (bestJson.best_model_name || bestJson.best_model)) ||
          (modelsJson && modelsJson[0] && modelsJson[0].name);

        if (bestName) {
          try {
            const cmRes = await fetch(
              `${API_BASE}/confusion-matrix/${encodeURIComponent(
                bestName
              )}${userQuery}`
            );
            if (cmRes.ok) {
              const cmJson = await cmRes.json();
              const cmObj = cmJson?.confusion_matrix ?? cmJson;
              setBestCM(cmObj);
            } else {
              // fallback: check inside bestJson
              const bmcm =
                bestJson?.confusion_matrix ??
                safeGet(bestJson, "metrics.confusion_matrix", null);
              setBestCM(bmcm ?? null);
            }
          } catch {
            const bmcm =
              bestJson?.confusion_matrix ??
              safeGet(bestJson, "metrics.confusion_matrix", null);
            setBestCM(bmcm ?? null);
          }
        } else {
          setBestCM(null);
        }
      } catch (e) {
        console.error("Report load error:", e);
        setError("Failed to load report — check backend/network.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [user, API_BASE]);

  const uniqueLabels = useMemo(() => {
    if (!preview || !Array.isArray(preview.data)) return null;
    const vals = preview.data
      .map((r) => r.target)
      .filter((v) => v !== undefined && v !== null);
    return Array.from(new Set(vals)).sort((a, b) =>
      typeof a === "number" && typeof b === "number"
        ? a - b
        : String(a).localeCompare(String(b))
    );
  }, [preview]);

  const bestMatrix = useMemo(() => {
    if (!bestCM) return null;
    return bestCM.matrix ?? (Array.isArray(bestCM) ? bestCM : null);
  }, [bestCM]);

  const perClass = useMemo(() => {
    if (!bestMatrix) return null;
    return computePerClassFromMatrix(bestMatrix);
  }, [bestMatrix]);

  if (loading)
    return (
      <p className="text-center py-20 text-muted animate-pulse">
        Loading your ML report...
      </p>
    );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-border/60"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-accent flex items-center gap-2">
          <BookUser /> Model Interpretation Report
        </h1>
        <p className="text-sm text-muted mt-2">
          This auto-generated report explains — in simple, dataset-aware
          language — what your trained models learned and what each metric and
          matrix cell means.
        </p>
      </motion.section>

      {/* DATASET SUMMARY */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-border/60 space-y-3"
      >
        <h2 className="text-lg font-semibold text-accent flex items-center gap-2">
          <Layers size={18} /> Dataset summary
        </h2>

        <p className="text-sm text-muted">
          <strong>Dataset:</strong>{" "}
          <span className="font-semibold text-foreground">
            {datasetInfo?.name ?? preview?.dataset ?? "Default dataset"}
          </span>
        </p>

        {preview?.total_rows ? (
          <p className="text-sm text-muted">
            Rows: <span className="font-semibold">{preview.total_rows}</span> •
            Columns:{" "}
            <span className="font-semibold">
              {preview.data?.[0] ? Object.keys(preview.data[0]).length : "N/A"}
            </span>
          </p>
        ) : null}

        <p className="text-xs text-muted leading-relaxed mt-2">
          Each row is a sample; the column named{" "}
          <span className="font-semibold">target</span> is what models predict.
          This report uses preview samples to produce representative examples
          and label names.
        </p>

        <div className="mt-3 text-xs text-muted">
          {uniqueLabels && uniqueLabels.length > 0 ? (
            <>
              <div>
                Detected classes:{" "}
                <span className="font-mono ml-1">
                  {uniqueLabels.join(", ")}
                </span>
              </div>
              <div className="mt-1">
                Tip: class labels are used directly below for the confusion
                matrix and per-class explanations.
              </div>
            </>
          ) : (
            <div>
              No target labels found in preview (unable to derive class list).
            </div>
          )}
        </div>
      </motion.section>

      {/* BEST MODEL SUMMARY */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-border/60 space-y-3"
      >
        <h2 className="text-lg font-semibold text-accent flex items-center gap-2">
          <BrainCircuit size={18} /> Best model summary
        </h2>

        {best ? (
          <>
            <div className="text-lg font-bold text-foreground flex items-center gap-2">
              <Trophy size={16} className="text-accent" />{" "}
              {best.best_model_name ?? best.best_model ?? "Best model"}
            </div>

            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div>
                <div className="text-xs text-muted">Accuracy</div>
                <div className="font-semibold">
                  {best.metrics?.accuracy != null
                    ? pctString(best.metrics.accuracy)
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted">Precision</div>
                <div className="font-semibold">
                  {best.metrics?.precision != null
                    ? pctString(best.metrics.precision)
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted">Recall</div>
                <div className="font-semibold">
                  {best.metrics?.recall != null
                    ? pctString(best.metrics.recall)
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted">F1</div>
                <div className="font-semibold">
                  {best.metrics?.f1 != null
                    ? pctString(best.metrics.f1)
                    : "N/A"}
                </div>
              </div>
            </div>

            <p className="text-xs text-muted mt-3 leading-relaxed">
              <strong>What these numbers mean for your dataset:</strong>
              <br />
              <br />
              <strong>Accuracy ({pctString(best?.metrics?.accuracy)})</strong> —
              percentage of all samples the model labeled correctly.
              <br />
              <br />
              <strong>
                Precision ({pctString(best?.metrics?.precision)})
              </strong>{" "}
              — when the model predicts a class, how often it was correct (low
              precision = many false positives).
              <br />
              <br />
              <strong>Recall ({pctString(best?.metrics?.recall)})</strong> — of
              all true samples of a class, how many the model found (low recall
              = many missed positives).
              <br />
              <br />
              <strong>F1 ({pctString(best?.metrics?.f1)})</strong> — harmonic
              mean of precision and recall; useful when class frequencies
              differ.
              <br />
              <br />
              <strong>Interpretation note:</strong> High values suggest the
              model aligns well with your labels; perfect scores may indicate
              either an easily separable dataset or potential overfitting —
              validate with cross-validation or fresh unseen data.
            </p>

            <p className="text-xs text-muted leading-relaxed mt-3">
              <strong>What the model actually predicted:</strong>
              <br />
              The model studies all input columns (every column except{" "}
              <em>target</em>) and learns patterns that typically correspond to
              each class label. For any new sample it outputs the class whose
              learned pattern best matches the sample.
              <br />
              <br />
              <strong>What the prediction means (dataset-driven):</strong>
              <br />A predicted label indicates that the sample's feature values
              resemble previously seen samples of that class. Below we show
              representative feature snippets from your preview so you can see
              what the model considers "typical" for each class.
            </p>
          </>
        ) : (
          <p className="text-sm text-muted">
            No best model information available.
          </p>
        )}
      </motion.section>

      {/* MODELS TABLE */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-border/60"
      >
        <h2 className="text-lg font-semibold text-accent flex items-center gap-2">
          <BarChart3 size={18} /> All trained models
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="pb-2">Model</th>
                <th className="pb-2">Accuracy</th>
                <th className="pb-2">Precision</th>
                <th className="pb-2">Recall</th>
                <th className="pb-2">F1</th>
                <th className="pb-2">ROC AUC</th>
              </tr>
            </thead>
            <tbody>
              {models.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-xs text-muted">
                    No model metrics available.
                  </td>
                </tr>
              )}
              {models.map((m) => (
                <tr key={m.name} className="border-t border-border/30">
                  <td className="py-3 font-semibold text-foreground">
                    {m.name}
                  </td>
                  <td className="py-3">
                    {m.accuracy != null ? pctString(m.accuracy) : "N/A"}
                  </td>
                  <td className="py-3">
                    {m.precision != null ? pctString(m.precision) : "N/A"}
                  </td>
                  <td className="py-3">
                    {m.recall != null ? pctString(m.recall) : "N/A"}
                  </td>
                  <td className="py-3">
                    {m.f1 != null ? pctString(m.f1) : "N/A"}
                  </td>
                  <td className="py-3">
                    {m.roc_auc != null ? pctString(m.roc_auc) : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted mt-3">
          Each row shows an evaluated model. Use accuracy and F1 as starting
          points — always inspect the confusion matrix and per-class metrics for
          actionable insights.
        </p>
      </motion.section>

      {/* CONFUSION MATRIX + PER-CLASS ANALYSIS */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-border/60 space-y-4"
      >
        <h2 className="text-lg font-semibold text-accent flex items-center gap-2">
          <Table2 size={18} /> Confusion matrix — per-class breakdown
        </h2>

        {bestMatrix ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-xs text-muted">
                      True \ Pred
                    </th>
                    {bestMatrix[0].map((_, j) => (
                      <th key={j} className="text-xs text-muted text-center">
                        {uniqueLabels?.[j] ?? j}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bestMatrix.map((row, i) => (
                    <tr key={i} className="border-t border-border/30">
                      <td className="py-2 font-medium">
                        {uniqueLabels?.[i] ?? i}
                      </td>
                      {row.map((v, j) => (
                        <td key={j} className="py-2 text-center">
                          <div className="glass inline-block px-2 py-1 rounded-md border border-border/40">
                            {v}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {perClass ? (
              <div className="mt-4 space-y-3 text-sm text-muted">
                <p className="text-xs">
                  Per-class precision / recall / F1 computed from the confusion
                  matrix:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-muted">
                        <th className="text-left pb-2">Class</th>
                        <th className="pb-2 text-center">Support</th>
                        <th className="pb-2 text-center">Precision</th>
                        <th className="pb-2 text-center">Recall</th>
                        <th className="pb-2 text-center">F1 (computed)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: perClass.n }).map((_, i) => (
                        <tr key={i} className="border-t border-border/30">
                          <td className="py-2">{uniqueLabels?.[i] ?? i}</td>
                          <td className="py-2 text-center font-semibold">
                            {perClass.support[i]}
                          </td>
                          <td className="py-2 text-center">
                            {perClass.precision[i] != null
                              ? pctString(perClass.precision[i])
                              : "N/A"}
                          </td>
                          <td className="py-2 text-center">
                            {perClass.recall[i] != null
                              ? pctString(perClass.recall[i])
                              : "N/A"}
                          </td>
                          <td className="py-2 text-center">
                            {perClass.f1[i] != null
                              ? pctString(perClass.f1[i])
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* per-class explanatory notes */}
                <div className="mt-3 space-y-2">
                  <p className="font-semibold text-foreground">
                    Per-class notes
                  </p>
                  {Array.from({ length: perClass.n }).map((_, i) => {
                    const s = perClass.support[i];
                    const t = perClass.tp[i];
                    const mistakes = s - t;
                    const p = perClass.precision[i];
                    const r = perClass.recall[i];
                    const f = perClass.f1[i];
                    // sample representative features
                    const sample = preview?.data?.find(
                      (row) =>
                        String(row.target) === String(uniqueLabels?.[i] ?? i)
                    );
                    const repr = pickRepresentativeFeatures(sample, 3);

                    return (
                      <div key={i} className="text-sm text-muted">
                        <p className="font-medium">
                          Class {String(uniqueLabels?.[i] ?? i)}:
                        </p>
                        <p className="text-xs leading-relaxed">
                          • Support (samples): <strong>{s}</strong>. Correctly
                          predicted: <strong>{t}</strong>.
                          {mistakes > 0
                            ? ` It misclassified ${mistakes} sample(s) from this class into other classes.`
                            : " No misclassifications for this class in the preview."}
                          {p != null
                            ? ` Precision ${pctString(
                                p
                              )} — when predicting this class it was correct ${pctString(
                                p
                              )} of the time.`
                            : ""}
                          {r != null
                            ? ` Recall ${pctString(r)} — it found ${pctString(
                                r
                              )} of all true class samples.`
                            : ""}
                          {f != null ? ` F1 ${pctString(f)}.` : ""}
                        </p>

                        {repr && repr.length ? (
                          <p className="text-xs text-muted mt-1">
                            Representative features from preview:{" "}
                            <span className="font-mono">
                              {repr
                                .map((x) => `${x.key}=${x.value}`)
                                .join(", ")}
                            </span>
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Perfect classification / caution */}
                <div className="mt-4">
                  {perClass &&
                  perClass.support.reduce((a, b) => a + b, 0) > 0 &&
                  perClass.tp.every((t, i) => t === perClass.support[i]) ? (
                    <div className="glass p-3 rounded-md border border-border/40">
                      <p className="font-semibold">
                        Perfect classification detected
                      </p>
                      <p className="text-xs text-muted mt-1">
                        The confusion matrix shows all samples correctly
                        classified in the preview. Possible reasons:
                      </p>
                      <ul className="text-xs text-muted mt-2 ml-4 list-disc">
                        <li>
                          Classes are easily separable in your dataset (strong
                          distinguishing features).
                        </li>
                        <li>
                          The model may be overfitting — validate with
                          cross-validation / unseen data.
                        </li>
                        <li>
                          Preview may be small or biased — consider larger
                          hold-out sets.
                        </li>
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted">
                Unable to compute per-class metrics from the confusion matrix.
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-muted">
            No confusion matrix available for the best model.
          </p>
        )}
      </motion.section>

      {/* WHAT THE MODEL PREDICTS — plain language + dynamic examples */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-border/60 space-y-3"
      >
        <h2 className="text-lg font-semibold text-accent flex items-center gap-2">
          <Info size={18} /> What the model predicts — plain language
        </h2>

        <p className="text-sm text-muted">
          The model maps combinations of input features to one of the target
          classes. Below are class-level plain-English explanations and
          dataset-driven representative examples.
        </p>

        {uniqueLabels && uniqueLabels.length > 0 ? (
          <div className="mt-3 space-y-3 text-sm text-muted">
            {uniqueLabels.map((lab) => {
              const sample = preview?.data?.find(
                (r) => String(r.target) === String(lab)
              );
              const repr = pickRepresentativeFeatures(sample, 4);
              return (
                <div
                  key={String(lab)}
                  className="glass p-3 rounded-md border border-border/30"
                >
                  <div className="font-semibold">
                    If the model predicts{" "}
                    <span className="font-mono">{String(lab)}</span>:
                  </div>
                  <div className="text-xs mt-1">
                    • The model found that the row's overall feature pattern is
                    similar to other samples labeled{" "}
                    <strong>{String(lab)}</strong> in your dataset.
                  </div>

                  {repr && repr.length ? (
                    <div className="text-xs text-muted mt-1">
                      Representative features (preview):{" "}
                      <span className="font-mono">
                        {repr.map((r) => `${r.key}=${r.value}`).join(", ")}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-muted mt-1">
                      No representative preview row available for this class.
                    </div>
                  )}

                  <div className="text-xs text-muted mt-2">
                    What to do with this prediction (dataset-driven):
                    <ul className="ml-4 list-disc mt-1">
                      <li>
                        Use the predicted class to group similar samples for
                        analysis or downstream processing.
                      </li>
                      <li>
                        If this class is important in your application, verify
                        per-class precision/recall above to ensure reliable
                        decisions.
                      </li>
                      <li>
                        If the class is frequently confused with another (see
                        confusion matrix), consider collecting more labeled
                        examples or engineering features that separate these
                        classes.
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No class labels found in preview to produce class-level
            explanations.
          </p>
        )}

        <div className="mt-4 text-xs text-muted">
          <p className="font-semibold">Next steps & validation</p>
          <ul className="ml-4 list-disc mt-1">
            <li>
              Run cross-validation or test with unseen holdout data to ensure
              generalization.
            </li>
            <li>
              Collect more samples for underrepresented classes (if any) to
              improve per-class performance.
            </li>
            <li>
              Use representative features shown above to design domain-specific
              rules or further feature engineering.
            </li>
          </ul>
        </div>
      </motion.section>

      {/* FINAL CTA */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-border/60 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <div>
          <p className="text-sm font-semibold text-accent">
            Want to inspect per-sample predictions or download the model?
          </p>
          <p className="text-xs text-muted">
            Go to the Overview page for detailed charts and model artifacts.
          </p>
        </div>

        <a
          href="/overview"
          className="rounded-full px-5 py-2 bg-accent text-background font-semibold inline-flex items-center gap-2 hover:bg-accent/80 transition"
        >
          Go to Overview <ArrowRight size={16} />
        </a>
      </motion.section>

      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </main>
  );
}
