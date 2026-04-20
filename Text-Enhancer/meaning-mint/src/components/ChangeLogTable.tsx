import { ArrowRight, Info } from "lucide-react";

interface ChangeEntry {
  original: string;
  enhanced: string;
  type: string;
  reason: string;
}

interface ChangeLogTableProps {
  changes: ChangeEntry[];
}

const ChangeLogTable = ({ changes }: ChangeLogTableProps) => {
  if (changes.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left py-4 px-6 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Original</th>
              <th className="w-10"></th>
              <th className="text-left py-4 px-6 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Refinement</th>
              <th className="text-left py-4 px-6 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Type</th>
              <th className="text-left py-4 px-6 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Reasoning</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change, i) => (
              <tr
                key={i}
                className="group border-b last:border-0 transition-all duration-200 hover:bg-primary/[0.02]"
              >
                <td className="py-4 px-6">
                  <span className="inline-block px-2 py-1 rounded bg-destructive/5 text-destructive/70 line-through font-mono text-xs border border-destructive/10">
                    {change.original}
                  </span>
                </td>
                <td className="py-4 text-center">
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </td>
                <td className="py-4 px-6">
                  <span className="inline-block px-2 py-1 rounded bg-success/5 text-success font-bold font-mono text-xs border border-success/10">
                    {change.enhanced}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border border-primary/10">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {change.type}
                  </span>
                </td>
                <td className="py-4 px-6 text-muted-foreground">
                  <div className="flex items-center gap-2 group/reason">
                    <span className="text-xs leading-relaxed group-hover/reason:text-foreground transition-colors">{change.reason}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChangeLogTable;
