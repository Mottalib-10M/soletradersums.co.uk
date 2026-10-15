/**
 * Tax engine for the 2026/27 UK tax year (6 April 2026 to 5 April 2027). Pure functions, no I/O.
 * Every rate, band and threshold is read from `src/data/params-2026.json` (GOV.UK and HMRC pages,
 * read on 2026-10-15). Amounts are kept to the penny; pages round only when they display.
 * Tests: tests/tax.test.ts (GOV.UK worked examples and hand-checked cases).
 */
import { P } from './params';

export type Region = 'ruk' | 'scotland';
export type Plan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5';

export interface Slice { name: string; rate: number; amount: number; tax: number }

const pos = (x: number) => (x > 0 ? x : 0);
const IT = P.incomeTax;
const bandsOf = (region: Region) => (region === 'scotland' ? IT.scotland.bands : IT.ruk.bands);

/** Personal Allowance after the taper: £1 less for every £2 of adjusted net income over £100,000 (ITA 2007 s.35). */
export function personalAllowance(adjustedNetIncome: number): number {
  if (adjustedNetIncome <= IT.taperStart) return IT.personalAllowance;
  return pos(IT.personalAllowance - Math.floor((adjustedNetIncome - IT.taperStart) * IT.taperRate));
}

/** Splits taxable income (above the allowance) between `from` and `to` into the bands of a region. */
export function bandSlices(from: number, to: number, region: Region): Slice[] {
  const out: Slice[] = [];
  let lower = 0;
  for (const b of bandsOf(region)) {
    const upper = b.upTo ?? Infinity;
    const a = Math.max(lower, from);
    const z = Math.min(upper, to);
    if (z > a) out.push({ name: b.name, rate: b.rate, amount: z - a, tax: (z - a) * b.rate });
    lower = upper;
  }
  return out;
}
const sumTax = (s: Slice[]) => s.reduce((t, x) => t + x.tax, 0);

/** Rate of the band that the next pound of taxable non-savings income falls in. */
export function bandRateAt(taxable: number, region: Region): number {
  let lower = 0;
  for (const b of bandsOf(region)) { const upper = b.upTo ?? Infinity; if (taxable < upper) return b.rate; lower = upper; }
  return bandsOf(region)[bandsOf(region).length - 1].rate;
}

export interface IncomeTaxInput { nonSavings: number; dividends?: number; region: Region; pensionGross?: number }
export interface IncomeTaxResult {
  totalIncome: number; adjustedNetIncome: number; personalAllowance: number;
  nonSavingsTaxable: number; nonSavingsSlices: Slice[]; nonSavingsTax: number;
  dividendTaxable: number; dividendSlices: Slice[]; dividendTax: number;
  pensionExtraRelief: number; tax: number;
}

/**
 * Income Tax on non-savings income (trading profit, wages) and dividends.
 * Order: the Personal Allowance goes against non-savings income first, then dividends; dividends sit
 * on top. Scottish taxpayers pay Scottish rates on non-savings income only: dividends use the UK
 * rates and the UK band limits (GOV.UK, Income Tax in Scotland). The £500 dividend allowance is
 * taxed at 0 % but still uses band space (GOV.UK, Tax on dividends).
 * `pensionGross`: gross personal contributions to a relief-at-source scheme. They lower adjusted net
 * income (Personal Allowance taper) and earn extra relief through Self Assessment on the top slice
 * of income, at the rate paid on it minus the 20 % given at source (GOV.UK, pension tax relief).
 */
