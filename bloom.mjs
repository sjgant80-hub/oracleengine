// ◊·κ BLOOM DECOMPOSITION · ported from teslasolar/MissCassandra/js/bloom.js
// MIT · Thomas Frumkin · cross-pollinated 2026-05-27 with attribution
//
// Maps any text → 7-ring vector aligned to the v18/v19 spine primes:
//   R0=2 (ground · hardware)      R1=3 (sensor · perception)
//   R2=5 (gate · filter)          R3=7 (affect · feel)
//   R4=11 (executive · plan)      R5=13 (identity · who)
//   R6=17 (observer · meta · why)
//
// Returns: { bloom: int[7], product: bigint, normalized: float[7] }
// product = Π prime_i^count_i (the bloom signature in seed notation P(Q))

const PRIMES   = [2n, 3n, 5n, 7n, 11n, 13n, 17n];
const RING_KEYS = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'];

// Ring word banks · expanded slightly from Thomas's originals to cover
// sovereign-AI / solver / mesh vocabulary too
export const RING_WORDS = {
  R0: ['help','fix','broken','down','deploy','server','build','run',
       'start','stop','crash','restart','install','hardware','resource',
       'gpu','cpu','torus','walker','kangaroo','solver','signal'],
  R1: ['find','search','look','check','monitor','scan','watch','detect',
       'alert','log','track','measure','notice','see','hear',
       'observe','sense','pulse','probe','listen','heartbeat'],
  R2: ['filter','block','allow','route','gate','triage','review',
       'approve','reject','sort','prioritize','threshold','permission',
       'consent','accept','validate','verify','consensus','vote'],
  R3: ['feel','want','need','wish','hope','worry','love','hate',
       'urgent','important','care','afraid','excited','angry','sad',
       'heart','warmth','tone','resonance','consonance','dissonance'],
  R4: ['plan','schedule','create','design','architect','organize',
       'manage','build','draft','compose','write','structure','assign',
       'orchestrate','dispatch','execute','swarm','deploy','workflow'],
  R5: ['who','identity','role','config','team','culture','policy',
       'value','name','profile','purpose','mission','represent',
       'bloom','signature','tag','handle','self','kappa'],
  R6: ['why','meta','review','reflect','pattern','observe','meaning',
       'understand','analyze','root cause','systemic','philosophical',
       'oracle','watcher','witness','field','katapayadi','recursion']
};

/**
 * Decompose text into a bloom vector.
 * @param {string} text
 * @returns {{ bloom: number[], product: bigint, normalized: number[], dominantRing: number, dominantLabel: string }}
 */
export function decompose(text) {
  if (!text || typeof text !== 'string') {
    return { bloom: new Array(7).fill(0), product: 1n, normalized: new Array(7).fill(0), dominantRing: -1, dominantLabel: 'silence' };
  }
  const lower = text.toLowerCase();
  const tokens = lower.split(/\s+/).filter(Boolean);
  const counts = new Array(7).fill(0);

  for (let r = 0; r < 7; r++) {
    const words = RING_WORDS[RING_KEYS[r]];
    for (const entry of words) {
      if (entry.includes(' ')) {
        if (lower.includes(entry)) counts[r]++;
      } else {
        for (const tok of tokens) {
          if (tok === entry) counts[r]++;
        }
      }
    }
  }

  // Prime product P(Q) = Π prime_i^count_i
  let product = 1n;
  for (let r = 0; r < 7; r++) {
    for (let i = 0; i < counts[r]; i++) product *= PRIMES[r];
  }

  // Normalize so max = 1.0
  const max = Math.max(...counts);
  const normalized = max === 0
    ? new Array(7).fill(0)
    : counts.map(c => c / max);

  // Dominant ring
  let maxIdx = 0;
  for (let i = 1; i < 7; i++) if (counts[i] > counts[maxIdx]) maxIdx = i;
  const labels = ['ground','sensor','gate','affect','executive','identity','observer'];
  const dominantLabel = counts[maxIdx] === 0 ? 'silence' : labels[maxIdx];

  return { bloom: counts, product, normalized, dominantRing: counts[maxIdx] === 0 ? -1 : maxIdx, dominantLabel };
}

/** Returns true if no single ring exceeds 0.6 of total weight. */
export function isBalanced(bloom) {
  const total = bloom.reduce((s, v) => s + v, 0);
  if (total === 0) return true;
  return bloom.every(v => v / total <= 0.6);
}

/** Returns true if any single ring exceeds 0.7 of total weight. */
export function isSpiked(bloom) {
  const total = bloom.reduce((s, v) => s + v, 0);
  if (total === 0) return false;
  return bloom.some(v => v / total > 0.7);
}

/** Index of the highest ring value (or -1 if all zero). */
export function dominantRing(bloom) {
  let maxIdx = 0;
  for (let i = 1; i < bloom.length; i++) if (bloom[i] > bloom[maxIdx]) maxIdx = i;
  return bloom[maxIdx] === 0 ? -1 : maxIdx;
}

const SEARCH_PATTERN = /search|find|look up|what is|who is|latest|news|current/i;

/** R1 (sensor) > 0.3 AND text matches search keywords. */
export function needsSearch(bloom, text) {
  const total = bloom.reduce((s, v) => s + v, 0);
  const norm = total > 0 ? bloom[1] / Math.max(...bloom) : 0;
  return norm > 0.3 && SEARCH_PATTERN.test(text);
}

// ◊·κ Konomi notation · bloom signature as a single string
// shape: "R0:c0|R1:c1|...|R6:c6 · Π=product"
export function signature(text) {
  const r = decompose(text);
  const parts = r.bloom.map((c, i) => `R${i}:${c}`);
  return parts.join('|') + ' · Π=' + r.product.toString();
}
