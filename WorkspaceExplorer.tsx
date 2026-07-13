import { useState, useEffect } from "react";
import { FileCode, FileText, Download, Copy, Check, FileSpreadsheet, HardDrive, RefreshCw } from "lucide-react";

export default function WorkspaceExplorer() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("train.py");
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Load file list from Express API
  const fetchFileList = async () => {
    try {
      const res = await fetch("/api/files");
      if (res.ok) {
        const data = await res.json();
        // Sort files to put train.py first
        const sorted = data.files.sort((a: string, b: string) => {
          if (a === "train.py") return -1;
          if (b === "train.py") return 1;
          return a.localeCompare(b);
        });
        setFiles(sorted);
      }
    } catch (err: any) {
      console.error("Failed to load files", err);
    }
  };

  // Load single file content
  const fetchFileContent = async (filename: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/files/${filename}`);
      if (res.ok) {
        const data = await res.json();
        setFileContent(data.content);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to load file content.");
      }
    } catch (err: any) {
      setError("Network error loading file.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFileList();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetchFileContent(selectedFile);
    }
  }, [selectedFile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".csv")) return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
    if (filename.endsWith(".ipynb")) return <FileCode className="w-4 h-4 text-orange-500" />;
    if (filename.endsWith(".pkl")) return <HardDrive className="w-4 h-4 text-purple-500" />;
    if (filename.endsWith(".py")) return <FileCode className="w-4 h-4 text-sky-500" />;
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-[600px]">
      {/* LEFT PANEL: FILE TREE */}
      <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-display font-semibold text-slate-900 flex items-center gap-2">
              📂 Workspace Files
            </h3>
            <button 
              onClick={fetchFileList} 
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
              title="Refresh Workspace"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[450px] pr-1">
            {files.length === 0 ? (
              <div className="text-xs text-slate-400 p-4 text-center">
                Generating workspace files...
              </div>
            ) : (
              files.map((file) => {
                const isSelected = selectedFile === file;
                return (
                  <button
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition ${
                      isSelected
                        ? "bg-sky-50 text-sky-700 border-l-4 border-sky-600 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden truncate">
                      {getFileIcon(file)}
                      <span className="truncate">{file}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-500 font-mono">
            <strong>Repo Location:</strong><br />
            /SaccArbor/
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            These are the identical physical files deployed to GitHub and Streamlit Cloud. Use the download buttons to save them locally.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: EDITOR & PREVIEW */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between bg-slate-50 px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            {getFileIcon(selectedFile)}
            <span className="font-mono text-xs font-semibold text-slate-700">
              {selectedFile}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition"
              title="Copy code to clipboard"
              disabled={loading || !!error}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <a
              href={`/api/download-file/${selectedFile}`}
              className="bg-sky-600 text-white hover:bg-sky-700 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 min-h-[480px] flex flex-col overflow-auto bg-slate-950">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
              <RefreshCw className="w-8 h-8 animate-spin text-sky-500" />
              <p className="font-mono text-xs">Parsing repository buffers...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-rose-400 p-8 text-center gap-2">
              <p className="font-mono text-sm font-semibold">⚠️ Artifact Loading Failure</p>
              <p className="text-xs text-slate-400 max-w-md">{error}</p>
            </div>
          ) : (
            <pre className="p-5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
              <code>{fileContent}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
