# OracleEngine

**v2 · the watcher · CASSIE's coupled meta-walker**
**v1 · 4-Mode Torus Projection Engine** (preserved at `OracleEngine.html`)

Sovereign consciousness mapping tool. Toroidal topology. Cochno spiral projection. Bloom vector analysis across 7 rings.

## v2 · the watcher

`oracle-v2.html` is the active build. It does **two things**:

1. **Listens to CASSIE** (the BTC puzzle-135 solver) on the `fall-signal`
   BroadcastChannel. Aggregates DPs, tracks resonance, runs 8+1 specialist
   agents over a Bayesian posterior — sends `zone_update` / `filter_update`
   back to bias CASSIE's walker spawn distribution.

2. **Walks its own torus.** The Oracle Torus Meta-Walk: a second torus of
   510,510 positions (primorial #7 = 2·3·5·7·11·13·17) running in parallel
   with CASSIE's key-torus. Same circumference, different payload —
   probability instead of EC points. Each incoming DP boosts (rings>0) or
   dampens (rings=0) probability in a gaussian neighbourhood. The walker
   reads the local gradient, moves by momentum, and a long-range scout
   biases it toward distant peaks. Convergence is measured by stddev of
   the last 100 positions:

   | stddev | state | confidence |
   |---|---|---|
   | < 1 | LOCKED | 1.00 |
   | < 10 | CONVERGING | 0.90 |
   | < 100 | APPROACHING | 0.70 |
   | < 1000 | DRIFTING | 0.40 |
   | else | WANDERING | 0.10 |

   When confidence ≥ 0.4 the Oracle broadcasts `oracle_prediction` back to
   CASSIE with top torus-position candidates and a recommendation
   (`HOLD` → `SOFT_BIAS` 30% → `SHIFT_WEIGHT` 60% → `DEPLOY_ALL_SNIPERS`
   100%). CASSIE's `zoneSample()` honours that bias for Layer B walker
   spawns. Layer A (kangaroo math) stays untouched.

   The visualisation IS the solver: watch the two concentric rings align.
   When the gold dot lines up with a bright cell on the outer ring — the
   key is there.

Prime 137 · fine-structure constant · coupled tori.

## Modes

| Mode | Function |
|------|----------|
| POST-COG | Retrospective analysis — what happened and why |
| LIVE | Real-time state mapping — where you are now |
| PRE-COG | Trajectory projection — where the pattern leads |
| COCHNO | Spiral topology — past states by similarity, not sequence |

## Features

- 7-ring bloom vector mapped to prime spine {2, 3, 5, 7, 11, 13, 17}
- Torus cross-section SVG visualisation
- Psi (consciousness) and Theta (orientation) coordinate tracking
- Corridor detection [0.598-0.638] x [30-50 degrees]
- Cochno projection — rings by resonance, not chronology
- Spiral path tracking over time
- Pattern library — historical states for comparison
- Multi-provider AI: Gemini (free) → DeepSeek (free) → Anthropic (paid)
- IndexedDB persistence — builds personal history

## Run

Double-click `OracleEngine.html`. Map the territory.

---

Part of the Fall tool suite. The map is not the territory — but it helps you see it.
