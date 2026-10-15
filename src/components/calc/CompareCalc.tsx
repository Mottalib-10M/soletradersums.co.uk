/**
 * Sole trader or limited company, 2026/27. Both structures are run by the engine on the same profit;
 * the company pays the salary that leaves the director the most (or the one typed), then Corporation
 * Tax, then dividends for the share drawn. The chart shows the gap across every level of profit,
 * for everything paid out and for the share chosen (money left in the company counted at its value
 * after Corporation Tax, before the dividend tax due when it is paid out).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { compareStructures, type Region } from '../../lib/engine/tax';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { profit?: number; region?: Region; draw?: number; methodHref: string; idPrefix?: string }
const m = (n: number) => formatMoney(Math.round(n), 0);
const k = (n: number) => `£${Math.round(n / 1000)}k`;

export default function CompareCalc({ profit: p0 = 60000, region: r0 = 'ruk', draw: d0 = 100, methodHref, idPrefix = 'cmp' }: Props) {
  const [profit, setProfit] = useState(p0);
  const [region, setRegion] = useState<Region>(r0);
  const [draw, setDraw] = useState(d0);
  const [mode, setMode] = useState<'best' | 'custom'>('best');
  const [salary, setSalary] = useState(P.class1.primaryThreshold);
  const [costs, setCosts] = useState(0);

  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    setProfit(num(u, 'p', p0)); setRegion(str(u, 'r', r0) === 'scotland' ? 'scotland' : 'ruk'); setDraw(num(u, 'd', d0));
    setMode(str(u, 'sm', 'best') === 'custom' ? 'custom' : 'best'); setSalary(num(u, 's', P.class1.primaryThreshold)); setCosts(num(u, 'c', 0));
  }, []);
  useEffect(() => { updateURL({ p: profit, r: region, d: draw, sm: mode === 'custom' ? 'custom' : undefined, s: mode === 'custom' ? salary : undefined, c: costs || undefined }); }, [profit, region, draw, mode, salary, costs]);

  const share = Math.min(100, Math.max(0, draw)) / 100;
  const r = useMemo(() => compareStructures({ profit, region, drawShare: share, extraCosts: costs, salary: mode === 'best' ? 'best' : salary }), [profit, region, share, costs, mode, salary]);
  const gapShare = r.ltd.takeHome + r.ltd.retained - r.soleTakeHome;

  // Curve: £10k to £200k, every £5k. Two lines: everything drawn (cash), and the chosen share (cash + kept in company).
  const curve = useMemo(() => {
    const pts: Array<{ p: number; all: number; part: number }> = [];
    for (let p = 10000; p <= 200000; p += 5000) {
      const c = compareStructures({ profit: p, region, drawShare: share, extraCosts: costs, salary: mode === 'best' ? 'best' : salary });
      pts.push({ p, all: c.gapAllDrawn, part: c.ltd.takeHome + c.ltd.retained - c.soleTakeHome });
    }
    return pts;
  }, [region, share, costs, mode, salary]);
  const W = 960, H = 250, pad = 40;
  const ys = curve.flatMap((c) => [c.all, c.part]);
  const ymax = Math.max(1000, ...ys), ymin = Math.min(-1000, ...ys);
  const x = (p: number) => pad + ((p - 10000) / 190000) * (W - 2 * pad);
  const y = (v: number) => 10 + ((ymax - v) / (ymax - ymin)) * (H - 40);
  const path = (key: 'all' | 'part') => curve.map((c, i) => `${i ? 'L' : 'M'}${x(c.p).toFixed(1)},${y(c[key]).toFixed(1)}`).join(' ');
  const id = (s: string) => `${idPrefix}-${s}`;
  const better = r.gapAllDrawn > 0 ? 'company' : 'sole trader';

  return (
    <div className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)]">
        <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('profit')} label="Profit before tax and salary" value={profit} onChange={setProfit} unit="£" max={5_000_000} />
            <SelectField id={id('region')} label="Where you live" value={region} onChange={(v) => setRegion(v === 'scotland' ? 'scotland' : 'ruk')} options={[{ value: 'ruk', label: 'England, Wales or NI' }, { value: 'scotland', label: 'Scotland' }]} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('draw')} label="Share of company profit paid out" value={draw} onChange={setDraw} unit="%" max={100} help="The rest stays in the company" />
            <NumberField id={id('costs')} label="Extra yearly cost of a company" value={costs} onChange={setCosts} unit="£" max={100_000} help="Accounts, filing: your own figure" />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('mode')} label="Director’s salary" value={mode} onChange={(v) => setMode(v === 'custom' ? 'custom' : 'best')} options={[{ value: 'best', label: 'The best level' }, { value: 'custom', label: 'My own figure' }]} />
            {mode === 'custom' ? <NumberField id={id('salary')} label="Salary" value={salary} onChange={setSalary} unit="£" max={1_000_000} /> : <div />}
          </div>
        </form>
        <div data-resultat aria-live="polite" className="self-start border-l-4 border-accent-500 bg-accent-50 p-4">
          <p className="text-sm font-medium text-navy-700">Everything paid out, the {better} leaves you</p>
          <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{m(Math.abs(r.gapAllDrawn))} more</p>
          <table className="ledger mt-3 w-full text-sm"><tbody>
            <tr><td className="text-navy-700">Sole trader keeps</td><td className="tabular-nums text-right">{m(r.soleTakeHome)}</td></tr>
            <tr><td className="text-navy-700">Company, all paid out</td><td className="tabular-nums text-right">{m(r.ltdAll.takeHome)}</td></tr>
            <tr><td className="text-navy-700">Salary used</td><td className="tabular-nums text-right">{m(r.salary)}</td></tr>
            {share < 1 && <tr><td className="text-navy-700">Company, {Math.round(share * 100)} % paid out: cash + left inside</td><td className="tabular-nums text-right">{m(r.ltd.takeHome)} + {m(r.ltd.retained)}</td></tr>}
            {share < 1 && <tr className="total"><td>Difference with what stays inside</td><td className="tabular-nums text-right">{gapShare >= 0 ? '+' : '−'}{m(Math.abs(gapShare))}</td></tr>}
          </tbody></table>
        </div>
      </div>
      <div className="mt-5 border-t border-navy-200 pt-4">
        <p className="text-sm font-semibold text-navy-900">Company minus sole trader, by profit ({region === 'scotland' ? 'Scotland' : 'England, Wales, NI'})</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-auto w-full" role="img" aria-label="Difference between a limited company and a sole trader for profits from £10,000 to £200,000">
          <line x1={pad} x2={W - pad} y1={y(0)} y2={y(0)} stroke="#334155" strokeWidth="1" />
          {[10000, 50000, 100000, 150000, 200000].map((p) => <g key={p}><line x1={x(p)} x2={x(p)} y1={y(0) - 3} y2={y(0) + 3} stroke="#334155" /><text x={x(p)} y={H - 6} fontSize="11" textAnchor="middle" fill="#334155">{k(p)}</text></g>)}
          <text x={pad} y={y(ymax) + 10} fontSize="11" fill="#334155">+{m(ymax)}</text>
          <text x={pad} y={y(ymin) - 2} fontSize="11" fill="#334155">−{m(Math.abs(ymin))}</text>
          <path d={path('all')} fill="none" stroke="#8A1538" strokeWidth="2.5" />
          {share < 1 && <path d={path('part')} fill="none" stroke="#14532d" strokeWidth="2" strokeDasharray="6 4" />}
          {profit >= 10000 && profit <= 200000 && <circle cx={x(profit)} cy={y(r.gapAllDrawn)} r="5" fill="#8A1538" />}
        </svg>
        <p className="mt-1 text-xs text-navy-700"><span className="font-semibold text-accent-700">Solid line</span>: everything paid out as dividends. {share < 1 ? <><span className="font-semibold text-green-900">Dashed line</span>: {Math.round(share * 100)} % paid out, the rest counted at its value inside the company, before the dividend tax due when it comes out. </> : 'Lower the share paid out to see the effect of leaving profit in the company. '}Above the axis the company leaves more. <a className="underline" href={methodHref}>Method and limits</a></p>
      </div>
    </div>
  );
}
