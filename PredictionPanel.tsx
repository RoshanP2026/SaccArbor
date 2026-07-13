import { useState } from "react";
import { Activity, ShieldAlert, Heart, Clipboard, RefreshCw, Send, BrainCircuit, AlertTriangle, FileText } from "lucide-react";
import { PatientData, PredictionResult } from "../types";

export default function PredictionPanel() {
  const [formData, setFormData] = useState<PatientData>({
    Pregnancies: 2,
    Glucose: 115,
    BloodPressure: 72,
    SkinThickness: 23,
    Insulin: 75,
    BMI: 31.2,
    DiabetesPedigreeFunction: 0.45,
    Age: 33,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [predictionLoading, setPredictionLoading] = useState<boolean>(false);
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [clinicalReport, setClinicalReport] = useState<string | null>(null);

  const handleInputChange = (field: keyof PatientData, val: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const executePrediction = async () => {
    setPredictionLoading(true);
    setClinicalReport(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error("Inference failure", err);
    } finally {
      setPredictionLoading(false);
    }
  };

  const requestClinicalReport = async () => {
    if (!result) return;
    setReportLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientData: formData,
          results: result,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setClinicalReport(data.report);
      }
    } catch (err) {
      console.error("Clinical explanation failed", err);
    } finally {
      setReportLoading(false);
    }
  };

  // Safe parsing helper to format Gemini's clinical report output without throwing errors
  const renderFormattedReport = (text: string) => {
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="font-display font-semibold text-sm text-slate-800 mt-4 mb-2 border-b border-slate-100 pb-1">
            {trimmed.replace("###", "").trim()}
          </h4>
        );
      }
      if (trimmed.startsWith("##") || trimmed.startsWith("#")) {
        return (
          <h3 key={idx} className="font-display font-bold text-base text-sky-950 mt-5 mb-3 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-sky-500" />
            {trimmed.replace(/^[#\s]+/, "").trim()}
          </h3>
        );
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return (
          <li key={idx} className="text-xs text-slate-600 ml-4 list-disc mb-1.5 leading-relaxed">
            {trimmed.substring(1).trim()}
          </li>
        );
      }
      if (trimmed === "") return <div key={idx} className="h-2" />;
      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed mb-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* INPUT FORM PANEL */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2">
              🧬 Patient Biophysical Indicators
            </h3>
            <p className="text-[11px] text-slate-500">
              Input patient biometric values within standard clinical screening ranges.
            </p>
          </div>

          <div className="space-y-4">
            {/* GLUCOSE */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Plasma Glucose (2-hour OGTT)</span>
                <span className="font-mono text-slate-500 font-semibold">{formData.Glucose} mg/dL</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={formData.Glucose}
                onChange={(e) => handleInputChange("Glucose", parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>0 (Missing)</span>
                <span>Normal: &lt;140</span>
                <span>Hyperglycemic: &gt;140</span>
              </div>
            </div>

            {/* BMI */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Body Mass Index (BMI)</span>
                <span className="font-mono text-slate-500 font-semibold">{formData.BMI.toFixed(1)} kg/m²</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="0.1"
                value={formData.BMI}
                onChange={(e) => handleInputChange("BMI", parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>0 (Missing)</span>
                <span>Normal: 18.5 - 24.9</span>
                <span>Obese: &gt;30.0</span>
              </div>
            </div>

            {/* AGE */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Patient Age</span>
                <span className="font-mono text-slate-500 font-semibold">{formData.Age} years</span>
              </div>
              <input
                type="range"
                min="21"
                max="90"
                value={formData.Age}
                onChange={(e) => handleInputChange("Age", parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>Minimum age criteria: 21</span>
                <span>Seniors: &gt;60</span>
              </div>
            </div>

            {/* PREGNANCIES */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Pregnancy Count</span>
                <span className="font-mono text-slate-500 font-semibold">{formData.Pregnancies}</span>
              </div>
              <input
                type="range"
                min="0"
                max="17"
                value={formData.Pregnancies}
                onChange={(e) => handleInputChange("Pregnancies", parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
            </div>

            {/* BLOOD PRESSURE */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Diastolic Blood Pressure</span>
                <span className="font-mono text-slate-500 font-semibold">{formData.BloodPressure} mmHg</span>
              </div>
              <input
                type="range"
                min="0"
                max="130"
                value={formData.BloodPressure}
                onChange={(e) => handleInputChange("BloodPressure", parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>0 (Missing)</span>
                <span>Normal: 80</span>
                <span>Hypertension: &gt;90</span>
              </div>
            </div>

            {/* SKIN THICKNESS */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Triceps Skinfold Thickness</span>
                <span className="font-mono text-slate-500 font-semibold">{formData.SkinThickness} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="99"
                value={formData.SkinThickness}
                onChange={(e) => handleInputChange("SkinThickness", parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
            </div>

            {/* INSULIN */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">2-Hour Serum Insulin</span>
                <span className="font-mono text-slate-500 font-semibold">{formData.Insulin} mIU/L</span>
              </div>
              <input
                type="range"
                min="0"
                max="846"
                value={formData.Insulin}
                onChange={(e) => handleInputChange("Insulin", parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
            </div>

            {/* PEDIGREE */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Diabetes Pedigree Function</span>
                <span className="font-mono text-slate-500 font-semibold">{formData.DiabetesPedigreeFunction.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.08"
                max="2.42"
                step="0.01"
                value={formData.DiabetesPedigreeFunction}
                onChange={(e) => handleInputChange("DiabetesPedigreeFunction", parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>0.08 (Min)</span>
                <span>1.00 (High Genetic Link)</span>
                <span>2.42 (Max)</span>
              </div>
            </div>
          </div>

          <button
            onClick={executePrediction}
            disabled={predictionLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {predictionLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Calibrating model scoring...</span>
              </>
            ) : (
              <>
                <Activity className="w-3.5 h-3.5" />
                <span>Run Prediction Classification</span>
              </>
            )}
          </button>
        </div>

        {/* DIAGNOSTIC OUTPUT & AI REPORT PANEL */}
        <div className="lg:col-span-3 space-y-6">
          {result ? (
            <>
              {/* PRIMARY CALCULATION BOARD */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Risk Probability
                  </span>
                  <div className="text-4xl font-display font-bold text-slate-900 mb-1">
                    {(result.probability * 100).toFixed(1)}%
                  </div>
                  <div className="mt-2">
                    {result.riskLevel === "High" ? (
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-rose-100 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                        High Risk
                      </span>
                    ) : result.riskLevel === "Moderate" ? (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-amber-100 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Moderate Risk
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-emerald-600" />
                        Low Risk
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col justify-center">
                  <h4 className="font-display font-semibold text-slate-800 text-xs mb-1">
                    ML Outcome:{" "}
                    <span className="font-mono text-slate-950 font-bold">
                      {result.outcome === 1 ? "Positive (Class 1)" : "Negative (Class 0)"}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    {result.outcome === 1 ? (
                      "The diagnostic vector places this patient within the diabetic cluster. Primary indicators like Glucose and BMI exert positive log-odds pressure exceeding the 0.5 classification threshold boundary."
                    ) : (
                      "The diagnostic vector places this patient within the healthy reference control cluster. Biophysical attributes lie comfortably inside safe metabolic homeostasis limits."
                    )}
                  </p>
                  
                  {/* GENERATE GEMINI REPORT BUTTON */}
                  {!clinicalReport && (
                    <button
                      onClick={requestClinicalReport}
                      disabled={reportLoading}
                      className="self-start bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                    >
                      {reportLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating clinical assessment...</span>
                        </>
                      ) : (
                        <>
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>Generate Clinical Diagnostic Analysis</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* CLINICAL IMPACT SPLIT */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-display font-semibold text-slate-800 text-xs mb-3 flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-slate-500" />
                  Relative Variable Contribution Boundaries
                </h4>
                <div className="space-y-3">
                  {result.contributions.map((c, idx) => {
                    const pct = Math.min(Math.max((c.impact + 0.5) * 100, 5), 100);
                    const isPositive = c.impact >= 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-medium text-slate-600">{c.name} ({c.value} {c.unit})</span>
                          <span className={`font-mono font-semibold ${isPositive ? "text-rose-600" : "text-emerald-600"}`}>
                            {isPositive ? `+${c.impact.toFixed(2)} odds` : `${c.impact.toFixed(2)} odds`}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isPositive ? "bg-rose-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI CLINICAL REPORT SUMMARY CONTAINER */}
              {clinicalReport && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-sky-700" />
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                    <h4 className="font-display font-semibold text-slate-950 text-xs flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-700" />
                      Clinical Risk Assessment Report
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      Decision Support System Output
                    </span>
                  </div>
                  <div className="prose max-w-none text-slate-800">
                    {renderFormattedReport(clinicalReport)}
                  </div>
                </div>
              )}

              {/* REPORT SKELETON LOADING */}
              {reportLoading && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                    <div className="h-3 bg-slate-200 rounded w-4/5" />
                  </div>
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
              <Clipboard className="w-10 h-10 text-slate-300 mb-3" />
              <h4 className="font-display font-semibold text-slate-800 text-xs mb-1">
                Await Diagnostic Vector
              </h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Adjust the biophysical markers in the patient parameter panel on the left and click <strong>Run Prediction Classification</strong> to view clinical risk assessments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
