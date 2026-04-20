import { Copy, Check, PenLine, BookOpen } from "lucide-react";
import { useState } from "react";

interface TextPanelProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  maxLength?: number;
  highlightedContent?: React.ReactNode;
}

const TextPanel = ({
  title,
  value,
  onChange,
  readOnly = false,
  placeholder,
  maxLength = 5000,
  highlightedContent,
}: TextPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Icon = readOnly ? BookOpen : PenLine;

  return (
    <div className="flex flex-col h-full group/panel">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${readOnly ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'} transition-colors duration-300`}>
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
            {title}
          </h2>
        </div>
        {readOnly && value && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 px-3 py-1.5 rounded-full border border-transparent hover:border-primary/10"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      <div className={`relative flex-1 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-500 
        ${readOnly ? 'border-primary/5 hover:border-primary/20' : 'border-border hover:border-primary/30 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5'} 
        hover:shadow-xl hover:shadow-primary/5`}>
        {readOnly ? (
          <div className="p-6 h-72 overflow-y-auto text-base leading-relaxed whitespace-pre-wrap font-serif">
            {highlightedContent !== undefined && highlightedContent !== null
              ? highlightedContent
              : value
              ? value
              : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 space-y-2">
                  <BookOpen className="w-8 h-8 opacity-20" />
                  <span className="text-sm italic">
                    Enhanced text will appear here…
                  </span>
                </div>
              )
            }
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full h-72 p-6 text-base leading-relaxed bg-transparent resize-none outline-none placeholder:text-muted-foreground/30 font-serif transition-all duration-300"
          />
        )}
        
        {!readOnly && (
          <div className="absolute bottom-4 right-4 px-2 py-1 rounded-md bg-background/50 backdrop-blur-md border border-border/50">
            <span className="text-[10px] font-bold text-muted-foreground/60 tabular-nums uppercase tracking-tighter">
              {value.length.toLocaleString()} / {maxLength.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextPanel;