export function incomeTax({ nonSavings, dividends = 0, region, pensionGross = 0 }: IncomeTaxInput): IncomeTaxResult {
  const ns = pos(nonSavings), dv = pos(dividends), pen = pos(pensionGross);
  const totalIncome = ns + dv;
  const adjustedNetIncome = pos(totalIncome - pen);
  const pa = personalAllowance(adjustedNetIncome);
  const paNs = Math.min(pa, ns);
  const nonSavingsTaxable = ns - paNs;
  const nonSavingsSlices = bandSlices(0, nonSavingsTaxable, region);
  const nonSavingsTax = sumTax(nonSavingsSlices);
  // Extra relief on the top slice of income, equal to the gross contribution.
  const top = Math.min(pen, nonSavingsTaxable);
  const pensionExtraRelief = bandSlices(nonSavingsTaxable - top, nonSavingsTaxable, region)
    .reduce((t, s) => t + s.amount * pos(s.rate - P.pension.basicRelief), 0);
  // Dividends: UK bands, stacked on top of taxable non-savings income.
  const dividendTaxable = pos(dv - (pa - paNs));
  const basicLimit = IT.ruk.bands[0].upTo as number;
  const higherLimit = IT.ruk.bands[1].upTo as number;
  const D = P.dividends;
  const dividendSlices: Slice[] = [];
  const add = (name: string, rate: number, from: number, to: number) => {
    const amount = pos(to - from);
    if (amount > 0) dividendSlices.push({ name, rate, amount, tax: amount * rate });
  };
  const start = nonSavingsTaxable, end = nonSavingsTaxable + dividendTaxable;
  const allowEnd = Math.min(end, start + D.allowance);
  add('Dividend allowance', 0, start, allowEnd);
  add('Dividend ordinary rate', D.basic, allowEnd, Math.max(allowEnd, Math.min(end, basicLimit)));
  add('Dividend upper rate', D.higher, Math.max(allowEnd, basicLimit), Math.max(Math.max(allowEnd, basicLimit), Math.min(end, higherLimit)));
  add('Dividend additional rate', D.additional, Math.max(allowEnd, higherLimit), end);
  const dividendTax = sumTax(dividendSlices);
  const tax = pos(nonSavingsTax + dividendTax - pensionExtraRelief);
  return { totalIncome, adjustedNetIncome, personalAllowance: pa, nonSavingsTaxable, nonSavingsSlices, nonSavingsTax, dividendTaxable, dividendSlices, dividendTax, pensionExtraRelief, tax };
}

/** Class 4 National Insurance on trading profits: 6 % between the lower and upper profits limits, 2 % above. */
export function class4(profit: number) {
  const C = P.class4;
  const main = pos(Math.min(profit, C.upperProfitsLimit) - C.lowerProfitsLimit) * C.mainRate;
  const upper = pos(profit - C.upperProfitsLimit) * C.upperRate;
  return { main, upper, total: main + upper };
}

/** Class 2: no longer payable. At or above the small profits threshold it is treated as paid; below it, voluntary. */
export function class2(profit: number) {
  const C = P.class2;
  const credited = profit >= C.smallProfitsThreshold;
  return { credited, voluntaryYear: C.weeklyRate * C.weeks, threshold: C.smallProfitsThreshold };
}

/** Employee Class 1 on annual earnings (directors use an annual earnings period). */
export function class1Employee(earnings: number) {
  const C = P.class1;
  return pos(Math.min(earnings, C.upperEarningsLimit) - C.primaryThreshold) * C.employeeMain + pos(earnings - C.upperEarningsLimit) * C.employeeUpper;
}
/** Employer Class 1 above the secondary threshold. */
export function class1Employer(earnings: number) {
  const C = P.class1;
  return pos(earnings - C.secondaryThreshold) * C.employerRate;
}

/** Annual student and postgraduate loan repayment on a yearly income (Self Assessment basis). */
export function studentLoan(income: number, plan: Plan, postgrad = false) {
  const S = P.studentLoans;
  const threshold = plan === 'none' ? 0 : (S as Record<string, number>)[plan];
  const planAmount = plan === 'none' ? 0 : pos(income - threshold) * S.rate;
  const pgAmount = postgrad ? pos(income - S.postgrad) * S.postgradRate : 0;
  return { threshold, plan: planAmount, postgrad: pgAmount, total: planAmount + pgAmount };
}

