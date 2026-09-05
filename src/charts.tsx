import { useState, type ReactNode } from 'react';

export type Row = {
  tool: string;
  rank: number;
  f1: number;
  p: number;
  r: number;
  tp: number;
  fp: number;
  fn: number;
  perPR: number;
  ours: boolean;
};

/* ------------------------------------------------------------------ tooltip */

type Tip = { x: number; y: number; node: ReactNode } | null;

function useTip() {
  const [tip, setTip] = useState<Tip>(null);
  const el = tip ? (
    <div
      className="tip"
      style={{ left: tip.x, top: tip.y }}
      role="status"
      aria-live="polite"
    >
      {tip.node}
    </div>
  ) : null;
  return { tip, setTip, el };
}

function TipBody({ row, lines }: { row: Row; lines: [string, string][] }) {
  return (
    <>
      <div className="tip-title">{row.tool}</div>
      {lines.map(([k, v]) => (
        <div className="tip-row" key={k}>
          <span>{k}</span>
          <b>{v}</b>
        </div>
      ))}
    </>
  );
}

/* --------------------------------------------------------------- bar figure */

/**
 * Horizontal bars, one row per tool, sorted by the measure being shown.
 *
 * Horizontal rather than vertical because the category labels are tool names —
 * eleven of them, several long enough that vertical bars would force rotated
 * text, which is the single most common way a comparison chart becomes
 * unreadable.
 */
