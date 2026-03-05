import { ChevronDown, CheckCircle2, AlertTriangle, Info } from "lucide-react";
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

  return (
    <div className="rounded-lg border bg-card shadow-sm p-6 transition-shadow duration-200 hover:shadow-md">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5 pb-3 border-b">
        {title}
      </h3>
      <div className="space-y-3.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              {item.label}
              {item.tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/40 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    {item.tooltip}
                  </TooltipContent>
                </Tooltip>
              )}
            </span>
            <span className="font-medium text-foreground text-right max-w-[55%] truncate">{item.value}</span>
          </div>
        ))}

        {correctionsCount !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Corrections Applied</span>
            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {correctionsCount}
            </span>
          </div>
        )}

        {readabilityScore !== undefined && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Readability Score</span>
              <span className="font-semibold text-foreground tabular-nums">{readabilityScore}/100</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
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
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-muted-foreground flex items-center gap-1.5">
                Semantic Similarity
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/40 cursor-help" />
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
