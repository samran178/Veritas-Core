import { useState } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import ForensicIntake from "@/components/ForensicIntake";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import { analyzeText, ForensicResult } from "@/lib/forensics";
import { Shield } from "lucide-react";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function VeritasCore() {
  const [result, setResult] = useState<ForensicResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleAnalyze = (text: string) => {
    setIsScanning(true);
    setResult(null);
    setTimeout(() => {
      const r = analyzeText(text);
      setResult(r);
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[hsl(222,47%,4%)] flex flex-col">
      {/* Top header bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 px-4 md:px-8 py-3">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-sm font-bold text-emerald-400 tracking-widest hidden sm:block">
              VERITAS CORE
            </span>
          </div>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <span className="font-mono text-xs text-slate-500 tracking-wider hidden md:block">
            TEXT FORENSIC ANALYZER
          </span>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-slate-500">SYSTEM READY</span>
            </div>
            <span className="font-mono text-xs text-slate-700 hidden sm:block">v2.4.1</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left pane — Intake */}
        <div className="lg:w-[42%] lg:min-h-[calc(100vh-52px)] border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/40 flex flex-col">
          <ForensicIntake onAnalyze={handleAnalyze} isScanning={isScanning} />
        </div>

        {/* Right pane — Dashboard */}
        <div className="flex-1 lg:min-h-[calc(100vh-52px)] flex flex-col">
          <AnalysisDashboard result={result} isScanning={isScanning} />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={VeritasCore} />
            <Route component={NotFound} />
          </Switch>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