export interface SEInput { profit: number; region: Region; employment?: number; dividends?: number; plan?: Plan; postgrad?: boolean; pensionGross?: number }
export interface SEResult {
  profit: number; region: Region; employment: number; dividends: number;
  it: IncomeTaxResult; itOnEmployment: number; class4: ReturnType<typeof class4>; class2: ReturnType<typeof class2>;
  employeeNI: number; loan: ReturnType<typeof studentLoan>; loanViaPaye: number;
  /** Income Tax still due through Self Assessment once PAYE on the wages is counted. */
  itViaSA: number;
  /** Total due through Self Assessment: Income Tax not taken by PAYE, Class 4 and loan repayments. */
  saBill: number;
  /** Basis for payments on account: Income Tax and Class 4 through Self Assessment (loans excluded). */
  poaBasis: number;
  poaEach: number;
  poaDue: boolean;
  /** Everything kept after Income Tax, National Insurance and loan repayments, on all income. */
  takeHome: number;
  /** Share of the profit to put aside (Self Assessment bill ÷ profit). */
  setAside: number;
  effectiveRate: number;
}

/**
 * Self-employed person, 2026/27. Wages from a job are taxed through PAYE first, so the profit sits on
 * top of them: the Self Assessment bill is the Income Tax on everything minus the Income Tax on the
 * wages alone (an estimate of what PAYE took with a standard tax code), plus Class 4 on the profit
 * and the loan repayment not already taken from the wages.
 */
export function selfEmployed(input: SEInput): SEResult {
  const profit = pos(input.profit), employment = pos(input.employment ?? 0), dividends = pos(input.dividends ?? 0);
  const { region } = input; const plan = input.plan ?? 'none'; const postgrad = !!input.postgrad;
  const it = incomeTax({ nonSavings: employment + profit, dividends, region, pensionGross: input.pensionGross });
  const itOnEmployment = incomeTax({ nonSavings: employment, region }).tax;
  const c4 = class4(profit), c2 = class2(profit);
  const employeeNI = class1Employee(employment);
  const loan = studentLoan(employment + profit, plan, postgrad);
  const loanViaPaye = studentLoan(employment, plan, postgrad).total;
  const itViaSA = pos(it.tax - itOnEmployment);
  const poaBasis = itViaSA + c4.total;
  const atSourceShare = it.tax + c4.total > 0 ? itOnEmployment / (it.tax + c4.total) : 0;
  const poaDue = poaBasis >= P.paymentsOnAccount.minBill && atSourceShare <= P.paymentsOnAccount.atSourceShare;
  const saBill = itViaSA + c4.total + pos(loan.total - loanViaPaye);
  const takeHome = employment + profit + dividends - it.tax - c4.total - employeeNI - loan.total;
  return {
    profit, region, employment, dividends, it, itOnEmployment, class4: c4, class2: c2, employeeNI, loan, loanViaPaye,
    itViaSA, saBill, poaBasis, poaEach: poaDue ? poaBasis / 2 : 0, poaDue, takeHome,
    setAside: profit > 0 ? saBill / profit : 0,
    effectiveRate: profit + employment + dividends > 0 ? (it.tax + c4.total + employeeNI) / (profit + employment + dividends) : 0,
  };
}

/** Tax, Class 4 and loan on the next £step of profit, as a share of it. */
export function marginalOnProfit(input: SEInput, step = 100): number {
  const a = selfEmployed(input), b = selfEmployed({ ...input, profit: input.profit + step });
  return (b.saBill - a.saBill) / step;
}

/** Corporation Tax for a financial year from 1 April 2026: 19 % to £50,000, 25 % from £250,000, marginal relief between. */
export function corporationTax(profit: number, associated = 0, months = 12) {
  const C = P.corporationTax;
  const share = (months / 12) / (associated + 1);
  const lower = C.lowerLimit * share, upper = C.upperLimit * share;
  const N = pos(profit);
  let tax: number, relief = 0, band: 'small' | 'marginal' | 'main';
  if (N <= lower) { tax = N * C.smallRate; band = 'small'; }
  else if (N >= upper) { tax = N * C.mainRate; band = 'main'; }
  else { relief = (C.fractionNum / C.fractionDen) * (upper - N); tax = N * C.mainRate - relief; band = 'marginal'; }
  return { tax, relief, band, lower, upper, effectiveRate: N > 0 ? tax / N : 0 };
}

