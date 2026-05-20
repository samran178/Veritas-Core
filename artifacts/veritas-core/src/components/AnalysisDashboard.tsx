import { ForensicResult } from "@/lib/forensics";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { Activity, AlertTriangle, CheckCircle2, Minus } from "lucide-react";

interface AnalysisDashboardProps {
  result: ForensicResult | null;
  isScanning: boolean;
}

function MetricCard({
  label,
  value,
  statusLabel,
  isPositive,
  isNeutral,
}: {
  label: string;
  value: number;
  statusLabel: string;
  isPositive: boolean;
  isNeutral?: boolean;
}) {
  const barColor = isNeutral
    ? "bg-slate-600"
    : isPositive
    ? "bg-emerald-500"
    : "bg-red-500";

  const badgeClass = isNeutral
    ? "bg-slate-800 text-slate-400 border-slate-700"
    : isPositive
    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
    : "bg-red-950/60 text-red-400 border-red-900";

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-slate-500 tracking-widest uppercase">
          {label}
        </span>
        <span className={`font-mono text-[10px] tracking-wider px-2 py-0.5 rounded border ${badgeClass}`}>
          {statusLabel}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="font-mono text-3xl font-bold text-slate-100">{value}</span>
        <span className="font-mono text-sm text-slate-500 mb-1">/100</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 60) return "#10b981"; // emerald
  if (score >= 40) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

function getVerdict(score: number) {
  if (score >= 60) return { label: "LIKELY HUMAN", icon: CheckCircle2, cls: "text-emerald-400" };
  if (score >= 40) return { label: "INDETERMINATE", icon: Minus, cls: "text-amber-400" };
  return { label: "LIKELY AI-GENERATED", icon: AlertTriangle, cls: "text-red-400" };
}

export default function AnalysisDashboard({ result, isScanning }: AnalysisDashboardProps) {
  const verdict = result ? getVerdict(result.humanIntegrityScore) : null;
  const VerdictIcon = verdict?.icon;

  const chartData = result
    ? [{ value: result.humanIntegrityScore, fill: getScoreColor(result.humanIntegrityScore) }]
    : [{ value: 0, fill: "#1e293b" }];

  return (
    <div className="flex flex-col h-full">
      {/* Browser chrome */}
      <div className="bg-slate-800/70 border-b border-slate-700 rounded-t-lg overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-700/60">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-slate-900/60 rounded px-3 py-1 flex items-center gap-2 max-w-sm">
              <span className="font-mono text-xs text-slate-500">veritas://forensic-scan/result</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="font-mono text-xs text-slate-400">VERITAS CORE</span>
          </div>
        </div>
      </div>

      {/* Dashboard body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5">
        {/* Empty state */}
        {!result && !isScanning && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[300px]">
            <div className="font-mono text-slate-600 text-sm tracking-widest">
              AWAITING INPUT
              <span className="cursor-blink">_</span>
            </div>
            <p className="font-mono text-xs text-slate-700 text-center max-w-xs">
              Load a sample or paste text in the intake panel, then execute a deep scan.
            </p>
          </div>
        )}

        {/* Scanning state */}
        {isScanning && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[300px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-900 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-t-emerald-400 border-slate-800 animate-spin" />
              </div>
            </div>
            <div className="font-mono text-emerald-400 text-xs tracking-widest animate-pulse">
              ANALYZING TEXT CORPUS...
            </div>
            <div className="flex gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-4 bg-emerald-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !isScanning && (
          <>
            {/* Metric grid */}
            <div>
              <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-3">
                Forensic Indices
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MetricCard
                  label="Perplexity Index"
                  value={result.perplexityIndex}
                  statusLabel={result.perplexityIndex > 60 ? "AI SIGNATURE" : "NOMINAL"}
                  isPositive={result.perplexityIndex <= 60}
                  isNeutral={false}
                />
                <MetricCard
                  label="Burstiness Rating"
                  value={result.burstinessRating}
                  statusLabel={result.burstinessRating > 50 ? "HUMAN SIGNATURE" : "FLAT LINE"}
                  isPositive={result.burstinessRating > 50}
                />
                <MetricCard
                  label="Repetition Index"
                  value={result.repetitionIndex}
                  statusLabel={result.repetitionIndex > 50 ? "REPETITIVE" : "CLEAN"}
                  isPositive={result.repetitionIndex <= 50}
                />
              </div>
            </div>

            {/* Highlighted text overlay */}
            <div>
              <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-3">
                Sentence Analysis Overlay
              </p>
              <div className="bg-slate-900/60 border border-slate-800 rounded p-4 max-h-48 overflow-y-auto leading-relaxed text-sm text-slate-200">
                {result.sentences.map((s, i) => (
                  <span
                    key={i}
                    title={`${s.isHuman ? "Human" : "AI"} signature — confidence ${Math.round(s.confidence * 100)}%`}
                    className={`
                      inline rounded px-0.5 mr-1 mb-1 cursor-default transition-all
                      ${s.isHuman
                        ? "bg-emerald-900/40 border border-emerald-500/20 hover:bg-emerald-900/60"
                        : "bg-red-900/40 border border-red-500/20 hover:bg-red-900/60"
                      }
                    `}
                  >
                    {s.text}
                    {i < result.sentences.length - 1 ? " " : ""}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-emerald-900/60 border border-emerald-500/30" />
                  <span className="font-mono text-[10px] text-slate-600 uppercase tracking-wider">
                    {result.sentences.filter((s) => s.isHuman).length} Human
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-red-900/50 border border-red-500/30" />
                  <span className="font-mono text-[10px] text-slate-600 uppercase tracking-wider">
                    {result.sentences.filter((s) => !s.isHuman).length} AI
                  </span>
                </div>
              </div>
            </div>

            {/* Gauge chart */}
            <div className="bg-slate-900/60 border border-slate-800 rounded p-4 md:p-6">
              <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-4">
                Human Integrity Score
              </p>
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="w-full max-w-[220px] h-[180px] flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="90%"
                      data={chartData}
                      startAngle={225}
                      endAngle={-45}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                      />
                      <RadialBar
                        background={{ fill: "#1e293b" }}
                        dataKey="value"
                        angleAxisId={0}
                        data={chartData}
                        cornerRadius={6}
                      />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-mono"
                        style={{ fontFamily: "JetBrains Mono, Menlo, monospace" }}
                      >
                        <tspan
                          x="50%"
                          dy="-6"
                          fontSize="28"
                          fontWeight="700"
                          fill={getScoreColor(result.humanIntegrityScore)}
                        >
                          {result.humanIntegrityScore}
                        </tspan>
                        <tspan
                          x="50%"
                          dy="20"
                          fontSize="11"
                          fill="#64748b"
                        >
                          / 100
                        </tspan>
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-4 flex-1 w-full">
                  {verdict && VerdictIcon && (
                    <div className={`flex items-center gap-2 ${verdict.cls}`}>
                      <VerdictIcon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-mono text-sm font-bold tracking-widest">
                        {verdict.label}
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-800/60 rounded p-2">
                      <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Burstiness</div>
                      <div className="text-slate-200">{result.burstinessRating}%</div>
                    </div>
                    <div className="bg-slate-800/60 rounded p-2">
                      <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Perplexity</div>
                      <div className="text-slate-200">{result.perplexityIndex}%</div>
                    </div>
                    <div className="bg-slate-800/60 rounded p-2">
                      <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Repetition</div>
                      <div className="text-slate-200">{result.repetitionIndex}%</div>
                    </div>
                    <div className="bg-slate-800/60 rounded p-2">
                      <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Sentences</div>
                      <div className="text-slate-200">{result.sentences.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
