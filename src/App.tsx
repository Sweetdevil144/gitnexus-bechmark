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
          <span className="brand-mark">
            <img src="/images/akon-logo.webp" alt="" width={32} height={32} />
          </span>
          <span className="eyebrow">Benchmarks</span>
        </div>
        <h1>GitNexus PR Review Benchmarks</h1>
        <p className="lede">
          GitNexus is compared with {M.tools} code review tools on the Martian
          Code Review Benchmark, comprising {M.prs} pull requests and{' '}
          {M.goldens} human reference findings. GitNexus ranks second by reported
          F1, with a score of {us.f1.toFixed(3)}, precision of {us.p.toFixed(3)},
          and recall of {us.r.toFixed(3)}. Scores are calculated from aggregate
          counts of previously judged findings.
        </p>
        <p className="meta mono">
          Judge: {M.judge}. Temperature: {M.temp}. Seed: {M.seed}.
        </p>
      </header>

      <section className="stats" aria-label="Headline results">
        <Stat k="Rank" v={`${us.rank} of ${M.tools + 1}`} sub={`Ranked by ${M.fbeta}`} />
        <Stat k="F1" v={us.f1.toFixed(3)} sub="Harmonic mean of precision and recall" />
        <Stat k="Precision" v={us.p.toFixed(3)} sub={`${us.tp} of ${us.tp + us.fp} findings matched`} />
        <Stat k="Recall" v={us.r.toFixed(3)} sub={`${us.tp} of ${us.tp + us.fn} findings matched`} />
      </section>

      <section>
        <h2>F1 comparison</h2>
        <p className="body">
          The {M.tools + 1} reviewers are ranked by F1 under the benchmark's{' '}
          <code>{M.profile}</code> scoring profile. Rankings apply to the reported
          scores for this corpus and profile.
        </p>
        <BarChart rows={rows} metric="f1" label={`F1 — ${M.tools + 1} reviewers`} />
      </section>

      <section>
        <h2>Prior repeated evaluations</h2>
        <p className="body">
          In a previous experiment, each tool's fixed review output was evaluated{' '}
          {M.n} times using {M.judge} at temperature {M.temp} and seed {M.seed}.
          Results are reported as mean F1 ± standard error of the mean (SEM).
          The GitNexus result in this table predates the current result.
        </p>
        <div className="table-wrap">
          <table className="full">
            <thead>
              <tr>
                <th>#</th><th>Reviewer</th><th className="num">F1 ± SEM</th><th className="num">Precision</th>
                <th className="num">Recall</th><th className="num">TP</th><th className="num">FP</th><th className="num">Published F1</th>
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
        <h2>Precision and recall</h2>
        <p className="body">
          Precision is the proportion of evaluated findings that match the human
          reference set. Recall is the proportion of reference findings matched.
        </p>
        <div className="two-up">
          <BarChart rows={rows} metric="p" label="Precision" compact />
          <BarChart rows={rows} metric="r" label="Recall" compact />
        </div>
      </section>

      <section>
        <h2>Precision–recall distribution</h2>
        <p className="body">
          The plot shows precision against recall for each reviewer. GitNexus
          matches {us.tp} of {us.tp + us.fn} reference findings, with{' '}
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
        <h2>Finding volume</h2>
        <p className="body">
          The current GitNexus result includes {us.tp + us.fp} findings across{' '}
          {M.prs} pull requests, averaging {us.perPR.toFixed(2)} findings per pull
          request. Of these, {us.tp} match the reference set and {us.fp} are
          unmatched.
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
        <h2>Evaluation variability</h2>
        <p className="body">
          Prior experiments measured variation from repeated scoring and from
          repeated review generation on the same {M.prs} pull requests:
        </p>
        <ul className="body">
          <li>
            Repeated scoring of fixed review output: F1 variation of{' '}
            <strong>{M.noiseReplay}</strong>.
          </li>
          <li>
            Repeated review generation: F1 variation of up to{' '}
            <strong>{M.noiseRegen}</strong>.
          </li>
        </ul>
        <p className="body">
          The prior GitNexus experiment reports a standard error of {M.f1Sem}
          {' '}across {M.n} evaluations. This error estimate applies only to that
          experiment. The current result reports aggregate counts without a
          standard error. Differences in rank do not establish statistical
          significance.
        </p>
      </section>

      <section>
        <h2>Benchmark conditions</h2>
        <p className="body">
          Dataset, evaluation settings, and metric definitions are listed below.
        </p>

        <div className="cards">
          <div className="card">
            <h3>Dataset</h3>
            <p>
              {M.prs} pull requests from five open-source projects, with{' '}
              {M.goldens} human reference findings. The selected scoring profile
              includes {M.scored} reference findings.
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
            <h3>Evaluation settings</h3>
            <p>
              The benchmark uses a language model to assess whether a review
              finding matches a human reference finding.
            </p>
            <table className="mini">
              <tbody>
                <tr><td>Model</td><td className="num mono">{M.judge}</td></tr>
                <tr><td>Temperature</td><td className="num mono">{M.temp}</td></tr>
                <tr><td>Seed</td><td className="num mono">{M.seed}</td></tr>
              </tbody>
            </table>
            <p className="small">
              Evaluation settings are shared across tools.
            </p>
          </div>

          <div className="card">
            <h3>Metric definitions</h3>
            <p>
              TP denotes matched findings, FP denotes unmatched findings, and
              FN denotes missed reference findings.
            </p>
            <ul>
              <li>Precision = TP / (TP + FP)</li>
              <li>Recall = TP / (TP + FN)</li>
              <li>F1 = 2TP / (2TP + FP + FN)</li>
            </ul>
          </div>

          <div className="card">
            <h3>Evaluation scope</h3>
            <p>
              Current scores are calculated from {us.tp} TP, {us.fp} FP, and{' '}
              {us.fn} FN using existing finding-level judgments. The complete
              review output has not undergone a separate evaluation for this result.
            </p>
            <p className="small">
              The prior repeated-evaluation results are reported separately.
            </p>
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
        <h3>Interpretation</h3>
        <ul>
          <li>
            Ranks reflect the reported F1 scores for this corpus and scoring profile.
          </li>
          <li>
            Metrics measure agreement with the human reference set. Valid
            findings absent from that set may count as false positives.
          </li>
          <li>
            Scores are displayed to three decimal places. Prior repeated
            evaluations retain four decimal places to show their standard errors.
          </li>
        </ul>
        <p className="mono small">
          {M.prs} pull requests. {M.goldens} reference findings. {M.tools + 1} reviewers.
          {' '}Scoring profile: {M.profile}.
        </p>
      </footer>
    </div>
  );
}
