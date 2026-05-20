import { useState } from "react";
import { humanSample, aiSample } from "@/data/mockTemplates";
import { Scan, Cpu, Wifi } from "lucide-react";

interface ForensicIntakeProps {
  onAnalyze: (text: string) => void;
  isScanning: boolean;
}

export default function ForensicIntake({ onAnalyze, isScanning }: ForensicIntakeProps) {
  const [text, setText] = useState("");

  const handleScan = () => {
    if (text.trim().length > 0) {
      onAnalyze(text);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 glow-emerald" />
          <span className="font-mono text-xs text-slate-400 tracking-widest uppercase">
            Input Terminal
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span className="font-mono text-xs text-emerald-400">ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Cpu className="w-3 h-3" />
            <span className="font-mono text-xs">READY</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 flex flex-col gap-4">
        {/* App identity */}
        <div className="mb-1">
          <h1 className="font-mono text-lg md:text-xl font-bold text-emerald-400 tracking-wider">
            VERITAS CORE
          </h1>
          <p className="font-mono text-xs text-slate-500 tracking-widest mt-0.5">
            TEXT FORENSIC ANALYZER v2.4.1
          </p>
        </div>

        {/* Quick-load buttons */}
        <div>
          <p className="font-mono text-xs text-slate-500 mb-2 tracking-widest uppercase">
            Quick Load
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              data-testid="button-load-human"
              onClick={() => setText(humanSample)}
              disabled={isScanning}
              className="flex-1 min-w-[140px] py-2.5 px-3 rounded border border-emerald-800 bg-emerald-950/40 text-emerald-400 font-mono text-xs tracking-wider uppercase hover:bg-emerald-900/40 hover:border-emerald-600 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              LOAD HUMAN SAMPLE
            </button>
            <button
              data-testid="button-load-ai"
              onClick={() => setText(aiSample)}
              disabled={isScanning}
              className="flex-1 min-w-[140px] py-2.5 px-3 rounded border border-red-900 bg-red-950/40 text-red-400 font-mono text-xs tracking-wider uppercase hover:bg-red-900/30 hover:border-red-700 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              LOAD AI SAMPLE
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-slate-500 tracking-widest uppercase">
              Text Input
            </p>
            <span className="font-mono text-xs text-slate-600">
              {text.length} chars / {text.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            data-testid="input-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isScanning}
            placeholder="Paste or type text to analyze... or use Quick Load above."
            className="flex-1 min-h-[200px] lg:min-h-[280px] w-full rounded border border-slate-700 bg-slate-900/60 text-slate-200 font-sans text-sm p-3 placeholder:text-slate-600 resize-none focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
          />
        </div>

        {/* Scan button */}
        <button
          data-testid="button-scan"
          onClick={handleScan}
          disabled={isScanning || text.trim().length === 0}
          className={`
            w-full py-3.5 px-4 rounded border font-mono text-sm font-bold tracking-widest uppercase
            flex items-center justify-center gap-2.5 transition-all duration-200 min-h-[48px]
            ${isScanning
              ? "border-emerald-700 bg-emerald-950/60 text-emerald-400 cursor-wait"
              : text.trim().length === 0
              ? "border-slate-700 bg-slate-900/40 text-slate-600 cursor-not-allowed"
              : "border-emerald-600 bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/50 hover:border-emerald-500 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] active:scale-[0.99]"
            }
          `}
        >
          <Scan className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
          {isScanning ? "SCANNING..." : "EXECUTE FORENSIC DEEP SCAN"}
        </button>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-900/60 border border-emerald-600/40" />
            <span className="font-mono text-xs text-slate-500">Human signature</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-900/50 border border-red-600/40" />
            <span className="font-mono text-xs text-slate-500">AI signature</span>
          </div>
        </div>
      </div>
    </div>
  );
}
