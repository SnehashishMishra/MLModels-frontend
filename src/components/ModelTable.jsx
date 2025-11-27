import { GalleryHorizontalEnd, MoveHorizontal } from "lucide-react";
import PulseOnView from "./PulseOnView";

export default function ModelTable({ models }) {
  if (!models || models.length === 0) return null;

  return (
    <div className="glass p-4 space-y-4">
      <h2 className="text-lg font-semibold text-accent">Model Metrics</h2>
      {/* ------------------------------------ */}
      {/* RESPONSIVE TABLE FOR ALL SCREENS  */}
      {/* ------------------------------------ */}
      <div className="w-[calc(100%+12px)] rounded-md border border-border overflow-x-hidden">
        <table className="min-w-[700px] w-full text-sm text-left border-collapse ">
          <thead className="bg-accent/90 text-primary-foreground text-xs uppercase">
            <tr>
              <th className="px-3 py-2 sticky left-0 bg-accent/90 z-10">
                Model
              </th>
              <th className="px-3 py-2">Accuracy</th>
              <th className="px-3 py-2">Precision</th>
              <th className="px-3 py-2">Recall</th>
              <th className="px-3 py-2">F1</th>
              <th className="px-3 py-2">ROC AUC</th>
              <th className="px-3 py-2">CV Accuracy</th>
            </tr>
          </thead>

          <tbody>
            {models.map((m, i) => (
              <tr
                key={m.name}
                className={`border-t border-border ${
                  i % 2 === 0 ? "bg-transparent" : "bg-card/30"
                } hover:bg-accent/10 transition`}
              >
                {/* Sticky model name */}
                <td className="px-3 py-2 font-semibold text-accent sticky left-0 bg-card z-10">
                  {m.name}
                </td>

                <td className="px-3 py-2">{Number(m.accuracy).toFixed(3)}</td>

                <td className="px-3 py-2">{Number(m.precision).toFixed(3)}</td>

                <td className="px-3 py-2">{Number(m.recall).toFixed(3)}</td>

                <td className="px-3 py-2">{Number(m.f1).toFixed(3)}</td>

                <td className="px-3 py-2">
                  {m.roc_auc !== null ? Number(m.roc_auc).toFixed(3) : "-"}
                </td>

                <td className="px-3 py-2">
                  {m.cv_mean_accuracy
                    ? Number(m.cv_mean_accuracy).toFixed(3)
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Small ux hint for mobile */}
      <PulseOnView className="">
        <p className="text-xs text-muted text-right ml-32 place-self-start sm:hidden">
          <MoveHorizontal />
        </p>
      </PulseOnView>
    </div>
  );
}
