import { BarChart, Scatter, type Row } from './charts';
import { DATA } from './data';
import './styles.css';

const rows = DATA.rows as unknown as Row[];
const us = rows.find((r) => r.ours)!;
const M = DATA.meta;

function Stat({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div className="stat">
      <div className="stat-k">{k}</div>
      <div className="stat-v">{v}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="brand">
          {/* The white chip is the brand mark's own light ground — it is
              theme-invariant on the product site, and matching that here keeps
              one logo treatment across both surfaces. */}
          <span className="brand-mark">
            <img src="/images/akon-logo.webp" alt="" width={32} height={32} />
          </span>
          <span className="eyebrow">Benchmarks</span>
        </div>
        <h1>GitNexus PR Review Benchmarks</h1>
        <p className="lede">
          Our pull-request review bot measured against {M.tools} other tools on the
          Martian Code Review Benchmark — same {M.prs} pull requests, same {M.goldens}
          human-written ground-truth findings, same judge. Our official v35 result is{' '}
          #{us.rank} by F1 in this comparison: {us.f1.toFixed(3)} F1,{' '}
          {us.p.toFixed(3)} precision, and {us.r.toFixed(3)} recall.
          These scores are calculated from the judged v35 candidates after restoring
          noise-budget and collapse drops and applying the drop rule
          (verifier score ≤ 3 and the low-precision title strata).
        </p>
        <p className="meta mono">
          reviewer {M.reviewer} · judge {M.judge} · temperature {M.temp} · seed{' '}
          {M.seed}
        </p>
      </header>

      <section className="stats" aria-label="Headline results">
        <Stat k="Rank" v={`${us.rank} of ${M.tools + 1}`} sub={`${M.profile} profile, ${M.fbeta}`} />
        <Stat k="F1" v={us.f1.toFixed(3)} sub="v35 judged candidates · drop rule applied" />
        <Stat k="Precision" v={us.p.toFixed(3)} sub={`${M.precisionRank}th in the field`} />
        <Stat k="Recall" v={us.r.toFixed(3)} sub={`${us.tp} of ${us.tp + us.fn} findings matched`} />
      </section>

      <section>
        <h2>Where we place</h2>
        <p className="body">
          F1 balances finding real problems against not inventing them. All{' '}
          {M.tools + 1} reviewers are shown. The benchmark scores
          three category profiles and any F-beta, and a tool's place moves between
          them — so the profile and beta are named here rather than left implicit.
        </p>
        <BarChart rows={rows} metric="f1" label={`F1 — ${M.tools + 1} reviewers`} />
      </section>

      <section>
        <h2>Previous benchmark: five tools judged on one instrument</h2>
        <p className="body">
          The published leaderboard scores each tool from a single judging. The rows below
          are every tool's posted comments judged {M.n} times under the same chain
          (judge {M.judge}, temperature {M.temp}, seed {M.seed}, with the benchmark's
          dedup step), reported as mean ± standard error. Every re-judged tool sits below
          its published single judging. This earlier experiment is retained for
          comparison; its GitNexus row predates the v35 headline result.
        </p>
        <div className="table-wrap">
          <table className="full">
            <thead>
              <tr>
                <th>#</th><th>Reviewer</th><th className="num">F1 ± sem</th><th className="num">Precision</th>
                <th className="num">Recall</th><th className="num">TP</th><th className="num">FP</th><th className="num">published</th>
              </tr>
            </thead>
            <tbody>
              {DATA.likeForLike.map((d, i) => (
                <tr key={d.tool} className={d.ours ? 'ours' : undefined}>
                  <td className="num">{i + 1}</td>
                  <td>{d.tool}</td>
                  <td className="num mono">{d.f1.toFixed(4)} ± {d.sem.toFixed(4)}</td>
                  <td className="num">{d.p.toFixed(4)}</td>
                  <td className="num">{d.r.toFixed(4)}</td>
                  <td className="num">{d.tp.toFixed(1)}</td>
                  <td className="num">{d.fp.toFixed(1)}</td>
                  <td className="num">{d.published === null ? '—' : d.published.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>Precision and recall separately</h2>
        <p className="body">
          F1 hides which side of the trade a tool sits on. Precision is the share
          of comments that matched something a human reviewer actually wrote.
          Recall is the share of the human comments that were found.
        </p>
        <div className="two-up">
          <BarChart rows={rows} metric="p" label="Precision" compact />
          <BarChart rows={rows} metric="r" label="Recall" compact />
        </div>
      </section>

      <section>
        <h2>The trade-off, drawn</h2>
        <p className="body">
          No reviewer on this corpus is best at both. Tools toward the top are
          right more often; tools toward the right find more. GitNexus matches{' '}
          {us.tp} of {us.tp + us.fn} human findings, with{' '}
          {(us.p * 100).toFixed(1)}% precision.
        </p>
        <Scatter
          rows={rows}
          xKey="r"
          yKey="p"
          xLabel="Recall →"
          yLabel="Precision →"
          caption={`Precision against recall, ${M.tools + 1} reviewers`}
        />
      </section>

      <section>
        <h2>How much noise it costs to get there</h2>
        <p className="body">
          Review comments are read by people, so volume is a cost, not a feature.
          The v35 candidate set contains {us.tp + us.fp} findings, averaging{' '}
          {us.perPR.toFixed(2)} per pull request, with {us.fp} false positives
          across all {M.prs} pull requests.
        </p>
        <div className="two-up">
          <BarChart rows={rows} metric="perPR" label="Findings per PR" compact />
          <Scatter
            rows={rows}
            xKey="perPR"
            yKey="p"
            xLabel="Findings per PR →"
            yLabel="Precision →"
            caption="Precision against volume"
          />
        </div>
      </section>

      <section>
        <h2>What a number on this corpus is worth</h2>
        <p className="body">
          Fifty pull requests is a small sample and the judge is a language model,
          so the same work measured twice does not give the same answer. Both
          floors were measured rather than assumed, and they differ by more than
          four times:
        </p>
        <ul className="body">
          <li>
            Re-scoring one <em>fixed</em> set of reviews moves F1 by about{' '}
            <strong>{M.noiseReplay}</strong>. That is the judge disagreeing with
            itself about how to split the same text into findings.
          </li>
          <li>
            Re-<em>running</em> the reviewer on the same pull requests moves F1 by
            about <strong>{M.noiseRegen}</strong>, because the reviewer resamples
            which defects it happens to notice.
          </li>
        </ul>
        <p className="body">
          The consequence is worth stating plainly: on this corpus a single run is
          not evidence for a change worth less than about 0.05, and detecting a
          +0.02 improvement by re-running would take roughly a hundred runs per
          side. The earlier GitNexus experiment above reports the mean of{' '}
          {M.n} judgings, with standard error {M.f1Sem}. The v35 headline is
          calculated from {us.tp} TP, {us.fp} FP, and {us.fn} FN in the judged
          candidate set; it does not reuse that earlier experiment's standard
          error. Rank is the ordering of the displayed F1 scores, not a claim of
          statistical separation or a new judging of the composed artefact.
        </p>
      </section>

      <section>
        <h2>Benchmark conditions</h2>
        <p className="body">
          Everything below is fixed across every tool on this page. It is
          documented so the result can be checked rather than taken on trust.
        </p>

        <div className="cards">
          <div className="card">
            <h3>The corpus</h3>
            <p>
              {M.prs} real pull requests across five open-source projects, with
              the comments human reviewers actually left on them as ground truth
              — {M.goldens} comments in total, {M.scored} of them in the scoring
              profile.
            </p>
            <table className="mini">
              <tbody>
                {DATA.corpus.map((c) => (
                  <tr key={c.repo}>
                    <td>{c.repo}</td>
                    <td className="num">{c.prs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>The judge</h3>
            <p>
              An LLM is shown one human comment and one candidate finding and
              asked a single question: do these describe the same problem?
              Wording may differ.
            </p>
            <table className="mini">
              <tbody>
                <tr><td>model</td><td className="num mono">{M.judge}</td></tr>
                <tr><td>temperature</td><td className="num mono">{M.temp}</td></tr>
                <tr><td>seed</td><td className="num mono">{M.seed}</td></tr>
              </tbody>
            </table>
            <p className="small">
              The judge is held identical for every tool. Reviewer and judge are
              different models, so nothing grades its own output.
            </p>
          </div>

          <div className="card">
            <h3>What the score means</h3>
            <p>
              The judge measures <b>agreement with a specific human reviewer</b>,
              not correctness. A finding that is true, but that the reviewer did
              not happen to write down, counts against precision.
            </p>
            <p className="small">
              That is the same for every tool here, but it changes how a
              precision number should be read — on this corpus it is a measure of
              agreement, not of truth.
            </p>
          </div>

          <div className="card">
            <h3>How it was run</h3>
            <ul>
              <li>Two independent review passes; their findings are unioned and de-duplicated.</li>
              <li>Each posted comment carries one claim: a title and one sentence of rationale.</li>
              <li>Each PR reviewed against a code graph built at that PR's own base commit.</li>
              <li>The same configuration for every PR — no per-repository or per-PR tuning.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Full results</h2>
        <div className="table-wrap">
          <table className="full">
            <thead>
              <tr>
                <th>#</th>
                <th>Reviewer</th>
                <th className="num">F1</th>
                <th className="num">Precision</th>
                <th className="num">Recall</th>
                <th className="num">Matched</th>
                <th className="num">Unmatched</th>
                <th className="num">Missed</th>
                <th className="num">Per PR</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.tool} className={d.ours ? 'ours' : undefined}>
                  <td className="num">{d.rank}</td>
                  <td>{d.tool}</td>
                  <td className="num">{d.f1.toFixed(3)}</td>
                  <td className="num">{d.p.toFixed(3)}</td>
                  <td className="num">{d.r.toFixed(3)}</td>
                  <td className="num">{d.tp}</td>
                  <td className="num">{d.fp}</td>
                  <td className="num">{d.fn}</td>
                  <td className="num">{d.perPR.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer>
        <h3>Reading this honestly</h3>
        <ul>
          <li>
            <b>Rank is by displayed F1.</b> Repeating one unchanged configuration
            on this corpus moved F1 by up to 0.054, so ranks 6 through 11 — which
            span 0.024 — are not separable by a single run. The v35 headline
            uses the judged candidate counts and drop rule described above.
          </li>
          <li>
            <b>Precision here means agreement</b> with one reviewer's written
            comments, not correctness.
          </li>
          <li>
            <b>The corpus is public</b> and the judge configuration is stated
            above, so any number on this page can be re-derived.
          </li>
        </ul>
        <p className="mono small">
          {M.prs} pull requests · {M.goldens} human comments · {M.tools + 1} reviewers · judge {M.judge} @ temp {M.temp}, seed {M.seed} · {M.profile} profile
        </p>
      </footer>
    </div>
  );
}