export interface LtdInput { profit: number; salary: number; region: Region; drawShare?: number; extraCosts?: number }
export interface LtdResult {
  profit: number; salary: number; employerNI: number; employeeNI: number; companyProfit: number; ct: ReturnType<typeof corporationTax>;
  afterCT: number; dividends: number; retained: number; it: IncomeTaxResult; takeHome: number; totalTax: number;
}

/**
 * One-director company with no other employee paid above the secondary threshold: no Employment
 * Allowance (GOV.UK eligibility). Salary and employer NI are deductible; the rest is taxed to
 * Corporation Tax; the director draws `drawShare` of what is left as dividends.
 */
export function limitedCompany({ profit, salary, region, drawShare = 1, extraCosts = 0 }: LtdInput): LtdResult {
  const P0 = pos(profit - extraCosts);
  const s = Math.min(pos(salary), maxSalary(P0));
  const employerNI = class1Employer(s);
  const companyProfit = pos(P0 - s - employerNI);
  const ct = corporationTax(companyProfit);
  const afterCT = companyProfit - ct.tax;
  const share = Math.min(1, Math.max(0, drawShare));
  const dividends = afterCT * share;
  const retained = afterCT - dividends;
  const it = incomeTax({ nonSavings: s, dividends, region });
  const employeeNI = class1Employee(s);
  const takeHome = s - employeeNI + dividends - it.tax;
  return { profit, salary: s, employerNI, employeeNI, companyProfit, ct, afterCT, dividends, retained, it, takeHome, totalTax: employerNI + employeeNI + ct.tax + it.tax };
}
/** Largest salary the company can pay with its employer NI out of `profit`. */
export function maxSalary(profit: number): number {
  const C = P.class1;
  if (profit <= C.secondaryThreshold) return profit;
  return (profit + C.employerRate * C.secondaryThreshold) / (1 + C.employerRate);
}

/** Salary that leaves the director the most cash when all profit is drawn, searched on a £50 grid plus the thresholds. */
export function bestSalary(profit: number, region: Region, extraCosts = 0): number {
  const P0 = pos(profit - extraCosts);
  const cap = Math.min(maxSalary(P0), P.class1.upperEarningsLimit);
  const C = P.class1;
  const cands = new Set<number>([0, C.secondaryThreshold, C.lowerEarningsLimit, C.primaryThreshold, IT.personalAllowance, cap]);
  for (let s = 0; s <= cap; s += 50) cands.add(s);
  let best = 0, bestCash = -Infinity;
  for (const s of [...cands].filter((x) => x <= cap).sort((a, b) => a - b)) {
    const r = limitedCompany({ profit, salary: s, region, extraCosts });
    if (r.takeHome > bestCash + 0.005) { bestCash = r.takeHome; best = s; }
  }
  return best;
}

export interface CompareInput { profit: number; region: Region; drawShare?: number; extraCosts?: number; salary?: number | 'best' }
export function compareStructures({ profit, region, drawShare = 1, extraCosts = 0, salary = 'best' }: CompareInput) {
  const sole = selfEmployed({ profit, region });
  const soleTakeHome = sole.takeHome;
  const s = salary === 'best' ? bestSalary(profit, region, extraCosts) : salary;
  const ltd = limitedCompany({ profit, salary: s, region, drawShare, extraCosts });
  const ltdAll = limitedCompany({ profit, salary: s, region, drawShare: 1, extraCosts });
  return { sole, soleTakeHome, ltd, ltdAll, salary: s, gapAllDrawn: ltdAll.takeHome - soleTakeHome };
}

/** Profit at which a company drawn in full first leaves more cash than a sole trader (step £500), or null. */
export function crossover(region: Region, extraCosts = 0, from = 5000, to = 300000, step = 500): number | null {
  for (let p = from; p <= to; p += step) if (compareStructures({ profit: p, region, extraCosts }).gapAllDrawn > 0) return p;
  return null;
}

