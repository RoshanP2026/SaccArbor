import { Scale, Award, Sliders, CheckCircle } from "lucide-react";

export default function PerformanceMatrix() {
  const models = [
    {
      name: "Random Forest (Tuned)",
      accuracy: "78.57%",
      cv: "77.21%",
      precision: "73.33%",
      recall: "61.11%",
      f1: "66.67%",
      auc: "0.8412",
      isBest: true,
    },
    {
      name: "Logistic Regression",
      accuracy: "77.27%",
      cv: "76.45%",
      precision: "71.11%",
      recall: "59.26%",
      f1: "64.65%",
      auc: "0.8354",
      isBest: false,
    },
    {
      name: "Support Vector Machine",
      accuracy: "76.62%",
      cv: "76.10%",
      precision: "70.21%",
      recall: "61.11%",
      f1: "65.35%",
      auc: "0.8290",
      isBest: false,
    },
    {
      name: "Gradient Boosting",
      accuracy: "75.32%",
      cv: "74.80%",
      precision: "65.96%",
      recall: "57.41%",
      f1: "61.39%",
      auc: "0.8150",
      isBest: false,
    },
    {
      name: "Random Forest (Baseline)",
      accuracy: "75.97%",
      cv: "75.11%",
      precision: "68.18%",
      recall: "55.56%",
      f1: "61.22%",
      auc: "0.8190",
      isBest: false,
    },
    {
      name: "Decision Tree",
      accuracy: "72.08%",
      cv: "71.56%",
      precision: "61.22%",
      recall: "55.56%",
      f1: "58.25%",
      auc: "0.7180",
      isBest: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* COMPARATIVE GRID TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-sky-600" />
            Model Benchmark Matrix (Stratified Test Split)
          </h3>
          <p className="text-[11px] text-slate-400">
            Validated results of candidate models trained on identical, leakage-free pipelines.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="px-6 py-3">Model Architecture</th>
                <th className="px-6 py-3 text-center">Test Acc</th>
                <th className="px-6 py-3 text-center">CV Mean</th>
                <th className="px-6 py-3 text-center">Precision</th>
                <th className="px-6 py-3 text-center">Recall (Sens.)</th>
                <th className="px-6 py-3 text-center">F1 Score</th>
                <th className="px-6 py-3 text-center">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {models.map((m, idx) => (
                <tr 
                  key={idx} 
                  className={`transition-colors ${
                    m.isBest ? "bg-sky-50/50 hover:bg-sky-50 font-semibold" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    {m.name}
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-slate-900">{m.accuracy}</td>
                  <td className="px-6 py-4 text-center font-mono text-slate-500">{m.cv}</td>
                  <td className="px-6 py-4 text-center font-mono text-slate-500">{m.precision}</td>
                  <td className="px-6 py-4 text-center font-mono text-slate-500">{m.recall}</td>
                  <td className="px-6 py-4 text-center font-mono text-slate-900">{m.f1}</td>
                  <td className="px-6 py-4 text-center font-mono text-slate-900">{m.auc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HYPERPARAMETER CARDS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-slate-900 text-xs mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-500" />
              GridSearchCV Calibration Strategy
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              To mitigate variance in our chosen Random Forest Classifier, we evaluated 324 combinations of estimators, tree depths, and sample splittings. The optimal parameters achieved a tight validation convergence:
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
            <div className="bg-slate-50 rounded-lg p-3">
              <span className="text-slate-400 block mb-0.5">n_estimators</span>
              <strong className="text-slate-800 text-xs">100 trees</strong>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <span className="text-slate-400 block mb-0.5">max_depth</span>
              <strong className="text-slate-800 text-xs">6 levels</strong>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <span className="text-slate-400 block mb-0.5">min_samples_split</span>
              <strong className="text-slate-800 text-xs">10 samples</strong>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <span className="text-slate-400 block mb-0.5">min_samples_leaf</span>
              <strong className="text-slate-800 text-xs">4 samples</strong>
            </div>
          </div>
        </div>

        {/* OVERFITTING ANALYSIS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="font-display font-semibold text-slate-900 text-xs mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-sky-600" />
            Generalization & Variance Analysis Report
          </h4>
          <div className="space-y-3 text-xs leading-relaxed text-slate-600">
            <div className="flex gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Regularization bounds:</strong> Standard Decision Trees suffer from high variance, splitting excessively to achieve 98% train accuracy but dropping to 71.5% in 5-fold cross-validation.
              </div>
            </div>
            <div className="flex gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Randomized Sub-spacing:</strong> By building an ensemble of decorrelated estimators (Random Forest) and restricting maximum depth, we controlled learning bounds. The training accuracy (82.1%) closely tracks the test accuracy (78.6%), confirming low variance.
              </div>
            </div>
            <div className="flex gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Class-weighted sensitivity:</strong> In biomedical screening, <strong>Recall</strong> (Sensitivity) represents the critical safety indicator—failing to identify a diabetic patient is more dangerous than a false positive. Our tuned Random Forest increases recall by 6% relative to the baseline.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
