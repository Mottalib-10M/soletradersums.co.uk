/**
 * Mini-calculators, one per subject (RECETTE §9.3). Each one calls the tested engine of
 * `lib/engine/tax.ts`; none computes tax on its own. Defaults are overridden per page through the
 * `props` of the page's ToolDef (same ids as the inputs).
 */
import type { MiniSpec } from './mini-types';
import { P } from './engine/params';
import * as E from './engine/tax';
import { formatMoney as fm, formatPercent, displayDate } from './format';

const m = (n: number) => fm(Math.round(n), 0);
const pc = (x: number) => formatPercent(x, 1);
const d = (iso: string) => displayDate(iso, 'en-GB');
const REGION = [{ value: '0', label: 'England, Wales or NI' }, { value: '1', label: 'Scotland' }];
const reg = (v: number): E.Region => (v === 1 ? 'scotland' : 'ruk');
const PLAN = [{ value: '0', label: 'No loan' }, { value: '1', label: 'Plan 1' }, { value: '2', label: 'Plan 2' }, { value: '4', label: 'Plan 4 (Scotland)' }, { value: '5', label: 'Plan 5' }];
const plan = (v: number): E.Plan => (v === 1 ? 'plan1' : v === 2 ? 'plan2' : v === 4 ? 'plan4' : v === 5 ? 'plan5' : 'none');
const YESNO = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
const TY = P.taxYear;