export interface Ir35Input { dayRate: number; days: number; expenses?: number; region: Region; plan?: Plan; postgrad?: boolean; umbrellaMarginWeekly?: number; weeks?: number; levy?: boolean }
/**
 * Three ways to be paid for the same contract:
 * outside IR35 through your own company (best salary, everything drawn as dividends);
 * inside IR35 through your company: the fee-payer treats the fee as employment income and deducts
 *   PAYE Income Tax and employee NI; employer NI is the fee-payer's own cost (shown, not deducted);
 *   loans are repaid through Self Assessment (HMRC, Understanding off-payroll working);
 * through an umbrella: the umbrella takes its margin and its employer costs (employer NI, and the
 *   Apprenticeship Levy if it passes it on) out of the assignment rate, then runs PAYE.
 */
export function ir35(i: Ir35Input) {
  const fee = pos(i.dayRate) * pos(i.days);
  const exp = pos(i.expenses ?? 0);
  const plan = i.plan ?? 'none';
  const outsideSalary = bestSalary(fee - exp, i.region);
  const outside = limitedCompany({ profit: fee - exp, salary: outsideSalary, region: i.region });
  const insideIT = incomeTax({ nonSavings: fee, region: i.region }).tax;
  const insideNI = class1Employee(fee);
  const insideLoan = studentLoan(fee, plan, !!i.postgrad).total;
  const inside = { gross: fee, incomeTax: insideIT, employeeNI: insideNI, loan: insideLoan, takeHome: fee - insideIT - insideNI - insideLoan, employerNIOnTop: class1Employer(fee) };
  const margin = pos(i.umbrellaMarginWeekly ?? 0) * pos(i.weeks ?? 0);
  const avail = pos(fee - margin);
  const levy = i.levy ? P.class1.apprenticeshipLevy : 0;
  const C = P.class1;
  let gross = avail / (1 + levy);
  if (gross > C.secondaryThreshold) gross = (avail + C.employerRate * C.secondaryThreshold) / (1 + C.employerRate + levy);
  const uIT = incomeTax({ nonSavings: gross, region: i.region }).tax;
  const uNI = class1Employee(gross);
  const uLoan = studentLoan(gross, plan, !!i.postgrad).total;
  const umbrella = { assignment: fee, margin, employerNI: class1Employer(gross), levy: gross * levy, gross, incomeTax: uIT, employeeNI: uNI, loan: uLoan, takeHome: gross - uIT - uNI - uLoan };
  const outsideLoan = studentLoan(outside.salary, plan, !!i.postgrad).total;
  return { fee, expenses: exp, outside: { ...outside, loanNote: outsideLoan }, inside, umbrella };
}

/** First tax year in which Making Tax Digital for Income Tax applies, from qualifying income (turnover) of each basis year. */
export function mtdStart(qualifying: { y2425: number; y2526: number; y2627: number }) {
  const v = [qualifying.y2425, qualifying.y2526, qualifying.y2627];
  const i = P.mtd.stages.findIndex((s, k) => v[k] > s.threshold);
  return i < 0 ? null : { ...P.mtd.stages[i], index: i };
}

/** Days between two ISO dates. */
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/** Tax year (first calendar year) that contains an ISO date: 6 April starts the year. */
export function taxYearOf(dateIso: string): number {
  const [y, m, d] = dateIso.split('-').map(Number);
  return m > 4 || (m === 4 && d >= 6) ? y : y - 1;
}

/** Deadlines that follow from starting to trade on a given date (GOV.UK, register for Self Assessment). */
export function firstYearDeadlines(startIso: string) {
  const ty = taxYearOf(startIso);
  return {
    taxYear: `${ty}/${String((ty + 1) % 100).padStart(2, '0')}`,
    taxYearEnd: iso(ty + 1, 4, 5),
    registerBy: iso(ty + 1, 10, 5),
    paperReturn: iso(ty + 1, 10, 31),
    onlineReturn: iso(ty + 2, 1, 31),
    firstPayment: iso(ty + 2, 1, 31),
    secondPoa: iso(ty + 2, 7, 31),
  };
}

