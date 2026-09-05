# GitNexus PR Review Benchmarks

Official GitNexus benchmark website, built with React, TypeScript, and Vite.

## Current result

GitNexus v35 places **#2 by displayed F1** among the 23 reviewers in this comparison.

| F1 | Precision | Recall | TP | FP | FN |
| --- | --- | --- | --- | --- | --- |
| 0.577 | 0.540 | 0.618 | 107 | 91 | 66 |

The scores are calculated from the judged v35 candidates after restoring noise-budget and collapse drops and applying the drop rule (verifier score ≤ 3 and the low-precision title strata):

- Precision = 107 / (107 + 91)
- Recall = 107 / (107 + 66)
- F1 = 2 × 107 / (2 × 107 + 91 + 66)
- Findings per PR = (107 + 91) / 50 = 3.96

The calculations retain full precision; the website displays three decimal places. Rank orders the displayed F1 scores. These candidate-set calculations do not constitute a new judging of the composed artefact. The previous repeated-judging experiment remains separately labeled on the site with its original scores and standard errors.

Benchmark data is in `src/data.ts`; the page is in `src/App.tsx`.

## Development

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
```

The production website is generated in `dist/`.

## Vercel

Import this repository with the project root set to the repository root (`.`). The framework is **Vite**, the build command is `npm run build`, and the output directory is `dist`. These build settings are also recorded in `vercel.json`.

Website: https://www.gitnexus-benchmark.dev/
