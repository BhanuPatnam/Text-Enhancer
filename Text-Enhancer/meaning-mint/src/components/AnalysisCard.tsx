import { ChevronDown, CheckCircle2, AlertTriangle, Info, Target, Zap, Activity, MessageSquare } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AnalysisItem {
  label: string;
  value: string | number;
  tooltip?: string;
}

interface AnalysisCardProps {
  title: string;
  items: AnalysisItem[];
  readabilityScore?: number;
  similarityScore?: number;
  meaningPreserved?: boolean | null;
  mistakes?: string[];
  correctionsCount?: number;
}

const AnalysisCard = ({
  title,
  items,
  readabilityScore,
  similarityScore,
  meaningPreserved,
  mistakes,
  correctionsCount,
}: AnalysisCardProps) => {
  const [mistakesOpen, setMistakesOpen] = useState(false);

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('theme')) return <Target className="w-3.5 h-3.5" />;
    if (l.includes('mood')) return <Activity className="w-3.5 h-3.5" />;
    if (l.includes('grammar')) return <Zap className="w-3.5 h-3.5" />;
    return <MessageSquare className="w-3.5 h-3.5" />;
  };

  return (
    <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-primary rounded-full" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
          {title}
        </h3>
      </div>
      
      <div className="space-y-5">
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between group/item">
              <span className="text-sm text-muted-foreground flex items-center gap-2.5 transition-colors group-hover/item:text-foreground">
                <span className="p-1 rounded-md bg-muted transition-colors group-hover/item:bg-primary/10 group-hover/item:text-primary">
                  {getIcon(item.label)}
                </span>
                {item.label}
                {item.tooltip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-muted-foreground/30 cursor-help hover:text-primary transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">
                      {item.tooltip}
                    </TooltipContent>
                  </Tooltip>
                )}
              </span>
              <span className="text-sm font-semibold text-foreground text-right max-w-[55%] truncate bg-muted/30 px-2.5 py-1 rounded-lg">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {correctionsCount !== undefined && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
            <span className="text-sm font-medium text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Improvements Applied
            </span>
            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20">
              {correctionsCount}
            </span>
          </div>
        )}

        {readabilityScore !== undefined && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-muted-foreground font-medium">Readability Score</span>
              <span className="font-bold text-foreground tabular-nums bg-muted/50 px-2 py-0.5 rounded text-xs">{readabilityScore}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-secondary overflow-hidden p-0.5 border border-border/50">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{
                  width: `${readabilityScore}%`,
                  backgroundColor: readabilityScore >= 70
                    ? 'hsl(var(--success))'
                    : readabilityScore >= 50
                    ? 'hsl(var(--warning))'
                    : 'hsl(var(--destructive))',
                }}
              />
            </div>
          </div>
        )}

        {similarityScore !== undefined && (
          <div className="pt-2 border-t border-dashed border-border/50">
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-muted-foreground font-medium flex items-center gap-2">
                Semantic Fidelity
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/30 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    Measures how closely the enhanced text preserves the original meaning. Above 85% is considered excellent.
                  </TooltipContent>
                </Tooltip>
              </span>
            </div>
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <path
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={similarityScore >= 85 ? "hsl(var(--success))" : similarityScore >= 70 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${similarityScore}, 100`}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums">
                  {similarityScore}%
                </span>
              </div>
              {meaningPreserved !== null && meaningPreserved !== undefined && (
                <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg ${
                  meaningPreserved
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {meaningPreserved ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  {meaningPreserved ? "Meaning Preserved" : "Meaning May Differ"}
                </div>
              )}
            </div>
          </div>
        )}

        {mistakes && mistakes.length > 0 && (
          <div className="pt-3 border-t">
            <button
              onClick={() => setMistakesOpen(!mistakesOpen)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 w-full"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${mistakesOpen ? 'rotate-180' : ''}`}
              />
              <span>{mistakes.length} mistake{mistakes.length !== 1 ? 's' : ''} found</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                mistakesOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="space-y-1.5 pl-6">
                {mistakes.map((m, i) => (
                  <li key={i} className="text-sm text-muted-foreground list-disc leading-relaxed">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisCard;
