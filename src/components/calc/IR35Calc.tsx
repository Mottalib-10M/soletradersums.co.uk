/**
 * Contractor take-home 2026/27 for one contract: outside IR35 through your own company, inside IR35
 * (deemed employment, PAYE by the fee-payer) and through an umbrella company. Engine: `ir35()`.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { ir35, type Plan, type Region } from '../../lib/engine/tax';
import { formatMoney } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { rate?: number; days?: number; methodHref: string; idPrefix?: string }
const m = (n: number) => formatMoney(Math.round(n), 0);

export default function IR35Calc({ rate: r0 = 450, days: d0 = 220, methodHref, idPrefix = 'ir' }: Props) {
  const [rate, setRate] = useState(r0);
  const [days, setDays] = useState(d0);
  const [expenses, setExpenses] = useState(2000);
  const [region, setRegion] = useState<Region>('ruk');
  const [plan, setPlan] = useState<Plan>('none');
  const [margin, setMargin] = useState(20);
  const [weeks, setWeeks] = useState(46);
  const [levy, setLevy] = useState(true);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    setRate(num(u, 'rate', r0)); setDays(num(u, 'days', d0)); setExpenses(num(u, 'x', 2000)); setRegion(str(u, 'r', 'ruk') === 'scotland' ? 'scotland' : 'ruk');
    setPlan(str(u, 'p', 'none') as Plan); setMargin(num(u, 'mg', 20)); setWeeks(num(u, 'wk', 46)); setLevy(str(u, 'lv', '1') === '1');
  }, []);
  useEffect(() => { updateURL({ rate, days, x: expenses, r: region, p: plan === 'none' ? undefined : plan, mg: margin, wk: weeks, lv: levy ? 1 : 0 }); }, [rate, days, expenses, region, plan, margin, weeks, levy]);
  const r = useMemo(() => ir35({ dayRate: rate, days, expenses, region, plan, umbrellaMarginWeekly: margin, weeks, levy }), [rate, days, expenses, region, plan, margin, weeks, levy]);
  const id = (s: string) => `${idPrefix}-${s}`;
  const col = (title: string, total: number, rows: Array<[string, string]>, strong = false) => (
    <div className={`p-4 ${strong ? 'border-l-4 border-accent-500 bg-accent-50' : 'border border-navy-200 bg-navy-50'}`}>
      <p className="text-sm font-medium text-navy-700">{title}</p>
      <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{m(total)}</p>
      <table className="ledger mt-2 w-full text-sm"><tbody>{rows.map(([l, v]) => <tr key={l}><td className="pr-2 text-navy-700">{l}</td><td className="tabular-nums text-right">{v}</td></tr>)}</tbody></table>
    </div>
  );
  return (
    <div className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,24rem)]">
        <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('rate')} label="Day rate" value={rate} onChange={setRate} unit="£" max={10_000} />
            <NumberField id={id('days')} label="Days billed in the year" value={days} onChange={setDays} unit="days" max={366} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('region')} label="Where you live" value={region} onChange={(v) => setRegion(v === 'scotland' ? 'scotland' : 'ruk')} options={[{ value: 'ruk', label: 'England, Wales or NI' }, { value: 'scotland', label: 'Scotland' }]} />
            <NumberField id={id('exp')} label="Company costs (outside IR35)" value={expenses} onChange={setExpenses} unit="£" max={1_000_000} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('margin')} label="Umbrella margin a week" value={margin} onChange={setMargin} unit="£" max={1000} help="From its Key Information Document" />
            <NumberField id={id('weeks')} label="Weeks paid by the umbrella" value={weeks} onChange={setWeeks} unit="weeks" max={53} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('levy')} label="Umbrella passes on the Levy?" value={levy ? '1' : '0'} onChange={(v) => setLevy(v === '1')} options={[{ value: '1', label: 'Yes, 0.5 %' }, { value: '0', label: 'No' }]} />
            <SelectField id={id('plan')} label="Student loan" value={plan} onChange={(v) => setPlan(v as Plan)} options={[{ value: 'none', label: 'None' }, { value: 'plan1', label: 'Plan 1' }, { value: 'plan2', label: 'Plan 2' }, { value: 'plan4', label: 'Plan 4' }, { value: 'plan5', label: 'Plan 5' }]} />
          </div>
        </form>
        <div data-resultat aria-live="polite" className="self-start">
          {col('Outside IR35, your own company', r.outside.takeHome, [['Salary', m(r.outside.salary)], ['Corporation Tax', m(r.outside.ct.tax)], ['Dividends paid out', m(r.outside.dividends)], ['Income and dividend tax', m(r.outside.it.tax)], ['National Insurance (both sides)', m(r.outside.employeeNI + r.outside.employerNI)]], true)}
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {col('Inside IR35, paid through your company', r.inside.takeHome, [['Treated as salary', m(r.inside.gross)], ['Income Tax', m(r.inside.incomeTax)], ['Employee NI', m(r.inside.employeeNI)], ['Student loan (Self Assessment)', m(r.inside.loan)], ['Employer NI paid on top by the fee-payer', m(r.inside.employerNIOnTop)]])}
        {col('Through an umbrella company', r.umbrella.takeHome, [['Assignment income', m(r.umbrella.assignment)], ['Margin', m(r.umbrella.margin)], ['Employer NI and Levy from your rate', m(r.umbrella.employerNI + r.umbrella.levy)], ['Income Tax and employee NI', m(r.umbrella.incomeTax + r.umbrella.employeeNI)], ['Student loan', m(r.umbrella.loan)]])}
      </div>
      <p className="mt-3 text-xs text-navy-700">Outside IR35 assumes the best salary and every pound left after Corporation Tax paid out as dividends; inside IR35 assumes the fee is not cut to cover employer costs. Pension, holiday pay accrual and VAT are left out. <a className="underline" href={methodHref}>Method and limits</a></p>
    </div>
  );
}
