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
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="max-h-72 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left py-3 px-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Original</th>
              <th className="text-left py-3 px-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Enhanced</th>
              <th className="text-left py-3 px-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Type</th>
              <th className="text-left py-3 px-5 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Reason</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change, i) => (
              <tr
                key={i}
                className={`border-b last:border-0 transition-colors duration-150 hover:bg-muted/30 ${
                  i % 2 === 1 ? 'bg-muted/20' : ''
                }`}
              >
                <td className="py-3 px-5 text-destructive/70 line-through font-mono text-xs">{change.original}</td>
                <td className="py-3 px-5 text-success font-medium font-mono text-xs">{change.enhanced}</td>
                <td className="py-3 px-5">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/8 text-primary border border-primary/10">
                    {change.type}
                  </span>
                </td>
                <td className="py-3 px-5 text-muted-foreground">{change.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChangeLogTable;
