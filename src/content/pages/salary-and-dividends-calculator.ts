import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

const PROFIT = 60000;

/** Profit (step £1,000) from which the best salary reaches the Personal Allowance, and the first one above where it drops back. */
let memo: { reach: number | null; drop: number | null } | null = null;
function turns(h: Helpers) {
  if (memo) return memo;
  const PT = h.P.class1.primaryThreshold;
  let reach: number | null = null, drop: number | null = null;
  for (let p = 10000; p <= 300000; p += 1000) {
    const b = h.E.bestSalary(p, 'ruk');
    if (reach === null && b >= PT) reach = p;
    else if (reach !== null && b < PT) { drop = p; break; }
  }
  memo = { reach, drop };
  return memo;
}

export default definePage({
  id: 'salary-and-dividends-calculator',
  group: 'company',
  order: 44,
  tool: { kind: 'mini:salary', props: { profit: PROFIT, region: 0 } },
  related: ['limited-company-tax-calculator', 'dividend-tax-calculator', 'limited-company-vs-sole-trader', 'corporation-tax-calculator'],
  sources: ['gov_employers_2627', 'gov_employment_allowance', 'gov_nic_rates', 'gov_dividends', 'gov_ct_rates_pub', 'gov_directors'],
  slug: 'salary-and-dividends-calculator',
  nav: 'Director’s salary',
  card: '£5,000, £6,708 or £12,570? The director’s salary that leaves the most in 2026/27, and why.',
  title: 'Salary and Dividends Calculator 2026/27: Best Director Pay',
  description: 'Best director’s salary for 2026/27: £5,000, £6,708 or £12,570 with dividends, employer NI without Employment Allowance, and your National Insurance record.',
  h1: 'Salary and dividends: the best director’s salary for 2026/27',
  intro: 'Three salary levels keep coming up for one-person companies; the engine tests every level in between as well.',
  resume: (h) => {
    const C = h.P.class1;
    const best = h.E.bestSalary(PROFIT, 'ruk');
    const at = (s: number) => h.E.limitedCompany({ profit: PROFIT, salary: s, region: 'ruk' }).takeHome;
    return `For a sole director whose company makes ${h.m(PROFIT)} before their pay, the salary that leaves the most cash in ${h.P.taxYear} is ${h.m(best)}, giving ${h.m(at(best))} after all taxes when the rest is paid as dividends. A salary of ${h.m(C.lowerEarningsLimit)}, the lower earnings limit, leaves ${h.m(at(C.lowerEarningsLimit))}, and ${h.m(C.secondaryThreshold)}, the point where employer National Insurance starts, leaves ${h.m(at(C.secondaryThreshold))}. The Personal Allowance level wins even though the company pays employer National Insurance at ${h.pc(C.employerRate)} on the slice above ${h.m(C.secondaryThreshold)}, with no Employment Allowance to absorb it when the director is the only employee. The reason is that salary is deductible for Corporation Tax and, up to ${h.m(C.primaryThreshold)}, carries no employee National Insurance or Income Tax, while the same money paid as a dividend would bear Corporation Tax first. Any salary from ${h.m(C.lowerEarningsLimit)} also keeps the year on your National Insurance record.`;
  },
  faqs: (h) => {
    const C = h.P.class1;
    const at = (s: number) => h.E.limitedCompany({ profit: PROFIT, salary: s, region: 'ruk' });
    const a = at(C.primaryThreshold), b = at(C.secondaryThreshold);
    const t = turns(h);
    return [
      { q: 'Is a £12,570 or a £5,000 director’s salary better in 2026/27?', a: `On ${h.m(PROFIT)} of company profit, ${h.m(C.primaryThreshold)} leaves ${h.m(a.takeHome)} and ${h.m(C.secondaryThreshold)} leaves ${h.m(b.takeHome)}, so the higher salary is ahead by ${h.m(a.takeHome - b.takeHome)} despite ${h.m(a.employerNI)} of employer National Insurance. A lower salary only comes out ahead in parts of the very high profit range${t.drop ? `, first from about ${h.m(t.drop)}` : ''}, where income passes the point at which the Personal Allowance is withdrawn.` },
      { q: 'Does a director’s salary of £6,708 count towards the State Pension?', a: `Yes. ${h.m(C.lowerEarningsLimit)} is the lower earnings limit for ${h.P.taxYear}. HMRC’s rates table says employees earning between it and the primary threshold of ${h.m(C.primaryThreshold)} pay no National Insurance but get the benefits of paying, which includes a qualifying year for the State Pension. A salary below ${h.m(C.lowerEarningsLimit)} does not earn that benefit.` },
      { q: 'Why does the best salary fall when company profit is very high?', a: `Because total income then passes ${h.m(h.P.incomeTax.taperStart)}, where the Personal Allowance is withdrawn at £1 for every ${h.m(1 / h.P.incomeTax.taperRate)} above it. Once part of the allowance is gone, salary above ${h.m(C.secondaryThreshold)} no longer comes tax-free, yet still costs employer National Insurance at ${h.pc(C.employerRate)}. Across part of that range the engine therefore moves the salary down towards ${h.m(C.secondaryThreshold)}.` },
    ];
  },
  body: (h) => {
    const C = h.P.class1;
    const levels = [0, C.secondaryThreshold, C.lowerEarningsLimit, C.primaryThreshold, 20000];
    const profits = [30000, 60000, 100000, 150000];
    const rows = levels.map((s) => [h.m(s), ...profits.map((p) => h.m(h.E.limitedCompany({ profit: p, salary: s, region: 'ruk' }).takeHome))]);
    rows.push(['Best found', ...profits.map((p) => h.m(h.E.bestSalary(p, 'ruk')))]);
    const t = turns(h);
    const hi = h.E.limitedCompany({ profit: PROFIT, salary: C.primaryThreshold, region: 'ruk' });
    const lo = h.E.limitedCompany({ profit: PROFIT, salary: C.lowerEarningsLimit, region: 'ruk' });
    const extra = C.primaryThreshold - C.lowerEarningsLimit;
    return `
<h2>Five salaries at four levels of profit</h2>
<p>Each cell is the cash the director ends up with when every pound left after Corporation Tax is paid out as a dividend. The last line is the salary the engine finds best after testing every level in steps of ${h.m(50)}.</p>
${h.table(['Salary', ...profits.map((p) => `Profit ${h.m(p)}`)], rows, `${h.P.taxYear}, England, Wales or Northern Ireland, one director and no other employee.`, ['l', 'r', 'r', 'r', 'r'])}
<p>A salary of ${h.m(20000)} is worse everywhere: above ${h.m(C.primaryThreshold)} the director starts paying employee National Insurance at ${h.pc(C.employeeMain)} and Income Tax at the basic rate, while a dividend of the same cost pays only Corporation Tax and ${h.pc(h.P.dividends.basic)}. In this engine the Personal Allowance salary is best from about ${h.m(t.reach ?? 0)} of profit${t.drop ? ` up to about ${h.m(t.drop - 1000)}` : ''}.</p>
<h2>The arithmetic of the last ${h.m(extra)}</h2>
<p>Moving from ${h.m(C.lowerEarningsLimit)} to ${h.m(C.primaryThreshold)} adds ${h.m(extra)} of salary. The company pays ${h.m(hi.employerNI - lo.employerNI)} more employer National Insurance, but both the salary and that National Insurance come off its taxable profit, so Corporation Tax drops by ${h.m(lo.ct.tax - hi.ct.tax)}. The director receives the ${h.m(extra)} free of Income Tax and employee National Insurance and takes fewer dividends, yet the dividend tax ${hi.it.tax >= lo.it.tax ? 'rises' : 'falls'} by ${h.m(Math.abs(hi.it.tax - lo.it.tax))}${hi.it.tax >= lo.it.tax ? ': with the lower salary, the unused part of the Personal Allowance was covering dividends instead' : ''}. Net effect on ${h.m(PROFIT)} of profit: ${h.m(hi.takeHome - lo.takeHome)} more in the director’s pocket.</p>
<h2>No Employment Allowance for one director</h2>
<p>Eligible employers can take up to ${h.m(C.employmentAllowance)} off their employer National Insurance bill each year. GOV.UK excludes a company whose only director is also the only employee liable for secondary Class 1 contributions (${h.src('gov_employment_allowance', 'Employment Allowance eligibility')}). Taking on an employee paid above ${h.m(C.secondaryThreshold)} takes the company out of that exclusion. Without the allowance, every pound of salary above ${h.m(C.secondaryThreshold)} costs the company ${h.pc(C.employerRate)} more, which the table already includes.</p>
<h2>Paying the salary</h2>
<p>A salary means a PAYE scheme. Directors pay National Insurance on their annual earnings rather than period by period, so a single payment at the year end and twelve monthly payments give the same contributions. The salary must be reported to HMRC on each payroll run. Dividends are paid separately, after a directors’ meeting, and taxed through Self Assessment; the ${h.a('dividend-tax-calculator', 'dividend tax calculator')} shows how they stack on top of the salary.</p>
${h.box('Thresholds used', `<p>Secondary threshold ${h.m(C.secondaryThreshold)}, lower earnings limit ${h.m(C.lowerEarningsLimit)}, primary threshold ${h.m(C.primaryThreshold)}, employer rate ${h.pc(C.employerRate)}, employee rate ${h.pc(C.employeeMain)} (${h.src('gov_employers_2627', 'HMRC rates and thresholds for employers')}).</p>`, 'info')}`;
  },
});