const SPECS: Record<string, MiniSpec> = {
  'st-quick': {
    title: `Sole trader tax on your profit, ${TY}`, cta: 'Full calculator with student loans and payments on account', ctaPage: 'home',
    inputs: [{ id: 'profit', label: 'Profit for the year', def: 35000, unit: '£', max: 5000000 }, { id: 'region', label: 'Where you live', def: 0, options: REGION }],
    run: (v) => { const r = E.selfEmployed({ profit: v.profit, region: reg(v.region) });
      return { head: ['You keep', m(r.takeHome)], rows: [['Income Tax', m(r.it.tax)], ['Class 4 National Insurance', m(r.class4.total)], ['Put aside', `${pc(r.setAside)} of profit`]] }; },
  },
  class4: {
    title: `Class 4 National Insurance, ${TY}`, cta: 'Add Income Tax and student loans', ctaPage: 'home',
    inputs: [{ id: 'profit', label: 'Trading profit', def: 40000, unit: '£', max: 5000000 }],
    run: (v) => { const c = E.class4(v.profit); const c2 = E.class2(v.profit);
      return { head: ['Class 4 to pay', m(c.total)], rows: [[`${pc(P.class4.mainRate)} band`, m(c.main)], [`${pc(P.class4.upperRate)} above ${m(P.class4.upperProfitsLimit)}`, m(c.upper)], ['Class 2', c2.credited ? 'treated as paid' : 'not due, voluntary']] }; },
  },
  class2: {
    title: 'Class 2: treated as paid, or voluntary?', cta: 'See your whole bill', ctaPage: 'home',
    inputs: [{ id: 'profit', label: 'Trading profit', def: 6000, unit: '£', max: 5000000 }],
    run: (v) => { const c = E.class2(v.profit);
      return { head: [c.credited ? 'Year credited, nothing to pay' : 'Voluntary, if you want the year', c.credited ? m(0) : fm(c.voluntaryYear, 2)],
        rows: [['Small profits threshold', m(c.threshold)], ['Voluntary rate', `${fm(P.class2.weeklyRate, 2)} a week`], ['Class 4 on this profit', m(E.class4(v.profit).total)]] }; },
  },
  poa: {
    title: 'Payments on account: what is due and when', cta: 'Estimate this year’s bill', ctaPage: 'home',
    inputs: [{ id: 'last', label: 'Last year’s Income Tax and Class 4 via Self Assessment', def: 6000, unit: '£', max: 5000000 }, { id: 'source', label: 'Tax taken at source last year (PAYE)', def: 0, unit: '£', max: 5000000 }, { id: 'now', label: 'This year’s expected bill', def: 7000, unit: '£', max: 5000000 }],
    run: (v) => { const due = v.last >= P.paymentsOnAccount.minBill && (v.last + v.source > 0 ? v.source / (v.last + v.source) : 0) <= P.paymentsOnAccount.atSourceShare;
      const each = due ? v.last / 2 : 0; const balancing = Math.max(0, v.now - 2 * each); const next = due || v.now >= P.paymentsOnAccount.minBill ? v.now / 2 : 0;
      return { head: ['Each payment on account', m(each)], rows: [[`${P.paymentsOnAccount.dueFirst} and ${P.paymentsOnAccount.dueSecond}`, due ? `${m(each)} each` : 'none due'], ['Balancing payment next January', m(balancing)], ['Next January in total', m(balancing + next)]],
        note: due ? undefined : `No payments on account when last year's bill was under ${m(P.paymentsOnAccount.minBill)} or more than ${pc(P.paymentsOnAccount.atSourceShare)} of your tax was taken at source.` }; },
  },
  'mtd-penalty': {
    title: 'Late payment penalty under Making Tax Digital', cta: 'Check when MTD starts for you', ctaPage: 'making-tax-digital',
    inputs: [{ id: 'tax', label: 'Tax not paid on time', def: 5000, unit: '£', max: 5000000 }, { id: 'days', label: 'Days late', def: 45, unit: 'days', max: 1000 }, { id: 'year', label: 'Tax year of the payment', def: 0, options: [{ value: '0', label: '2026/27' }, { value: '1', label: '2027/28' }] }, { id: 'first', label: 'First year under MTD?', def: 1, options: YESNO }],
    run: (v) => { const r = E.mtdLatePayment(v.tax, v.days, v.year === 1 ? '2027/28' : '2026/27', v.first === 1); const old = E.saPenalties(v.tax, 0, v.days);
      return { head: ['Penalty', m(r.total)], rows: [['Day 15 charge', m(r.day15)], ['Day 30 charge', m(r.day30)], ['Yearly rate from day 31', m(r.daily)], ['Old Self Assessment rules, same delay', m(old.payment)]], note: 'Late payment interest is charged on top, at the Bank of England base rate plus 4 %.' }; },
  },
  'sa-penalty': {
    title: 'Self Assessment late filing and payment penalties', cta: 'See the 2026/27 deadlines', ctaPage: 'self-assessment-deadlines',
    inputs: [{ id: 'tax', label: 'Tax due on the return', def: 3000, unit: '£', max: 5000000 }, { id: 'filing', label: 'Days the return is late', def: 100, unit: 'days', max: 1000 }, { id: 'pay', label: 'Days the tax is paid late', def: 40, unit: 'days', max: 1000 }],
    run: (v) => { const r = E.saPenalties(v.tax, v.filing, v.pay);
      return { head: ['Penalties in total', m(r.total)], rows: [['Late filing, initial', m(r.initial)], ['Daily penalties', m(r.daily)], ['6 and 12 month penalties', m(r.six + r.twelve)], ['Late payment (5 % steps)', m(r.payment)]], note: 'Rules for returns outside Making Tax Digital. Interest is added on late tax.' }; },
  },
  register: {
    title: 'Started trading? Your first deadlines', cta: 'Estimate your first tax bill', ctaPage: 'home',
    inputs: [{ id: 'month', label: 'Month you started', def: 6, options: ['January', 'February', 'March', 'April (from the 6th)', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((x, i) => ({ value: String(i + 1), label: x })) }, { id: 'year', label: 'Year', def: 2026, options: [2025, 2026, 2027].map((y) => ({ value: String(y), label: String(y) })) }],
    run: (v) => { const r = E.firstYearDeadlines(`${v.year}-${String(v.month).padStart(2, '0')}-${v.month === 4 ? '06' : '15'}`);
      return { head: ['Register with HMRC by', d(r.registerBy)], rows: [['First tax year', r.taxYear], ['Online return due', d(r.onlineReturn)], ['First tax payment', d(r.firstPayment)], ['Second payment on account', d(r.secondPoa)]] }; },
  },
  dividend: {
    title: `Dividend tax, ${TY}`, cta: 'Compare a company with a sole trader', ctaPage: 'limited-company-vs-sole-trader',
    inputs: [{ id: 'other', label: 'Salary and other income', def: 12570, unit: '£', max: 5000000 }, { id: 'div', label: 'Dividends', def: 30000, unit: '£', max: 5000000 }, { id: 'region', label: 'Where you live', def: 0, options: REGION }],
    run: (v) => { const r = E.incomeTax({ nonSavings: v.other, dividends: v.div, region: reg(v.region) });
      const by = (n: string) => r.dividendSlices.filter((s) => s.name === n).reduce((t, s) => t + s.tax, 0);
      return { head: ['Tax on your dividends', m(r.dividendTax)], rows: [[`At ${pc(P.dividends.basic)}`, m(by('Dividend ordinary rate'))], [`At ${pc(P.dividends.higher)}`, m(by('Dividend upper rate'))], [`At ${pc(P.dividends.additional)}`, m(by('Dividend additional rate'))], ['Tax on the salary', m(r.nonSavingsTax)]] }; },
  },
  ct: {
    title: 'Corporation Tax from 1 April 2026', cta: 'What you take home from the company', ctaPage: 'limited-company-tax-calculator',
    inputs: [{ id: 'profit', label: 'Taxable profit', def: 80000, unit: '£', max: 50000000 }, { id: 'assoc', label: 'Associated companies', def: 0, max: 50 }, { id: 'months', label: 'Accounting period', def: 12, unit: 'months', max: 12 }],
    run: (v) => { const r = E.corporationTax(v.profit, v.assoc, Math.max(1, v.months));
      return { head: ['Corporation Tax', m(r.tax)], rows: [['Rate band', r.band === 'small' ? 'small profits rate' : r.band === 'main' ? 'main rate' : 'marginal relief'], ['Marginal relief', m(r.relief)], ['Effective rate', pc(r.effectiveRate)], ['Limits used', `${m(r.lower)} to ${m(r.upper)}`]] }; },
  },
  salary: {
    title: 'Director’s salary: which level leaves you most?', cta: 'Compare with staying a sole trader', ctaPage: 'limited-company-vs-sole-trader',
    inputs: [{ id: 'profit', label: 'Company profit before your salary', def: 60000, unit: '£', max: 5000000 }, { id: 'region', label: 'Where you live', def: 0, options: REGION }],
    run: (v) => { const r = reg(v.region); const at = (s: number) => E.limitedCompany({ profit: v.profit, salary: s, region: r }).takeHome; const best = E.bestSalary(v.profit, r);
      return { head: ['Best salary', m(best)], rows: [[`Salary ${m(0)}`, m(at(0))], [`Salary ${m(P.class1.secondaryThreshold)}`, m(at(P.class1.secondaryThreshold))], [`Salary ${m(P.class1.primaryThreshold)}`, m(at(P.class1.primaryThreshold))], [`Best: ${m(best)}`, m(at(best))]], note: 'Cash to you when every pound left after Corporation Tax is paid out as dividends, sole director, no Employment Allowance.' }; },
  },
  ltd: {
    title: 'Take-home from your limited company', cta: 'Set it against a sole trader', ctaPage: 'limited-company-vs-sole-trader',
    inputs: [{ id: 'profit', label: 'Company profit before your salary', def: 70000, unit: '£', max: 5000000 }, { id: 'salary', label: 'Your salary', def: 12570, unit: '£', max: 1000000 }, { id: 'draw', label: 'Share of profit paid out', def: 100, unit: '%', max: 100 }, { id: 'region', label: 'Where you live', def: 0, options: REGION }],
    run: (v) => { const r = E.limitedCompany({ profit: v.profit, salary: v.salary, region: reg(v.region), drawShare: v.draw / 100 });
      return { head: ['Cash to you', m(r.takeHome)], rows: [['Corporation Tax', m(r.ct.tax)], ['Employer NI', m(r.employerNI)], ['Your Income Tax and NI', m(r.it.tax + r.employeeNI)], ['Left in the company', m(r.retained)]] }; },
  },
  umbrella: {
    title: 'Umbrella company take-home', cta: 'Compare with inside and outside IR35', ctaPage: 'ir35-calculator',
    inputs: [{ id: 'rate', label: 'Day rate paid to the umbrella', def: 400, unit: '£', max: 10000 }, { id: 'days', label: 'Days worked in the year', def: 220, unit: 'days', max: 366 }, { id: 'margin', label: 'Umbrella margin per week', def: 20, unit: '£', max: 1000 }, { id: 'weeks', label: 'Weeks paid', def: 46, unit: 'weeks', max: 53 }, { id: 'levy', label: 'Apprenticeship Levy passed on?', def: 1, options: YESNO }],
    run: (v) => { const r = E.ir35({ dayRate: v.rate, days: v.days, region: 'ruk', umbrellaMarginWeekly: v.margin, weeks: v.weeks, levy: v.levy === 1 }).umbrella;
      return { head: ['Take-home for the year', m(r.takeHome)], rows: [['Employer NI taken from the rate', m(r.employerNI)], ['Levy and margin', m(r.levy + r.margin)], ['Gross pay', m(r.gross)], ['Income Tax and NI', m(r.incomeTax + r.employeeNI)]], note: 'England, Wales or Northern Ireland rates, no pension or student loan.' }; },
  },
  trading: {
    title: `£${P.tradingAllowance.amount.toLocaleString('en-GB')} trading allowance or real expenses?`, cta: 'Tax on the profit', ctaPage: 'home',
    inputs: [{ id: 'gross', label: 'Gross trading income', def: 4000, unit: '£', max: 5000000 }, { id: 'exp', label: 'Real business expenses', def: 600, unit: '£', max: 5000000 }],
    run: (v) => { const r = E.tradingAllowance(v.gross, v.exp);
      return { head: ['Taxable profit', m(r.profit)], rows: [['Best choice', r.exempt ? 'allowance: under the limit' : r.best === 'allowance' ? 'trading allowance' : 'real expenses'], ['With the allowance', m(r.withAllowance)], ['With real expenses', m(r.withExpenses)]] }; },
  },
  simplified: {
    title: `Simplified expenses for ${TY}`, cta: 'See the tax on what is left', ctaPage: 'home',
    inputs: [{ id: 'car', label: 'Business miles by car or van', def: 8000, unit: 'miles', max: 200000 }, { id: 'moto', label: 'Business miles by motorcycle', def: 0, unit: 'miles', max: 200000 }, { id: 'h1', label: 'Months working 25 to 50 hours at home', def: 6, unit: 'months', max: 12 }, { id: 'h2', label: 'Months working 51 to 100 hours', def: 0, unit: 'months', max: 12 }, { id: 'h3', label: 'Months working 101 hours or more', def: 6, unit: 'months', max: 12 }],
    run: (v) => { const r = E.simplifiedExpenses(v.car, v.moto, [v.h1, v.h2, v.h3]);
      return { head: ['Flat-rate expenses', m(r.total)], rows: [['Car or van', m(r.car)], ['Same miles at the old rate', m(r.carOld)], ['Motorcycle', m(r.moto)], ['Working from home', m(r.home)]] }; },
  },
  sl: {
    title: 'Student loan through Self Assessment', cta: 'Add it to your tax bill', ctaPage: 'home',
    inputs: [{ id: 'income', label: 'Profit plus any wages', def: 40000, unit: '£', max: 5000000 }, { id: 'plan', label: 'Loan plan', def: 2, options: PLAN }, { id: 'pg', label: 'Postgraduate Loan too?', def: 0, options: YESNO }],
    run: (v) => { const r = E.studentLoan(v.income, plan(v.plan), v.pg === 1);
      return { head: ['Repayment for the year', m(r.total)], rows: [['Plan threshold', v.plan === 0 ? 'none' : m(r.threshold)], ['Plan repayment', m(r.plan)], ['Postgraduate repayment', m(r.postgrad)]] }; },
  },
  pension: {
    title: 'Pension tax relief for a sole trader', cta: 'See your whole bill', ctaPage: 'home',
    inputs: [{ id: 'profit', label: 'Profit', def: 70000, unit: '£', max: 5000000 }, { id: 'gross', label: 'Gross pension contribution', def: 10000, unit: '£', max: 1000000 }, { id: 'region', label: 'Where you live', def: 0, options: REGION }],
    run: (v) => { const gross = Math.min(v.gross, v.profit); const base = E.incomeTax({ nonSavings: v.profit, region: reg(v.region) }); const w = E.incomeTax({ nonSavings: v.profit, region: reg(v.region), pensionGross: gross });
      const atSource = gross * P.pension.basicRelief; const saving = base.tax - w.tax;
      return { head: ['Real cost of the contribution', m(gross - atSource - saving)], rows: [['You pay the provider', m(gross - atSource)], ['Added by the provider (20 %)', m(atSource)], ['Less tax through Self Assessment', m(saving)]] }; },
  },
  taper: {
    title: 'The £100,000 allowance trap', cta: 'Your full bill', ctaPage: 'home',
    inputs: [{ id: 'income', label: 'Adjusted net income', def: 110000, unit: '£', max: 5000000 }, { id: 'region', label: 'Where you live', def: 0, options: REGION }],
    run: (v) => { const pa = E.personalAllowance(v.income); const mr = E.marginalOnProfit({ profit: v.income, region: reg(v.region) }, 1000);
      return { head: ['Personal Allowance left', m(pa)], rows: [['Allowance lost', m(P.incomeTax.personalAllowance - pa)], ['Tax and NI on the next £1,000', pc(mr)], ['Pension to get it all back', m(Math.max(0, v.income - P.incomeTax.taperStart))]] }; },
  },
  vat: {
    title: `VAT registration threshold: ${m(P.vat.threshold)}`, cta: 'Making Tax Digital for Income Tax', ctaPage: 'making-tax-digital',
    inputs: [{ id: 'last12', label: 'Taxable turnover, last 12 months', def: 84000, unit: '£', max: 50000000 }, { id: 'next30', label: 'Expected in the next 30 days alone', def: 9000, unit: '£', max: 50000000 }],
    run: (v) => { const past = v.last12 > P.vat.threshold, fut = v.next30 > P.vat.threshold;
      return { head: ['Must you register?', past || fut ? 'Yes' : 'Not yet'], rows: [['Room left under the threshold', m(Math.max(0, P.vat.threshold - v.last12))], ['Rolling 12-month test', past ? 'over' : 'under'], ['Next 30 days test', fut ? 'over' : 'under']], note: past ? `Register within ${P.vat.daysToRegister} days of the end of the month you went over.` : undefined }; },
  },
  save: {
    title: 'How much to put aside from each invoice', cta: 'Full calculator', ctaPage: 'home',
    inputs: [{ id: 'profit', label: 'Expected profit this year', def: 45000, unit: '£', max: 5000000 }, { id: 'wages', label: 'Wages from a job', def: 0, unit: '£', max: 5000000 }, { id: 'region', label: 'Where you live', def: 0, options: REGION }, { id: 'plan', label: 'Student loan', def: 0, options: PLAN }],
    run: (v) => { const r = E.selfEmployed({ profit: v.profit, employment: v.wages, region: reg(v.region), plan: plan(v.plan) });
      return { head: ['Put aside', pc(r.setAside)], rows: [['Self Assessment bill', m(r.saBill)], ['A month, over 12 months', m(r.saBill / 12)], ['On a £1,000 invoice (profit)', m(1000 * r.setAside)]] }; },
  },
  side: {
    title: 'Tax on a side business next to a job', cta: 'Full Self Assessment estimate', ctaPage: 'self-assessment-tax-calculator',
    inputs: [{ id: 'wages', label: 'Salary from your job', def: 32000, unit: '£', max: 5000000 }, { id: 'profit', label: 'Side business profit', def: 8000, unit: '£', max: 5000000 }, { id: 'region', label: 'Where you live', def: 0, options: REGION }],
    run: (v) => { const r = E.selfEmployed({ profit: v.profit, employment: v.wages, region: reg(v.region) });
      return { head: ['Extra to pay HMRC', m(r.saBill)], rows: [['Income Tax on the side profit', m(r.itViaSA)], ['Class 4', m(r.class4.total)], ['Kept from the side profit', m(v.profit - r.saBill)]] }; },
  },
  'mtd-q': {
    title: 'Your quarterly update deadlines', cta: 'Check when MTD applies to you', ctaPage: 'making-tax-digital',
    inputs: [{ id: 'start', label: 'First MTD tax year', def: 2026, options: [2026, 2027, 2028].map((y) => ({ value: String(y), label: `${y}/${String((y + 1) % 100).padStart(2, '0')}` })) }, { id: 'cal', label: 'Update periods', def: 0, options: [{ value: '0', label: 'Standard (to the 5th)' }, { value: '1', label: 'Calendar (month end)' }] }],
    run: (v) => { const y = v.start; const yr = [y, y + 1, y + 1, y + 1];
      const rows = P.mtd.quarters.map((q, i) => [`${v.cal === 1 ? q.calendar : q.standard}`, `${q.deadline} ${i === 0 || i === 1 ? y : yr[i]}`] as [string, string]);
      return { head: ['Tax return and payment', `31 January ${y + 2}`], rows }; },
  },
  qualifying: {
    title: 'Your qualifying income for Making Tax Digital', cta: 'See your start date', ctaPage: 'making-tax-digital',
    inputs: [{ id: 'se', label: 'Self-employed turnover (before expenses)', def: 26000, unit: '£', max: 50000000 }, { id: 'prop', label: 'Your share of rent received', def: 9000, unit: '£', max: 50000000 }, { id: 'year', label: 'Tax year of these figures', def: 1, options: P.mtd.stages.map((s, i) => ({ value: String(i), label: s.basisYear })) }],
    run: (v) => { const q = v.se + v.prop; const st = P.mtd.stages[v.year];
      return { head: ['Qualifying income', m(q)], rows: [['Threshold for that year', m(st.threshold)], ['Result', q > st.threshold ? `MTD from ${d(st.start)}` : 'under this threshold'], ['Not counted', 'wages, dividends, pensions, partnership shares']] }; },
  },
  'ir35-quick': {
    title: 'Inside or outside IR35: the difference', cta: 'Full IR35 and umbrella calculator', ctaPage: 'ir35-calculator',
    inputs: [{ id: 'rate', label: 'Day rate', def: 450, unit: '£', max: 10000 }, { id: 'days', label: 'Days a year', def: 220, unit: 'days', max: 366 }],
    run: (v) => { const r = E.ir35({ dayRate: v.rate, days: v.days, region: 'ruk', umbrellaMarginWeekly: 20, weeks: 46, levy: true });
      const g = r.outside.takeHome - r.inside.takeHome;
      return { head: [g >= 0 ? 'Outside IR35 leaves you more by' : 'Inside IR35 leaves you more by', m(Math.abs(g))], rows: [['Outside, own company', m(r.outside.takeHome)], ['Inside, deemed employment', m(r.inside.takeHome)], ['Umbrella (£20 a week margin)', m(r.umbrella.takeHome)]], note: 'Inside assumes the fee-payer pays employer NI on top of your rate. England, Wales or NI rates.' }; },
  },
  expenses: {
    title: 'What an allowable expense saves you', cta: 'Full calculator', ctaPage: 'home',
    inputs: [{ id: 'turnover', label: 'Turnover', def: 52000, unit: '£', max: 50000000 }, { id: 'exp', label: 'Allowable expenses', def: 6000, unit: '£', max: 50000000 }, { id: 'region', label: 'Where you live', def: 0, options: REGION }],
    run: (v) => { const a = E.selfEmployed({ profit: v.turnover, region: reg(v.region) }), b = E.selfEmployed({ profit: v.turnover - v.exp, region: reg(v.region) });
      return { head: ['Tax and NI saved', m(a.saBill - b.saBill)], rows: [['Profit after expenses', m(v.turnover - v.exp)], ['Saved per £100 of expense', m(v.exp > 0 ? (100 * (a.saBill - b.saBill)) / v.exp : 0)], ['Bill after expenses', m(b.saBill)]] }; },
  },
  cash: {
    title: 'Cash basis or traditional accounting: profit for the year', cta: 'Tax on that profit', ctaPage: 'home',
    inputs: [{ id: 'received', label: 'Money received in the year', def: 40000, unit: '£', max: 50000000 }, { id: 'unpaid', label: 'Invoices sent, not paid by year end', def: 5000, unit: '£', max: 50000000 }, { id: 'paid', label: 'Expenses paid', def: 8000, unit: '£', max: 50000000 }, { id: 'owed', label: 'Bills received, not yet paid', def: 1000, unit: '£', max: 50000000 }],
    run: (v) => { const cash = v.received - v.paid, trad = v.received + v.unpaid - v.paid - v.owed;
      return { head: ['Profit on the cash basis', m(cash)], rows: [['Traditional accounting', m(trad)], ['Difference taxed later or now', m(trad - cash)]] }; },
  },
  software: {
    title: 'How many MTD submissions a year?', cta: 'Your deadlines', ctaPage: 'mtd-quarterly-deadlines',
    inputs: [{ id: 'se', label: 'Self-employment businesses', def: 1, max: 20 }, { id: 'prop', label: 'Property businesses', def: 0, max: 5 }],
    run: (v) => { const n = Math.max(0, v.se) + Math.max(0, v.prop);
      return { head: ['Quarterly updates a year', String(n * 4)], rows: [['Tax return', n > 0 ? '1, through the software' : 'none'], ['Late update points from', 'the 2027/28 tax year'], ['Penalty after', `${P.mtd.penalties.pointThreshold} points: ${m(P.mtd.penalties.submissionPenalty)}`]] }; },
  },
  hicbc: {
    title: 'Child Benefit charge on a self-employed income', cta: 'Your full Self Assessment bill', ctaPage: 'home',
    inputs: [{ id: 'income', label: 'Adjusted net income (profit + other income − pension)', def: 68000, unit: '£', max: 5000000 }, { id: 'kids', label: 'Children you get Child Benefit for', def: 2, max: 12 }],
    run: (v) => { const r = E.childBenefitCharge(v.income, v.kids);
      return { head: ['Charge to pay back', m(r.charge)], rows: [['Child Benefit for the year', m(r.benefit)], ['Share paid back', `${r.pct} %`], ['Kept', m(r.benefit - r.charge)]], note: 'Paid through Self Assessment by the partner with the higher adjusted net income.' }; },
  },
  'sa-dates': {
    title: 'Self Assessment dates for a tax year', cta: 'Estimate the bill', ctaPage: 'home',
    inputs: [{ id: 'year', label: 'Tax year', def: 2026, options: [2025, 2026, 2027].map((y) => ({ value: String(y), label: `${y}/${String((y + 1) % 100).padStart(2, '0')}` })) }],
    run: (v) => { const c = E.saCalendar(v.year);
      return { head: ['Online return and payment', d(c.online)], rows: [['Tax year ends', d(c.yearEnd)], ['Register if new', d(c.registerBy)], ['Paper return', d(c.paper)], ['Online, to pay through your tax code', d(c.codingOut)], ['Second payment on account', d(c.secondPoa)]] }; },
  },
  sa302: {
    title: 'What your tax calculation will show', cta: 'Full calculator with loans', ctaPage: 'self-assessment-tax-calculator',
    inputs: [{ id: 'turnover', label: 'Turnover', def: 30000, unit: '£', max: 50000000 }, { id: 'exp', label: 'Expenses', def: 4000, unit: '£', max: 50000000 }, { id: 'wages', label: 'Wages (P60)', def: 18000, unit: '£', max: 5000000 }, { id: 'paye', label: 'Tax deducted (P60)', def: 1086, unit: '£', max: 5000000 }, { id: 'region', label: 'Where you live', def: 0, options: REGION }],
    run: (v) => { const r = E.selfEmployed({ profit: Math.max(0, v.turnover - v.exp), employment: v.wages, region: reg(v.region) }); const due = r.it.tax + r.class4.total - v.paye;
      return { head: [due >= 0 ? 'Balance to pay' : 'Repayment due to you', m(Math.abs(due))], rows: [['Income Tax on all income', m(r.it.tax)], ['Class 4', m(r.class4.total)], ['Less tax already deducted', m(v.paye)]], note: 'Before payments on account and any student loan.' }; },
  },
};

export function getSpec(kind: string, _lang = 'en'): MiniSpec {
  const s = SPECS[kind];
  if (!s) throw new Error(`Unknown mini-calculator: ${kind}`);
  return s;
}
export const SPEC_IDS = Object.keys(SPECS);
