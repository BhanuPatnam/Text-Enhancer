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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0 mt-0.5">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Meaning-Preserving AI Notes Enhancer
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              Improve grammar, clarity, and readability while preserving your original meaning — built for researchers and students.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Text Panels */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextPanel
              title="Original Text"
              value={inputText}
              onChange={setInputText}
              placeholder="Paste or type your text here…"
            />
            <TextPanel
              title="Enhanced Text"
              value={result?.enhancedText || ""}
              readOnly
              highlightedContent={renderHighlightedText()}
            />
          </div>
        </section>

        {/* Enhance Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleEnhance}
            disabled={!inputText.trim() || loading}
            className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-lg text-sm font-semibold
              bg-primary text-primary-foreground shadow-sm
              hover:shadow-md hover:brightness-110 active:scale-[0.98]
              transition-all duration-200 ease-out
              disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:brightness-100"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            )}
            {loading ? "Analyzing…" : "Enhance & Validate Meaning"}
          </button>
          {!result && !loading && (
            <p className="text-xs text-muted-foreground/70">
              Try: "Teh research definately shows that irregardless of teh results, its important."
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
