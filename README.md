# GitNexus PR Review Benchmarks

Code review benchmark report comparing GitNexus with 22 other tools on 50 pull requests and 173 human reference findings.

## Current result

GitNexus ranks **second by reported F1** among the 23 reviewers in this comparison.

| F1 | Precision | Recall | TP | FP | FN |
| --- | --- | --- | --- | --- | --- |
| 0.577 | 0.540 | 0.618 | 107 | 91 | 66 |

Scores are calculated from aggregate counts using existing finding-level judgments:

- Precision = 107 / (107 + 91)
- Recall = 107 / (107 + 66)
- F1 = 2 × 107 / (2 × 107 + 91 + 66)
- Findings per PR = (107 + 91) / 50 = 3.96

Calculations retain full precision; results are displayed to three decimal places. The complete review output has not undergone a separate evaluation for this result. Standard errors are not reported for the current result. Differences in rank do not establish statistical significance.

Benchmark data is in `src/data.ts`; all result tables, charts, and headline metrics use this dataset. The page is in `src/App.tsx`.

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
