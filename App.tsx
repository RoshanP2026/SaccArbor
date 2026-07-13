import { useState } from "react";
import { 
  HeartPulse, 
  Home as HomeIcon, 
  Database, 
  Binary, 
  LineChart, 
  FolderGit, 
  Activity, 
  UserCheck, 
  ChevronRight,
  User,
  Shield,
  Code,
  Globe,
  Mail,
  Linkedin
} from "lucide-react";
import WorkspaceExplorer from "./components/WorkspaceExplorer";
import PredictionPanel from "./components/PredictionPanel";
import EdaCharts from "./components/EdaCharts";
import PerformanceMatrix from "./components/PerformanceMatrix";
// @ts-ignore
import roshanPortrait from "./assets/images/roshan_perera_portrait_1783435936830.jpg";

type TabType = "home" | "dataset" | "prediction" | "performance" | "workspace" | "about";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-100 selection:text-sky-900">
      
      {/* GLOBAL HEALTHCARE HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 text-white p-2 rounded-xl flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-bold text-slate-900 text-base leading-tight tracking-tight">
                SaccArbor
              </h1>
              <p className="text-[10px] font-mono font-medium text-slate-400 tracking-wider uppercase">
                Clinical Decision Support System
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* SUB-HEADER CONTROL TABS */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <nav className="flex space-x-1 py-1.5 min-w-max">
            {/* HOME */}
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition ${
                activeTab === "home"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" />
              Home
            </button>

            {/* DATASET INFORMATION */}
            <button
              onClick={() => setActiveTab("dataset")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition ${
                activeTab === "dataset"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Dataset & EDA
            </button>

            {/* DIABETES PREDICTION */}
            <button
              onClick={() => setActiveTab("prediction")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition ${
                activeTab === "prediction"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              Diabetes Prediction
            </button>

            {/* MODEL PERFORMANCE */}
            <button
              onClick={() => setActiveTab("performance")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition ${
                activeTab === "performance"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              Model Performance
            </button>

            {/* WORKSPACE FILES */}
            <button
              onClick={() => setActiveTab("workspace")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition ${
                activeTab === "workspace"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FolderGit className="w-3.5 h-3.5" />
              Project Files
            </button>

            {/* ABOUT AUTHOR */}
            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition ${
                activeTab === "about"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              About the Author
            </button>
          </nav>
        </div>
      </div>

      {/* CORE DISPLAY WINDOW */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: ACADEMIC HOME & MENTORSHIP SYLLABUS */}
        {activeTab === "home" && (
          <div className="space-y-8 animate-fadeIn">
            {/* HERO JUMBOTRON */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                  Author: Roshan Perera (S25026203)
                </span>
                <h2 className="font-display font-bold text-slate-900 text-2xl sm:text-3xl tracking-tight leading-none">
                  Diabetes Risk Prediction System Using Machine Learning
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Welcome! This platform serves as an interactive clinical decision-support framework. Explore the high-fidelity exploratory data analysis charts, perform real-time model predictions using our calibrated Random Forest classifier, evaluate performance matrix benchmarks across multiple candidate architectures, and access the underlying modular codebase.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button 
                    onClick={() => setActiveTab("prediction")} 
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Activity className="w-4 h-4" />
                    Launch Diagnostics Panel
                  </button>
                  <button 
                    onClick={() => setActiveTab("workspace")} 
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center gap-1.5 transition border border-slate-200"
                  >
                    <FolderGit className="w-4 h-4" />
                    Explore Project Files
                  </button>
                </div>
              </div>
              <div className="w-full md:w-auto shrink-0 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=320&q=80" 
                  alt="Clinical Research" 
                  className="rounded-2xl w-48 h-48 object-cover border-4 border-slate-100 shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DATASET & EDA */}
        {activeTab === "dataset" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-200 pb-4 mb-4">
              <h2 className="font-display font-bold text-slate-900 text-lg">
                📊 Dataset Information & Interactive EDA
              </h2>
              <p className="text-xs text-slate-500">
                Study descriptive statistics, Pima cohort demographics, and explore correlations in real time.
              </p>
            </div>
            <EdaCharts />
          </div>
        )}

        {/* TAB 3: DIABETES RISK PREDICTOR */}
        {activeTab === "prediction" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-200 pb-4 mb-4">
              <h2 className="font-display font-bold text-slate-900 text-lg">
                🤖 Diabetes Prediction Panel
              </h2>
              <p className="text-xs text-slate-500">
                Submit patient physiological values to score risk probabilities and generate diagnostic summaries.
              </p>
            </div>
            <PredictionPanel />
          </div>
        )}

        {/* TAB 4: MODEL PERFORMANCE */}
        {activeTab === "performance" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-200 pb-4 mb-4">
              <h2 className="font-display font-bold text-slate-900 text-lg">
                📉 Classifier Performance Metrics
              </h2>
              <p className="text-xs text-slate-500">
                Review comparative performance benches, confusion matrices, and parameter tuning summaries.
              </p>
            </div>
            <PerformanceMatrix />
          </div>
        )}

        {/* TAB 5: REPOSITORY WORKSPACE FILES */}
        {activeTab === "workspace" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-200 pb-4 mb-4">
              <h2 className="font-display font-bold text-slate-900 text-lg">
                📂 Workspace File Explorer
              </h2>
              <p className="text-xs text-slate-500">
                Explore the actual python files, model pickles, and dataset located in the workspace directory.
              </p>
            </div>
            <WorkspaceExplorer />
          </div>
        )}

        {/* TAB 6: ABOUT THE AUTHOR */}
        {activeTab === "about" && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="font-display font-bold text-slate-900 text-lg">
                👤 About the Author & Developer
              </h2>
              <p className="text-xs text-slate-500">
                Meet the clinical data scientist and machine learning engineer behind SaccArbor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <img 
                      src={roshanPortrait} 
                      alt="Roshan Perera" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-bold text-slate-900 text-lg">Roshan Perera</h3>
                  <p className="text-xs font-mono font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full inline-block">
                    Student ID: S25026203
                  </p>
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    Clinical Data Scientist & ML Engineer
                  </p>
                </div>

                <div className="w-full border-t border-slate-100 pt-4 flex justify-center gap-3">
                  <a 
                    href="mailto:roshanpererait@gmail.com"
                    className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                    title="GitHub Portfolio"
                  >
                    <FolderGit className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Bio & Professional Statement */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Shield className="w-4 h-4 text-sky-600" />
                    Professional Profile
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Roshan Perera is a Clinical Data Scientist specializing in medical informatics, health intelligence systems, and medical diagnostics classifiers. With a strong foundation in translating complex biological datasets into validated, highly-calibrated analytical workflows, Roshan bridges the gap between machine learning research and clinical decision support systems.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This platform, <strong>SaccArbor</strong>, is the culmination of rigorous scientific evaluation of classification algorithms (including Random Forest, SVM, Decision Trees, and Logistic Regression) aimed at early screening for diabetic risk indicators.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Code className="w-4 h-4 text-sky-600" />
                    Key Architectural Contributions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <strong className="text-slate-800">Calibrated ML Pipeline</strong>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Engineered a target-stratified median imputation strategy that eliminates predictive bias and data leakage.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <strong className="text-slate-800">Ensemble Optimization</strong>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Tuned hyperparameters using a cross-validated grid search to maximize classification recall on diabetic patient screening cohorts.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <strong className="text-slate-800">Generative Diagnostic Insights</strong>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Integrated an advanced LLM inference layer leveraging server-side Gemini-3.5-Flash to explain high-risk biomarkers dynamically.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <strong className="text-slate-800">Reproducible Codebase</strong>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Crafted a modular structure separating backend express proxies, front-end visualizers, and raw python training scripts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-xs">
              Roshan Perera: S25026203
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

