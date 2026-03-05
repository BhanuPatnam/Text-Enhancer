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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-muted-foreground/60" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </h2>
        </div>
        {readOnly && value && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 px-2.5 py-1 rounded-md hover:bg-secondary border border-transparent hover:border-border"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <div className="relative flex-1 rounded-lg border bg-card shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md">
        {readOnly ? (
          <div className="p-5 h-64 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap">
            {highlightedContent !== undefined && highlightedContent !== null
              ? highlightedContent
              : value
              ? value
              : (
                <span className="text-muted-foreground/50 italic">
                  Enhanced text will appear here…
                </span>
              )
            }
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full h-64 p-5 text-sm leading-relaxed bg-transparent resize-none outline-none placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/15 rounded-lg transition-shadow duration-200"
          />
        )}
      </div>
      {!readOnly && (
        <div className="flex justify-end mt-2">
          <span className="text-[11px] text-muted-foreground/50 tabular-nums font-medium">
            {value.length.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextPanel;
