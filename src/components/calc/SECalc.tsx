/**
 * Self-employed tax calculator 2026/27 (main tool). Turnover minus expenses gives the profit; wages
 * from a job are taxed first through PAYE; the result is the Self Assessment bill, what to put aside,
 * the first payments on account and where the turnover sits against the Making Tax Digital tests.
 * Hydration (RECETTE §17.5): first render = props defaults; the link parameters are applied in an effect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import StackedBar from '../ui/StackedBar';
import { selfEmployed, tradingAllowance, marginalOnProfit, type Plan, type Region } from '../../lib/engine/tax';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { turnover?: number; expenses?: number; region?: Region; wages?: number; plan?: Plan; methodHref: string; mtdHref: string; poaHref: string; idPrefix?: string }
const m = (n: number) => formatMoney(Math.round(n), 0);
const pc = (x: number) => formatPercent(x, 1);
const PLANS = [{ value: 'none', label: 'No student loan' }, { value: 'plan1', label: 'Plan 1' }, { value: 'plan2', label: 'Plan 2' }, { value: 'plan4', label: 'Plan 4 (Scotland)' }, { value: 'plan5', label: 'Plan 5' }];

export default function SECalc({ turnover: t0 = 42000, expenses: e0 = 6000, region: r0 = 'ruk', wages: w0 = 0, plan: p0 = 'none', methodHref, mtdHref, poaHref, idPrefix = 'se' }: Props) {
  const [turnover, setTurnover] = useState(t0);
  const [expenses, setExpenses] = useState(e0);
  const [region, setRegion] = useState<Region>(r0);
  const [wages, setWages] = useState(w0);
  const [plan, setPlan] = useState<Plan>(p0);
  const [pg, setPg] = useState(false);
  const [dividends, setDividends] = useState(0);
  const [pension, setPension] = useState(0);
  const [useAllowance, setUseAllowance] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    setTurnover(num(u, 't', t0)); setExpenses(num(u, 'e', e0)); setRegion(str(u, 'r', r0) === 'scotland' ? 'scotland' : 'ruk');
    setWages(num(u, 'w', w0)); setPlan(str(u, 'p', p0) as Plan); setPg(str(u, 'pg', '0') === '1');
    setDividends(num(u, 'dv', 0)); setPension(num(u, 'pn', 0)); setUseAllowance(str(u, 'ta', '0') === '1');
  }, []);
  useEffect(() => { updateURL({ t: turnover, e: expenses, r: region, w: wages || undefined, p: plan === 'none' ? undefined : plan, pg: pg ? 1 : undefined, dv: dividends || undefined, pn: pension || undefined, ta: useAllowance ? 1 : undefined }); }, [turnover, expenses, region, wages, plan, pg, dividends, pension, useAllowance]);

  const ta = tradingAllowance(turnover, expenses);
  const profit = useAllowance ? ta.withAllowance : ta.withExpenses;
  const r = useMemo(() => selfEmployed({ profit, region, employment: wages, dividends, plan, postgrad: pg, pensionGross: pension }), [profit, region, wages, dividends, plan, pg, pension]);
  const marginal = useMemo(() => marginalOnProfit({ profit, region, employment: wages, dividends, plan, postgrad: pg, pensionGross: pension }), [profit, region, wages, dividends, plan, pg, pension]);
  const loanSA = Math.max(0, r.loan.total - r.loanViaPaye);
  const keptFromProfit = profit - r.saBill;
  const stage = P.mtd.stages.find((s) => turnover > s.threshold);

  const share = () => { try { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard refused */ } };
  const id = (x: string) => `${idPrefix}-${x}`;

  return (
    <div className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)]">
        <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('turnover')} label="Turnover (sales)" value={turnover} onChange={setTurnover} unit="£" max={50_000_000} />
            <NumberField id={id('expenses')} label="Allowable expenses" value={expenses} onChange={setExpenses} unit="£" max={50_000_000} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('region')} label="Where you live" value={region} onChange={(v) => setRegion(v === 'scotland' ? 'scotland' : 'ruk')} options={[{ value: 'ruk', label: 'England, Wales or NI' }, { value: 'scotland', label: 'Scotland' }]} />
            <NumberField id={id('wages')} label="Wages from a job" value={wages} onChange={setWages} unit="£" max={10_000_000} help="Taxed first, through PAYE" />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('plan')} label="Student loan" value={plan} onChange={(v) => setPlan(v as Plan)} options={PLANS} />
            <SelectField id={id('pg')} label="Postgraduate Loan" value={pg ? '1' : '0'} onChange={(v) => setPg(v === '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
          </div>
          <details className="border-t border-navy-200 pt-3">
            <summary className="cursor-pointer text-sm font-semibold text-navy-800">More: dividends, pension, trading allowance</summary>
            <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
              <NumberField id={id('div')} label="Dividends received" value={dividends} onChange={setDividends} unit="£" max={10_000_000} />
              <NumberField id={id('pension')} label="Gross pension paid in" value={pension} onChange={setPension} unit="£" max={1_000_000} help="Relief at source" />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
              <SelectField id={id('ta')} label="Profit method" value={useAllowance ? '1' : '0'} onChange={(v) => setUseAllowance(v === '1')} options={[{ value: '0', label: 'Turnover − expenses' }, { value: '1', label: `£${P.tradingAllowance.amount.toLocaleString('en-GB')} trading allowance` }]} />
            </div>
          </details>
        </form>
        <div data-resultat aria-live="polite" className="self-start border-l-4 border-accent-500 bg-accent-50 p-4">
          <p className="text-sm font-medium text-navy-700">Self Assessment bill {P.taxYear}</p>
          <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{m(r.saBill)}</p>
          <p className="mt-1 text-sm text-navy-700">Put aside <strong>{pc(r.setAside)}</strong> of your profit · next £100 of profit costs {pc(marginal)}</p>
          <table className="ledger mt-3 w-full text-sm"><tbody>
            <tr><td className="text-navy-700">Profit</td><td className="tabular-nums text-right">{m(profit)}</td></tr>
            <tr><td className="text-navy-700">Income Tax {wages > 0 ? 'not taken by PAYE' : ''}</td><td className="tabular-nums text-right">{m(r.itViaSA)}</td></tr>
            <tr><td className="text-navy-700">Class 4 National Insurance</td><td className="tabular-nums text-right">{m(r.class4.total)}</td></tr>
            {loanSA > 0 && <tr><td className="text-navy-700">Student loan</td><td className="tabular-nums text-right">{m(loanSA)}</td></tr>}
            <tr><td className="text-navy-700">Class 2</td><td className="text-right text-navy-800">{r.class2.credited ? 'treated as paid' : 'voluntary only'}</td></tr>
            <tr className="total"><td>Kept from your profit</td><td className="tabular-nums text-right">{m(keptFromProfit)}</td></tr>
          </tbody></table>
        </div>
      </div>
      <div className="mt-5 grid gap-4 border-t border-navy-200 pt-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-navy-900">When you pay, if {P.taxYear} is your first year</p>
          <table className="ledger mt-2 w-full text-sm"><tbody>
            <tr><td className="text-navy-700">31 January 2028: bill{r.poaDue ? ' + first payment on account' : ''}</td><td className="tabular-nums text-right">{m(r.saBill + r.poaEach)}</td></tr>
            <tr><td className="text-navy-700">31 July 2028: second payment on account</td><td className="tabular-nums text-right">{m(r.poaEach)}</td></tr>
          </tbody></table>
          <p className="mt-1 text-xs text-navy-600">{r.poaDue ? `Each payment on account is half of ${m(r.poaBasis)} (Income Tax and Class 4, loans excluded). ` : `No payments on account: the bill is under ${m(P.paymentsOnAccount.minBill)} or mostly paid at source. `}<a className="underline" href={poaHref}>How payments on account work</a></p>
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-900">Making Tax Digital at this turnover</p>
          <p className="mt-2 text-sm text-navy-800">{stage ? `Turnover of ${m(turnover)} is over the ${m(stage.threshold)} test. If your ${stage.basisYear} return showed income like this, quarterly updates start on ${new Date(`${stage.start}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}.` : `Turnover of ${m(turnover)} is under every threshold announced so far (the lowest is ${m(P.mtd.stages[2].threshold)}).`} <a className="underline" href={mtdHref}>Check your start date</a></p>
          <div className="mt-3"><StackedBar ariaPrefix="Where your profit goes" total={Math.max(profit, 1)} segments={[{ label: 'Kept', value: Math.max(0, keptFromProfit), color: '#14532d' }, { label: 'Income Tax', value: r.itViaSA, color: '#8A1538' }, { label: 'Class 4', value: r.class4.total, color: '#b45309' }, { label: 'Student loan', value: loanSA, color: '#475569' }]} /></div>
        </div>
      </div>
      <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-300 bg-white/95 px-4 py-2 text-sm text-navy-900 shadow-[0_-2px_6px_rgba(0,0,0,0.06)] lg:hidden print:hidden">Bill <strong className="tabular-nums">{m(r.saBill)}</strong> · put aside <strong>{pc(r.setAside)}</strong> · kept <strong className="tabular-nums">{m(keptFromProfit)}</strong></div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <button type="button" onClick={share} className="rounded border border-navy-300 px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy a link to these figures'}</button>
        <button type="button" onClick={() => window.print()} className="rounded border border-navy-300 px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
        <a href={methodHref} className="text-accent-700 underline underline-offset-2">How this is calculated</a>
        <span className="text-xs text-navy-600">Assumes a standard tax code on the wages and a 6 April to 5 April accounting year.</span>
      </div>
    </div>
  );
}
