export interface EnhancementResult {
  enhancedText: string;
  highlights: { word: string; replacement: string; index: number }[];
  inputAnalysis: {
    theme: string;
    mood: string;
    grammarStatus: string;
    errorCount: number;
    readabilityScore: number;
    mistakes: string[];
  };
  outputAnalysis: {
    theme: string;
    mood: string;
    grammarStatus: string;
    correctionsApplied: number;
    similarityScore: number;
    meaningPreserved: boolean;
  };
  changeLog: {
    original: string;
    enhanced: string;
    type: string;
    reason: string;
  }[];
}

function detectTheme(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("research") || lower.includes("study") || lower.includes("hypothesis")) return "Academic / Research";
  if (lower.includes("business") || lower.includes("market") || lower.includes("revenue")) return "Business / Professional";
  if (lower.includes("learn") || lower.includes("student") || lower.includes("education")) return "Education";
  if (lower.includes("technology") || lower.includes("software") || lower.includes("code")) return "Technology";
  return "General";
}

function detectMood(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("unfortunately") || lower.includes("problem") || lower.includes("issue")) return "Analytical / Concerned";
  if (lower.includes("great") || lower.includes("excellent") || lower.includes("amazing")) return "Positive / Enthusiastic";
  if (lower.includes("must") || lower.includes("should") || lower.includes("important")) return "Assertive / Directive";
  return "Neutral / Informative";
}

export async function enhanceText(text: string): Promise<EnhancementResult> {
  const API_BASE =
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
    "https://meaningpreservingtextenhancer.onrender.com";
  const resp = await fetch(`${API_BASE}/enhance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Backend error: ${errText || resp.statusText}`);
  }
  const data: {
    revised_text: string;
    similarity_score: number;
    changes_log: { original: string; enhanced: string; type: string; reason: string }[];
  } = await resp.json();

  const errorCount = data.changes_log.length;
  const readability = Math.min(100, Math.max(40, 85 - errorCount * 5));
  const mistakes = data.changes_log.map(
    (c) => `"${c.original}" → "${c.enhanced}" (${c.reason})`
  );

  return {
    enhancedText: data.revised_text,
    highlights: [],
    inputAnalysis: {
      theme: detectTheme(text),
      mood: detectMood(text),
      grammarStatus: errorCount === 0 ? "Clean" : `${errorCount} issue${errorCount > 1 ? "s" : ""} found`,
      errorCount,
      readabilityScore: readability,
      mistakes,
    },
    outputAnalysis: {
      theme: detectTheme(data.revised_text),
      mood: detectMood(data.revised_text),
      grammarStatus: "Clean",
      correctionsApplied: errorCount,
      similarityScore: Number(data.similarity_score.toFixed(2)),
      meaningPreserved: data.similarity_score >= 80,
    },
    changeLog: data.changes_log,
  };
}
