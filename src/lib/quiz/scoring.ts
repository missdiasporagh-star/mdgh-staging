import { ALL_REGIONS, type QuestionOption, type Region, type Weights } from './types';

/** Add an option's weights into the running per-region accumulator. Returns a new object. */
export function applyAnswer(weights: Weights, option: QuestionOption): Weights {
  const next = { ...weights };
  for (const w of option.weights) {
    next[w.region] = (next[w.region] ?? 0) + w.weight;
  }
  return next;
}

/**
 * Pick the winning region. Sort by weight descending; on tie, the region whose
 * strongest answer arrived earliest wins. `answerOrder` is the list of regions
 * that each answer's strongest option pointed to (one per question).
 */
export function pickWinner(weights: Weights, answerOrder: Region[]): Region {
  const sorted = [...ALL_REGIONS].sort((a, b) => {
    if (weights[b] !== weights[a]) return weights[b] - weights[a];
    const aIdx = answerOrder.indexOf(a);
    const bIdx = answerOrder.indexOf(b);
    if (aIdx === -1 && bIdx === -1) return 0;
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });
  return sorted[0];
}

/** Return the strongest region for an option (highest weight). Used for answerOrder tracking. */
export function strongestRegion(option: QuestionOption): Region {
  if (option.weights.length === 0) return 'Greater Accra';
  return [...option.weights].sort((a, b) => b.weight - a.weight)[0].region;
}
