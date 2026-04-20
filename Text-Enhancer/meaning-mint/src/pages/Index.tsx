import { useState, useCallback } from "react";
import { Loader2, Sparkles, FileText } from "lucide-react";
import TextPanel from "@/components/TextPanel";
import AnalysisCard from "@/components/AnalysisCard";
import ChangeLogTable from "@/components/ChangeLogTable";
import { enhanceText, type EnhancementResult } from "@/lib/apiEnhancer";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEnhance = useCallback(async () => {
    if (!inputText.trim() || loading) return;
    setLoading(true);
    try {
      const res = await enhanceText(inputText);
      setResult(res);
    } finally {
      setLoading(false);
    }
  }, [inputText, loading]);

  const renderHighlightedText = () => {
    if (!result) return null;
    let text = result.enhancedText;
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    for (const change of result.changeLog) {
      const idx = remaining.toLowerCase().indexOf(change.enhanced.toLowerCase());
      if (idx >= 0) {
        if (idx > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
        }
        parts.push(
          <mark key={key++} className="bg-success-light text-foreground rounded px-0.5 py-0.5">
            {remaining.slice(idx, idx + change.enhanced.length)}
          </mark>
        );
        remaining = remaining.slice(idx + change.enhanced.length);
      }
    }
    if (remaining) parts.push(<span key={key++}>{remaining}</span>);
    return parts.length > 0 ? <>{parts}</> : text;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-primary/3 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[110px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary shadow-sm shadow-primary/20">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight leading-none">
                Meaning Mint
              </h1>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                AI Text Enhancer
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <nav className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary rounded-md transition-colors">Workspace</button>
              <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">History</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12 relative">
        {/* Hero Section */}
        <section className="text-center space-y-4 mb-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Refine your writing, <span className="text-primary">preserve your voice.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Professional grammar correction and clarity improvements that stay true to your original meaning.
          </p>
        </section>

        {/* Text Panels */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-[20px] blur-sm opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <TextPanel
              title="Input Draft"
              value={inputText}
              onChange={setInputText}
              placeholder="Paste or type your text here…"
            />
            <TextPanel
              title="Polished Output"
              value={result?.enhancedText || ""}
              readOnly
              highlightedContent={renderHighlightedText()}
            />
          </div>
        </section>

        {/* Enhance Button */}
        <div className="flex flex-col items-center gap-4 py-4">
          <button
            onClick={handleEnhance}
            disabled={!inputText.trim() || loading}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-bold
              bg-primary text-primary-foreground shadow-lg shadow-primary/25
              hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98]
              transition-all duration-300 ease-out
              disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Enhance Writing</span>
                <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
              </>
            )}
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
          
          {!loading && !result && (
            <p className="text-xs text-muted-foreground animate-pulse">
              Press Cmd+Enter to enhance
            </p>
          )}
        </div>

        {/* Analysis Cards */}
        {result && (
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Analysis Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnalysisCard
                title="Input Analysis"
                items={[
                  { label: "Theme", value: result.inputAnalysis.theme },
                  { label: "Mood", value: result.inputAnalysis.mood },
                  { label: "Grammar Status", value: result.inputAnalysis.grammarStatus },
                  { label: "Error Count", value: result.inputAnalysis.errorCount },
                ]}
                readabilityScore={result.inputAnalysis.readabilityScore}
                mistakes={result.inputAnalysis.mistakes}
              />
              <AnalysisCard
                title="Enhanced Analysis"
                items={[
                  { label: "Theme", value: result.outputAnalysis.theme },
                  { label: "Mood", value: result.outputAnalysis.mood },
                  { label: "Grammar Status", value: result.outputAnalysis.grammarStatus },
                ]}
                correctionsCount={result.outputAnalysis.correctionsApplied}
                similarityScore={result.outputAnalysis.similarityScore}
                meaningPreserved={result.outputAnalysis.meaningPreserved}
              />
            </div>
          </section>
        )}

        {/* Change Log */}
        {result && result.changeLog.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Detailed Changes
            </h2>
            <ChangeLogTable changes={result.changeLog} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Hackathon Project — Meaning-Preserving AI Notes Enhancer
          </p>
          <p className="text-xs text-muted-foreground/50">
            v1.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
