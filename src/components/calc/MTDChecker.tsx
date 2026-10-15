/**
 * Making Tax Digital for Income Tax: when does it start for you? Qualifying income = self-employed
 * turnover + your share of gross rents, before expenses, year by year (HMRC). Engine: `mtdStart()`.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { mtdStart } from '../../lib/engine/tax';
import { P } from '../../lib/engine/params';
import { formatMoney, displayDate } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';

interface Props { se?: number; methodHref: string; idPrefix?: string }
const m = (n: number) => formatMoney(Math.round(n), 0);
const d = (iso: string) => displayDate(iso, 'en-GB');

export default function MTDChecker({ se: s0 = 38000, methodHref, idPrefix = 'mtd' }: Props) {
  const [v, setV] = useState({ s1: s0, p1: 0, s2: s0, p2: 0, s3: s0, p3: 0 });
  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    setV({ s1: num(u, 's1', s0), p1: num(u, 'p1', 0), s2: num(u, 's2', s0), p2: num(u, 'p2', 0), s3: num(u, 's3', s0), p3: num(u, 'p3', 0) });
  }, []);
  useEffect(() => { updateURL(v); }, [v]);
  const set = (k: keyof typeof v) => (x: number) => setV((o) => ({ ...o, [k]: x }));
  const q = [v.s1 + v.p1, v.s2 + v.p2, v.s3 + v.p3];
  const r = useMemo(() => mtdStart({ y2425: q[0], y2526: q[1], y2627: q[2] }), [q[0], q[1], q[2]]);
  const y = r ? Number(r.start.slice(0, 4)) : 0;
  const pen = P.mtd.penalties;
  const id = (s: string) => `${idPrefix}-${s}`;
  const rowsIn: Array<[keyof typeof v, keyof typeof v, string]> = [['s1', 'p1', P.mtd.stages[0].basisYear], ['s2', 'p2', P.mtd.stages[1].basisYear], ['s3', 'p3', `${P.mtd.stages[2].basisYear} (estimate)`]];
  return (
    <div className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,24rem)]">
        <form className="grid content-start gap-3" onSubmit={(e) => e.preventDefault()}>
          {rowsIn.map(([a, b, label]) => (
            <div key={a} className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
              <NumberField id={id(a)} label={`Self-employed turnover ${label}`} value={v[a]} onChange={set(a)} unit="£" max={100_000_000} />
              <NumberField id={id(b)} label={`Your share of rents ${label}`} value={v[b]} onChange={set(b)} unit="£" max={100_000_000} />
            </div>
          ))}
          <p className="text-xs text-navy-600">Turnover before expenses. Wages, dividends, pensions and partnership profit shares do not count.</p>
        </form>
        <div data-resultat aria-live="polite" className="self-start border-l-4 border-accent-500 bg-accent-50 p-4">
          <p className="text-sm font-medium text-navy-700">Making Tax Digital for Income Tax</p>
          <p className="mt-1 text-3xl font-bold text-navy-900">{r ? `From ${d(r.start)}` : 'Not required yet'}</p>
          <p className="mt-2 text-sm text-navy-800">{r ? `Qualifying income of ${m(q[r.index])} in ${r.basisYear} is over the ${m(r.threshold)} threshold.` : `None of the three years is over its threshold (${P.mtd.stages.map((s) => `${m(s.threshold)} for ${s.basisYear}`).join(', ')}).`}</p>
          {r && <table className="ledger mt-3 w-full text-sm"><tbody>
            {P.mtd.quarters.map((qq, i) => <tr key={qq.deadline}><td className="text-navy-700">Update {i + 1} ({qq.standard})</td><td className="text-right tabular-nums">{qq.deadline} {i < 2 ? y : y + 1}</td></tr>)}
            <tr className="total"><td>Tax return and payment</td><td className="text-right">31 January {y + 2}</td></tr>
          </tbody></table>}
          {r && <p className="mt-2 text-xs text-navy-700">{r.start === '2026-04-06' ? `No penalty points for late quarterly updates in ${pen.noQuarterlyPointsYear}. ` : ''}Late updates and returns then earn points: {pen.pointThreshold} points bring a {m(pen.submissionPenalty)} penalty.</p>}
        </div>
      </div>
      <p className="mt-3 text-xs text-navy-700">HMRC reads these figures from your Self Assessment returns and writes to you, but the duty to sign up is yours even without a letter. Exemptions exist (digital exclusion, some carers). <a className="underline" href={methodHref}>Method</a></p>
    </div>
  );
}