/** Self Assessment penalties outside Making Tax Digital (GOV.UK, Self Assessment penalties). */
export function saPenalties(taxDue: number, daysLateFiling: number, daysLatePayment: number) {
  const S = P.selfAssessment.penalties;
  const T = pos(taxDue);
  const f = pos(daysLateFiling), p = pos(daysLatePayment);
  const initial = f > 0 ? S.initial : 0;
  const daily = f > 91 ? Math.min(S.dailyMax, S.daily * Math.min(90, f - 91)) : 0;
  const six = f > 182 ? Math.max(S.sixMonthMin, S.sixMonthRate * T) : 0;
  const twelve = f > 365 ? Math.max(S.twelveMonthMin, S.twelveMonthRate * T) : 0;
  const payCount = (p > 30 ? 1 : 0) + (p > 182 ? 1 : 0) + (p > 365 ? 1 : 0);
  const payment = payCount * S.latePaymentRate * T;
  return { initial, daily, six, twelve, filing: initial + daily + six + twelve, payment, total: initial + daily + six + twelve + payment };
}

/** Late payment penalty under Making Tax Digital for Income Tax (GOV.UK, Penalties for MTD for Income Tax). */
export function mtdLatePayment(taxOwed: number, daysLate: number, year: '2026/27' | '2027/28', firstYear: boolean) {
  const M = P.mtd.penalties;
  const r = year === '2026/27' ? M.y2627 : M.y2728;
  const T = pos(taxOwed), d = pos(daysLate);
  let day15 = 0, day30 = 0, daily = 0;
  if (d > 15 && d <= 30) day15 = firstYear ? 0 : r.day15 * T;
  if (d > 30) {
    day15 = r.day15 * T; day30 = r.day30 * T;
    daily = T * M.annualRate * (Math.min(d, 30 + 365 * M.annualMaxYears) - 30) / 365;
  }
  return { day15, day30, daily, total: day15 + day30 + daily };
}

/** Trading allowance against actual expenses: the lower taxable profit wins. */
export function tradingAllowance(gross: number, expenses: number) {
  const A = P.tradingAllowance.amount;
  const g = pos(gross), e = pos(expenses);
  const withExpenses = pos(g - e), withAllowance = pos(g - Math.min(A, g));
  return { exempt: g <= A, withExpenses, withAllowance, best: withAllowance < withExpenses ? 'allowance' as const : 'expenses' as const, profit: Math.min(withExpenses, withAllowance) };
}

/** Simplified expenses: mileage flat rates for 2026/27 and the working-from-home flat rate. */
export function simplifiedExpenses(carMiles: number, motorcycleMiles: number, monthsHome: [number, number, number]) {
  const S = P.simplified;
  const m = pos(carMiles);
  const car = Math.min(m, S.milesBand) * S.carFirst10k + pos(m - S.milesBand) * S.carAfter10k;
  const carOld = Math.min(m, S.milesBand) * S.carFirst10kBefore + pos(m - S.milesBand) * S.carAfter10k;
  const moto = pos(motorcycleMiles) * S.motorcycle;
  const home = monthsHome.reduce((t, n, k) => t + pos(n) * S.home[k].perMonth, 0);
  return { car, carOld, moto, home, total: car + moto + home };
}

/** High Income Child Benefit Charge: 1 % of the year's Child Benefit for every £200 of adjusted net income over £60,000 (GOV.UK). */
export function childBenefitCharge(adjustedNetIncome: number, children: number) {
  const H = P.hicbc;
  const n = Math.max(0, Math.floor(children));
  const benefit = n === 0 ? 0 : (H.eldestWeekly + (n - 1) * H.otherWeekly) * H.weeks;
  const pct = Math.min(100, Math.floor(pos(adjustedNetIncome - H.start) / H.stepPerPercent));
  return { benefit, pct, charge: (benefit * pct) / 100 };
}

/** Self Assessment calendar of a tax year (first calendar year `y`): GOV.UK deadlines. */
export function saCalendar(y: number) {
  return {
    taxYear: `${y}/${String((y + 1) % 100).padStart(2, '0')}`,
    yearEnd: iso(y + 1, 4, 5),
    registerBy: iso(y + 1, 10, 5),
    paper: iso(y + 1, 10, 31),
    codingOut: iso(y + 1, 12, 30),
    online: iso(y + 2, 1, 31),
    payment: iso(y + 2, 1, 31),
    secondPoa: iso(y + 2, 7, 31),
  };
}
