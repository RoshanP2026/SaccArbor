import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from "recharts";
import { RefreshCw, BarChart3, AlertCircle, Info } from "lucide-react";
import { DatasetRow } from "../types";

export default function EdaCharts() {
  const [dataset, setDataset] = useState<DatasetRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataset = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dataset");
      if (res.ok) {
        const data = await res.json();
        setDataset(data.rows);
      } else {
        setError("Failed to fetch dataset coordinates.");
      }
    } catch (err) {
      setError("Network failure loading data charts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataset();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400 gap-2">
        <RefreshCw className="w-8 h-8 animate-spin text-sky-500" />
        <p className="font-mono text-xs">Parsing clinical distribution arrays...</p>
      </div>
    );
  }

  if (error || dataset.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-rose-500 text-center p-8 gap-2 border border-slate-200 rounded-xl bg-white">
        <AlertCircle className="w-8 h-8" />
        <p className="font-display font-semibold text-sm">Data Loading Fault</p>
        <p className="text-xs text-slate-400 max-w-sm">{error || "Dataset array is empty."}</p>
      </div>
    );
  }

  // 1. Compile Outcome Class Distribution
  const healthyCount = dataset.filter((r) => r.Outcome === 0).length;
  const diabeticCount = dataset.filter((r) => r.Outcome === 1).length;
  const outcomeData = [
    { name: "Non-Diabetic (Outcome 0)", value: healthyCount, color: "#10b981" },
    { name: "Diabetic (Outcome 1)", value: diabeticCount, color: "#f43f5e" },
  ];

  // 2. Compile Glucose Distribution Categories
  // Binning glucose into standard clinical ranges: normal (<100), pre-diabetic (100-140), hyperglycemic (>140)
  const glucoseBins = [
    { name: "<100 mg/dL", healthy: 0, diabetic: 0 },
    { name: "100-140 mg/dL", healthy: 0, diabetic: 0 },
    { name: "140-180 mg/dL", healthy: 0, diabetic: 0 },
    { name: "180+ mg/dL", healthy: 0, diabetic: 0 },
  ];

  dataset.forEach((r) => {
    const gl = r.Glucose;
    const isDiabetic = r.Outcome === 1;
    if (gl < 100) {
      if (isDiabetic) glucoseBins[0].diabetic++;
      else glucoseBins[0].healthy++;
    } else if (gl <= 140) {
      if (isDiabetic) glucoseBins[1].diabetic++;
      else glucoseBins[1].healthy++;
    } else if (gl <= 180) {
      if (isDiabetic) glucoseBins[2].diabetic++;
      else glucoseBins[2].healthy++;
    } else {
      if (isDiabetic) glucoseBins[3].diabetic++;
      else glucoseBins[3].healthy++;
    }
  });

  // 3. Scatter plot coordinates: BMI vs Age binned by Outcome
  const scatterDataHealthy = dataset
    .filter((r) => r.Outcome === 0 && r.BMI > 0 && r.Age > 0)
    .slice(0, 100) // Sample to avoid visual clutter
    .map((r) => ({ x: r.Age, y: r.BMI, size: r.Pregnancies }));

  const scatterDataDiabetic = dataset
    .filter((r) => r.Outcome === 1 && r.BMI > 0 && r.Age > 0)
    .slice(0, 100)
    .map((r) => ({ x: r.Age, y: r.BMI, size: r.Pregnancies }));

  // 4. Missing Zero value counts
  const zeroMetrics = [
    { name: "Insulin", count: dataset.filter((r) => r.Insulin === 0).length, color: "#a855f7" },
    { name: "SkinThickness", count: dataset.filter((r) => r.SkinThickness === 0).length, color: "#6366f1" },
    { name: "BloodPressure", count: dataset.filter((r) => r.BloodPressure === 0).length, color: "#3b82f6" },
    { name: "BMI", count: dataset.filter((r) => r.BMI === 0).length, color: "#14b8a6" },
    { name: "Glucose", count: dataset.filter((r) => r.Glucose === 0).length, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      {/* EXPLANATORY HEADER BANNER */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-normal">
          <strong>Exploratory Data Analysis Report:</strong> These interactive SVG charts are calculated from the actual historical records stored in <code>diabetes.csv</code>. They illustrate clear clinical trends, such as hyperglycemia and elevated BMI, aligning with the model's decision boundaries.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* OUTCOME CLASS split */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              Class Balance: Clinical Outcomes split
            </h4>
            <p className="text-[11px] text-slate-400 mb-4 leading-normal">
              Reveals the moderate class imbalance in the Pima dataset: 65% Non-Diabetic vs 35% Diabetic.
            </p>
          </div>
          <div className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Patients`, "Cohort Count"]} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GLUCOSE BAR bins */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              Plasma Glucose Distribution by Target Class
            </h4>
            <p className="text-[11px] text-slate-400 mb-4 leading-normal">
              Illustrates that patients binned in higher glucose categories (&gt;140 mg/dL) show high diabetic counts.
            </p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={glucoseBins}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="healthy" name="Non-Diabetic (0)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="diabetic" name="Diabetic (1)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SCATTER PLOT: AGE VS BMI */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              Risk Distribution Cluster: BMI vs Patient Age
            </h4>
            <p className="text-[11px] text-slate-400 mb-4 leading-normal">
              Scatter plot depicting how diabetic diagnoses cluster towards high-BMI ranges (&gt;30) across age demographics.
            </p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <XAxis type="number" dataKey="x" name="Age" unit="y" stroke="#94a3b8" fontSize={10} />
                <YAxis type="number" dataKey="y" name="BMI" unit="kg" stroke="#94a3b8" fontSize={10} />
                <ZAxis type="number" dataKey="size" range={[15, 100]} name="Pregnancies" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Scatter name="Non-Diabetic (0)" data={scatterDataHealthy} fill="#10b981" opacity={0.7} />
                <Scatter name="Diabetic (1)" data={scatterDataDiabetic} fill="#f43f5e" opacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MISSING VALUE BAR CHART */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              Biomedical Zero-value Noise Distribution
            </h4>
            <p className="text-[11px] text-slate-400 mb-4 leading-normal">
              Tracks count of missing variables (represented as illegal zeroes) that are corrected during data cleaning.
            </p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zeroMetrics} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip formatter={(value) => [`${value} Zero Cells`, "Missing Count"]} />
                <Bar dataKey="count" name="Zero Cells" radius={[0, 4, 4, 0]}>
                  {zeroMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
