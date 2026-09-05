/**
 * What the reviewer is looking at when it reviews.
 *
 * The diagram is the argument for the numbers on this page: a diff shows the
 * lines that changed, and a code graph shows what those lines are connected to.
 * Node positions are fixed rather than force-simulated — a layout that settles
 * differently on every load is decorative, and this one has to be read.
 */

type N = { id: string; x: number; y: number; label: string; ring: 0 | 1 | 2 | 3 };

const NODES: N[] = [
  { id: 'chg', x: 300, y: 168, label: 'changed symbol', ring: 0 },

  { id: 'a', x: 168, y: 96, label: 'caller', ring: 1 },
  { id: 'b', x: 158, y: 232, label: 'caller', ring: 1 },
  { id: 'c', x: 438, y: 108, label: 'consumer', ring: 1 },
  { id: 'd', x: 446, y: 236, label: 'route handler', ring: 1 },

  { id: 'e', x: 62, y: 42, label: '', ring: 2 },
  { id: 'f', x: 48, y: 158, label: '', ring: 2 },
  { id: 'g', x: 74, y: 290, label: '', ring: 2 },
  { id: 'h', x: 556, y: 48, label: '', ring: 2 },
  { id: 'i', x: 574, y: 170, label: '', ring: 2 },
  { id: 'j', x: 548, y: 296, label: '', ring: 2 },
  { id: 'k', x: 300, y: 306, label: '', ring: 2 },
  { id: 'l', x: 300, y: 40, label: '', ring: 2 },

  { id: 'm', x: 132, y: 342, label: '', ring: 3 },
  { id: 'n', x: 470, y: 344, label: '', ring: 3 },
  { id: 'o', x: 616, y: 106, label: '', ring: 3 },
  { id: 'p', x: 20, y: 236, label: '', ring: 3 },
];

const EDGES: [string, string][] = [
  ['a', 'chg'], ['b', 'chg'], ['chg', 'c'], ['chg', 'd'],
  ['e', 'a'], ['f', 'a'], ['f', 'b'], ['g', 'b'],
  ['c', 'h'], ['c', 'i'], ['d', 'i'], ['d', 'j'],
  ['k', 'b'], ['l', 'a'], ['l', 'c'],
  ['m', 'g'], ['n', 'j'], ['o', 'h'], ['p', 'f'],
];

const at = (id: string) => NODES.find((n) => n.id === id)!;

const RING_STYLE: Record<number, { fill: string; op: number; r: number }> = {
  0: { fill: 'var(--accent)', op: 1, r: 13 },
  1: { fill: 'var(--accent)', op: 0.72, r: 9 },
  2: { fill: 'var(--context)', op: 0.5, r: 6 },
  3: { fill: 'var(--context)', op: 0.3, r: 5 },
};

export function KnowledgeGraph() {
  return (
    <figure className="fig fig-graph">
      <figcaption className="fig-cap">
        A pull request, seen as a graph rather than as a diff
      </figcaption>
      <div className="fig-body">
        <svg viewBox="0 0 640 390" width="100%" role="img"
             aria-label="A code graph. One changed symbol at the centre, four direct dependents around it, and further symbols at two and three hops out.">
          {/* blast-radius bands, drawn first so every mark sits above them */}
          <circle cx={300} cy={168} r={150} fill="var(--accent)" opacity={0.05} />
          <circle cx={300} cy={168} r={92} fill="var(--accent)" opacity={0.06} />

          {EDGES.map(([s, t]) => {
            const a = at(s);
            const b = at(t);
            const hot = a.ring <= 1 && b.ring <= 1;
            return (
              <line key={`${s}-${t}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={hot ? 'var(--accent)' : 'var(--context)'}
                    strokeWidth={hot ? 2 : 1}
                    opacity={hot ? 0.5 : 0.28} />
            );
          })}

          {NODES.map((n) => {
            const s = RING_STYLE[n.ring];
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={s.r} fill={s.fill} opacity={s.op}
                        stroke="var(--surface-1)" strokeWidth={2} />
                {n.label && (
                  <text x={n.x} y={n.y - s.r - 9} textAnchor="middle"
                        className={n.ring === 0 ? 'g-lbl g-lbl-main' : 'g-lbl'}>
                    {n.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="legend" aria-hidden="true">
        <span><i className="dot dot-0" />changed by the PR</span>
        <span><i className="dot dot-1" />directly depends on it</span>
        <span><i className="dot dot-2" />reachable further out</span>
      </div>
      <p className="fig-note">
        gitnexus-check indexes the repository into a graph of symbols and the
        relationships between them, then reviews a pull request against it. The
        diff says which lines moved; the graph says what those lines are wired
        to — which callers, which consumers, which routes.
      </p>
    </figure>
  );
}
