export interface SentenceAnalysis {
  text: string;
  isHuman: boolean;
  confidence: number;
}

export interface ForensicResult {
  perplexityIndex: number;
  burstinessRating: number;
  repetitionIndex: number;
  humanIntegrityScore: number;
  sentences: SentenceAnalysis[];
}

const AI_BIGRAMS = [
  "it is important",
  "in order to",
  "as well as",
  "in conclusion",
  "furthermore",
  "additionally",
  "this ensures",
  "delve into",
  "it is essential",
  "it is crucial",
  "in today",
  "it is worth noting",
  "plays a pivotal",
  "it is noteworthy",
  "in the modern",
  "in the rapidly",
  "holistic approach",
  "leverage",
  "moreover",
  "stakeholder",
];

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

function wordCount(sentence: string): number {
  return sentence.split(/\s+/).filter(Boolean).length;
}

function computePerplexityIndex(text: string): number {
  const lower = text.toLowerCase();
  let matches = 0;
  for (const bigram of AI_BIGRAMS) {
    if (lower.includes(bigram)) {
      matches++;
    }
  }
  const sentences = splitSentences(text);
  const totalWords = text.split(/\s+/).length;

  const wordDiversity =
    new Set(text.toLowerCase().split(/\s+/)).size / Math.max(totalWords, 1);

  const bigramScore = Math.min(matches / 6, 1);
  const diversityScore = 1 - Math.min(wordDiversity * 1.5, 1);

  const raw = bigramScore * 0.65 + diversityScore * 0.35;
  return Math.round(Math.min(raw * 100, 100));
}

function computeBurstinessRating(sentences: string[]): number {
  if (sentences.length < 2) return 50;

  const lengths = sentences.map(wordCount);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((sum, l) => sum + Math.pow(l - mean, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  const cv = stdDev / Math.max(mean, 1);
  const score = Math.min(cv * 120, 100);
  return Math.round(score);
}

function computeRepetitionIndex(text: string): number {
  const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const trigrams: string[] = [];

  for (let i = 0; i < words.length - 2; i++) {
    trigrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }

  const counts = new Map<string, number>();
  for (const tg of trigrams) {
    counts.set(tg, (counts.get(tg) ?? 0) + 1);
  }

  const repeated = [...counts.values()].filter((c) => c > 1).length;
  const raw = repeated / Math.max(trigrams.length, 1);
  return Math.round(Math.min(raw * 400, 100));
}

function analyzeSentences(
  sentences: string[],
  meanLength: number
): SentenceAnalysis[] {
  return sentences.map((text) => {
    const len = wordCount(text);
    const deviation = Math.abs(len - meanLength) / Math.max(meanLength, 1);
    const hasUnusualWords = text.split(/\s+/).some((w) => w.length > 10);
    const lower = text.toLowerCase();
    const hasAiBigrams = AI_BIGRAMS.some((b) => lower.includes(b));

    const isHuman = deviation > 0.15 || hasUnusualWords || (!hasAiBigrams && len < 10);
    const confidence = Math.min(deviation + (hasUnusualWords ? 0.3 : 0) + (hasAiBigrams ? -0.3 : 0.1), 1);

    return {
      text,
      isHuman,
      confidence: Math.max(0, Math.min(confidence, 1)),
    };
  });
}

export function analyzeText(text: string): ForensicResult {
  const sentences = splitSentences(text);
  const lengths = sentences.map(wordCount);
  const meanLength = lengths.length
    ? lengths.reduce((a, b) => a + b, 0) / lengths.length
    : 0;

  const perplexityIndex = computePerplexityIndex(text);
  const burstinessRating = computeBurstinessRating(sentences);
  const repetitionIndex = computeRepetitionIndex(text);

  const humanIntegrityScore = Math.round(
    Math.min(
      Math.max(
        burstinessRating * 0.4 +
          (100 - perplexityIndex) * 0.35 +
          (100 - repetitionIndex) * 0.25,
        0
      ),
      100
    )
  );

  const analyzedSentences = analyzeSentences(sentences, meanLength);

  return {
    perplexityIndex,
    burstinessRating,
    repetitionIndex,
    humanIntegrityScore,
    sentences: analyzedSentences,
  };
}