export function BarChart({
  rows,
  metric,
  label,
  compact = false,
}: {
  rows: Row[];
  metric: 'f1' | 'p' | 'r' | 'perPR';
  label: string;
  compact?: boolean;
}) {
  const { setTip, el } = useTip();
  const sorted = [...rows].sort((a, b) => b[metric] - a[metric]);
  const max = Math.max(...sorted.map((d) => d[metric]));
  // A ratio axis ends at 1.0 conceptually, but the field occupies 0.35–0.60 —
  // so the axis is domain-fitted with headroom rather than anchored at 1.0,
  // which would compress every bar into the left third and hide the spread.
  // Ticks land on round numbers (0.1 / 1.0 steps) rather than quarters of a
  // fitted domain, which produces axis labels like 0.163 that nobody reads.
  const step = metric === 'perPR' ? 1 : 0.1;
  const domain = Math.ceil((max * 1.04) / step) * step;
  const ticks: number[] = [];
  for (let t = step; t <= domain + 1e-9; t += step) ticks.push(Number(t.toFixed(4)));

  const rowH = compact ? 28 : 32;
  // Wide enough for the longest name in the field at this type size — a
  // clipped label reads as a different tool.
  const labelW = 158;
  const valueW = 46;
  const H = sorted.length * rowH + 30;

  const fmt = (v: number) => (metric === 'perPR' ? v.toFixed(2) : v.toFixed(3));

  return (
    <figure className="fig">
      <figcaption className="fig-cap">{label}</figcaption>
      <div className="fig-body">
        <svg
          viewBox={`0 0 640 ${H}`}
          width="100%"
          role="img"
          aria-label={`${label}. gitnexus-check value ${fmt(
            sorted.find((d) => d.ours)![metric],
          )}.`}
        >
          {/* recessive gridlines at quarter steps of the fitted domain */}
          {ticks.map((t) => {
            const x = labelW + (t / domain) * (640 - labelW - valueW);
            return (
              <g key={t}>
                <line
                  x1={x}
                  x2={x}
                  y1={4}
                  y2={H - 22}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <text x={x} y={H - 8} className="ax" textAnchor="middle">
                  {metric === 'perPR' ? t.toFixed(0) : t.toFixed(1)}
                </text>
              </g>
            );
          })}

          {sorted.map((d, i) => {
            const y = i * rowH + 4;
            const w = Math.max(2, (d[metric] / domain) * (640 - labelW - valueW));
            const h = compact ? 13 : 16;
            return (
              <g
                key={d.tool}
                onMouseMove={(e) =>
                  setTip({
                    x: e.clientX + 14,
                    y: e.clientY + 14,
                    node: (
                      <TipBody
                        row={d}
                        lines={[
                          ['F1', d.f1.toFixed(3)],
                          ['Precision', d.p.toFixed(3)],
                          ['Recall', d.r.toFixed(3)],
                          ['Findings / PR', d.perPR.toFixed(2)],
                        ]}
                      />
                    ),
                  })
                }
                onMouseLeave={() => setTip(null)}
              >
                <rect
                  x={0}
                  y={y}
                  width={640}
                  height={rowH}
                  fill="transparent"
                />
                <text
                  x={labelW - 10}
                  y={y + h / 2 + 5}
                  textAnchor="end"
                  className={`${compact ? 'lbl lbl-sm' : 'lbl'}${d.ours ? ' lbl-ours' : ''}`}
                >
                  {d.tool}
                </text>
                <rect
                  x={labelW}
                  y={y}
                  width={w}
                  height={h}
                  rx={4}
                  fill={d.ours ? 'var(--accent)' : 'var(--context)'}
                  opacity={d.ours ? 1 : 0.55}
                />
                <text
                  x={labelW + w + 8}
                  y={y + h / 2 + 5}
                  className={d.ours ? 'val val-ours' : 'val'}
                >
                  {fmt(d[metric])}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {el}
    </figure>
  );
}

/* ----------------------------------------------------------------- scatter */

/**
 * Precision against recall — the shape the table cannot show.
 *
 * Every reviewer on this corpus sits somewhere on a trade-off between finding
 * more and being right more often. A scatter puts that trade-off on the page
 * directly, where a ranked list flattens it into a single ordering.
 */
export function Scatter({
  rows,
  xKey,
  yKey,
  xLabel,
  yLabel,
  caption,
}: {
  rows: Row[];
  xKey: 'r' | 'perPR';
  yKey: 'p';
  xLabel: string;
  yLabel: string;
  caption: string;
}) {
  const { setTip, el } = useTip();
  const W = 640;
  const H = 380;
  const m = { t: 16, r: 18, b: 44, l: 54 };

  const xs = rows.map((d) => d[xKey]);
  const ys = rows.map((d) => d[yKey]);
  const pad = (v: number) => v * 0.12;
  const x0 = Math.min(...xs) - pad(Math.min(...xs));
  const x1 = Math.max(...xs) + pad(Math.max(...xs));
  const y0 = Math.min(...ys) - pad(Math.min(...ys));
  const y1 = Math.max(...ys) + pad(Math.max(...ys));

  const px = (v: number) => m.l + ((v - x0) / (x1 - x0)) * (W - m.l - m.r);
  const py = (v: number) => H - m.b - ((v - y0) / (y1 - y0)) * (H - m.t - m.b);

  const ticks = (a: number, b: number) => {
    const step = (b - a) / 4;
    return [0, 1, 2, 3, 4].map((i) => a + step * i);
  };

  return (
    <figure className="fig">
      <figcaption className="fig-cap">{caption}</figcaption>
      <div className="fig-body">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
             aria-label={`${yLabel} against ${xLabel} for ${rows.length} reviewers.`}>
          {ticks(y0, y1).map((t) => (
            <g key={`y${t}`}>
              <line x1={m.l} x2={W - m.r} y1={py(t)} y2={py(t)}
                    stroke="var(--border)" strokeWidth={1} />
              <text x={m.l - 10} y={py(t) + 4} textAnchor="end" className="ax">
                {t.toFixed(2)}
              </text>
            </g>
          ))}
          {ticks(x0, x1).map((t) => (
            <text key={`x${t}`} x={px(t)} y={H - m.b + 20} textAnchor="middle" className="ax">
              {xKey === 'perPR' ? t.toFixed(1) : t.toFixed(2)}
            </text>
          ))}

          <text x={(W - m.l) / 2 + m.l} y={H - 6} textAnchor="middle" className="ax-title">
            {xLabel}
          </text>
          <text x={14} y={H / 2} textAnchor="middle" className="ax-title"
                transform={`rotate(-90 14 ${H / 2})`}>
            {yLabel}
          </text>

          {rows.map((d) => {
            const cx = px(d[xKey]);
            const cy = py(d[yKey]);
            return (
              <g key={d.tool}
                 onMouseMove={(e) =>
                   setTip({
                     x: e.clientX + 14,
                     y: e.clientY + 14,
                     node: (
                       <TipBody row={d} lines={[
                         ['F1', d.f1.toFixed(3)],
                         ['Precision', d.p.toFixed(3)],
                         ['Recall', d.r.toFixed(3)],
                         ['Findings / PR', d.perPR.toFixed(2)],
                       ]} />
                     ),
                   })
                 }
                 onMouseLeave={() => setTip(null)}>
                {/* a 2px surface ring keeps overlapping points separable */}
                <circle cx={cx} cy={cy} r={d.ours ? 9 : 7}
                        fill={d.ours ? 'var(--accent)' : 'var(--context)'}
                        opacity={d.ours ? 1 : 0.62}
                        stroke="var(--surface-1)" strokeWidth={2} />
                {d.ours && (
                  <text x={cx + 15} y={cy + 4} className="pt-lbl pt-ours">
                    gitnexus-check
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {el}
    </figure>
  );
}
