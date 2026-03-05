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

const corrections: Record<string, { replacement: string; type: string; reason: string }> = {
  "teh": { replacement: "the", type: "Spelling", reason: "Common misspelling" },
  "recieve": { replacement: "receive", type: "Spelling", reason: "i before e except after c" },
  "definately": { replacement: "definitely", type: "Spelling", reason: "Common misspelling" },
  "occurence": { replacement: "occurrence", type: "Spelling", reason: "Double r, single c" },
  "seperate": { replacement: "separate", type: "Spelling", reason: "Common misspelling" },
  "accomodate": { replacement: "accommodate", type: "Spelling", reason: "Double c, double m" },
  "neccessary": { replacement: "necessary", type: "Spelling", reason: "One c, double s" },
  "alot": { replacement: "a lot", type: "Grammar", reason: "Two separate words" },
  "their is": { replacement: "there is", type: "Grammar", reason: "Incorrect homophone usage" },
  "your welcome": { replacement: "you're welcome", type: "Grammar", reason: "Contraction needed" },
  "could of": { replacement: "could have", type: "Grammar", reason: "Incorrect verb form" },
  "should of": { replacement: "should have", type: "Grammar", reason: "Incorrect verb form" },
  "its important": { replacement: "it's important", type: "Grammar", reason: "Contraction needed" },
  "effecting": { replacement: "affecting", type: "Word Choice", reason: "Affect vs effect" },
  "irregardless": { replacement: "regardless", type: "Word Choice", reason: "Non-standard word" },
  "utilize": { replacement: "use", type: "Clarity", reason: "Simpler word preferred" },
  "in order to": { replacement: "to", type: "Clarity", reason: "Reduce wordiness" },
  "due to the fact that": { replacement: "because", type: "Clarity", reason: "Reduce wordiness" },
};

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
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

  let enhanced = text;
  const changes: EnhancementResult["changeLog"] = [];
  const highlights: EnhancementResult["highlights"] = [];

  for (const [error, fix] of Object.entries(corrections)) {
    const regex = new RegExp(`\\b${error}\\b`, "gi");
    if (regex.test(enhanced)) {
      enhanced = enhanced.replace(regex, fix.replacement);
      changes.push({
        original: error,
        enhanced: fix.replacement,
        type: fix.type,
        reason: fix.reason,
      });
    }
  }

  const errorCount = changes.length;
  const readability = Math.min(100, Math.max(40, 85 - errorCount * 5 + Math.floor(Math.random() * 10)));
  const similarity = errorCount === 0 ? 100 : Math.max(78, 98 - errorCount * 2);

  return {
    enhancedText: enhanced,
    highlights,
    inputAnalysis: {
      theme: detectTheme(text),
      mood: detectMood(text),
      grammarStatus: errorCount === 0 ? "Clean" : `${errorCount} issue${errorCount > 1 ? "s" : ""} found`,
      errorCount,
      readabilityScore: readability,
      mistakes: changes.map((c) => `"${c.original}" → "${c.enhanced}" (${c.reason})`),
    },
    outputAnalysis: {
      theme: detectTheme(enhanced),
      mood: detectMood(enhanced),
      grammarStatus: "Clean",
      correctionsApplied: errorCount,
      similarityScore: similarity,
      meaningPreserved: similarity >= 80,
    },
    changeLog: changes,
  };
}
