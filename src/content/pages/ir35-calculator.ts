import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

const RATE = 450;
const DAYS = 220;
const EXP = 2000;
const MARGIN = 20;
const WEEKS = 46;

const run = (h: Helpers, rate: number, region: 'ruk' | 'scotland' = 'ruk') =>
  h.E.ir35({ dayRate: rate, days: DAYS, expenses: EXP, region, umbrellaMarginWeekly: MARGIN, weeks: WEEKS, levy: true });

/** Lowest whole day rate at which a route reaches a target take-home. */
function matchRate(h: Helpers, target: number, route: 'inside' | 'umbrella') {
  for (let d = 100; d <= 3000; d += 1) if (run(h, d)[route].takeHome >= target) return d;
  return null;
}

export default definePage({
  id: 'ir35-calculator',
  group: 'contractors',
  order: 51,
  tool: { kind: 'ir35', props: { rate: RATE, days: DAYS } },
  related: ['ir35', 'umbrella-company-calculator', 'limited-company-tax-calculator', 'salary-and-dividends-calculator'],
  sources: ['gov_ir35', 'gov_employers_2627', 'gov_dividends', 'gov_ct_rates_pub', 'gov_umbrella', 'gov_student_loan_repay'],
  slug: 'ir35-calculator',
  nav: 'IR35 calculator',
  card: 'Take-home inside IR35, outside it and through an umbrella, with the day rates that break even.',
  title: 'IR35 Calculator 2026/27: Inside, Outside and Umbrella Pay',
  description: 'IR35 calculator for 2026/27: take-home inside IR35, outside through your company and via an umbrella, plus the day rate each route needs to match the others.',
  h1: 'IR35 calculator: inside, outside or umbrella',
  intro: 'One day rate, three ways of being paid, and the rate each would need to leave you the same.',
  resume: (h) => {
    const x = run(h, RATE);
    const inMatch = matchRate(h, x.outside.takeHome, 'inside');
    const umMatch = matchRate(h, x.outside.takeHome, 'umbrella');
    return `On ${h.m(RATE)} a day for ${DAYS} days in ${h.P.taxYear}, with ${h.m(EXP)} of company costs, a contractor keeps ${h.m(x.outside.takeHome)} outside IR35 through their own company, ${h.m(x.inside.takeHome)} inside IR35 with the fee-payer deducting PAYE, and ${h.m(x.umbrella.takeHome)} through an umbrella company charging ${h.m(MARGIN)} a week. The gap between the last two is employer National Insurance: inside IR35 the deemed employer pays it on top of the fee, while an umbrella takes ${h.m(x.umbrella.employerNI)} of it, plus the Apprenticeship Levy and its margin, out of the assignment rate. Turned into break-even rates, matching the outside figure takes ${inMatch ? h.m(inMatch) : 'more than ' + h.m(3000)} a day inside IR35 and ${umMatch ? h.m(umMatch) : 'more than ' + h.m(3000)} a day through an umbrella. With the ${h.P.taxYear} dividend rates and Corporation Tax, the outside route has lost much of its old lead, so the rate offered for each kind of role matters more than the label.`;
  },
  faqs: (h) => {
    const x = run(h, RATE);
    const f = run(h, 500);
    const inMatch = matchRate(h, x.outside.takeHome, 'inside');
    const s = run(h, RATE, 'scotland');
    return [
      { q: 'What day rate inside IR35 matches £450 a day outside?', a: `About ${inMatch ? h.m(inMatch) : 'n/a'} a day, over ${DAYS} days with ${h.m(EXP)} of company costs on the outside side. Outside, ${h.m(RATE)} leaves ${h.m(x.outside.takeHome)} after Corporation Tax and dividend tax; inside, PAYE comes straight off the fee and the deemed employer pays employer National Insurance on top. No student loan is assumed.` },
      { q: 'How much is £500 a day inside IR35 after tax?', a: `${h.m(f.inside.takeHome)} a year over ${DAYS} days in England, Wales or Northern Ireland: ${h.m(f.fee)} of fees, less ${h.m(f.inside.incomeTax)} of Income Tax and ${h.m(f.inside.employeeNI)} of employee National Insurance, with no student loan. The deemed employer adds ${h.m(f.inside.employerNIOnTop)} of employer National Insurance at its own cost.` },
      { q: 'Why is umbrella take-home lower than inside IR35 at the same rate?', a: `Because the umbrella is your employer and takes its employer National Insurance, the Apprenticeship Levy if passed on and its margin out of the assignment rate before your gross pay is set. At ${h.m(RATE)} a day that is ${h.m(x.umbrella.employerNI + x.umbrella.levy + x.umbrella.margin)} a year, so the umbrella leaves ${h.m(x.umbrella.takeHome)} against ${h.m(x.inside.takeHome)}.` },
      { q: 'Does living in Scotland change an IR35 calculation?', a: `Yes, inside IR35 and through an umbrella, because the whole fee is taxed at Scottish rates as employment income: ${h.m(s.inside.takeHome)} inside at ${h.m(RATE)} a day, against ${h.m(x.inside.takeHome)} elsewhere. Outside IR35, with the salary inside the Personal Allowance and dividends taxed at UK rates, ${Math.round(s.outside.takeHome) === Math.round(x.outside.takeHome) ? `the figure does not move: ${h.m(x.outside.takeHome)}` : `the gap is smaller: ${h.m(s.outside.takeHome)} against ${h.m(x.outside.takeHome)}`}.` },
    ];
  },
  body: (h) => {
    const rates = [300, 400, 450, 500, 600, 750];
    const rows = rates.map((d) => { const x = run(h, d);
      const best = Math.max(x.outside.takeHome, x.inside.takeHome, x.umbrella.takeHome);
      return [h.m(d), h.m(x.fee), h.m(x.outside.takeHome), h.m(x.inside.takeHome), h.m(x.umbrella.takeHome), best === x.outside.takeHome ? 'outside' : best === x.inside.takeHome ? 'inside' : 'umbrella']; });
    const over = rates.find((d) => { const y = run(h, d); return y.inside.takeHome > y.outside.takeHome; });
    const x = run(h, RATE);
    const plan = h.E.ir35({ dayRate: RATE, days: DAYS, expenses: EXP, region: 'ruk', plan: 'plan2' });
    return `
<h2>Six day rates, three routes</h2>
<p>The table keeps the same assumptions as the calculator’s defaults: ${DAYS} working days, ${h.m(EXP)} of costs run through the company when outside IR35, an umbrella margin of ${h.m(MARGIN)} a week for ${WEEKS} weeks, the Apprenticeship Levy passed on, England, Wales or Northern Ireland rates and no student loan.</p>
${h.table(['Day rate', 'Fees for the year', 'Outside, own company', 'Inside IR35', 'Umbrella', 'Most left'], rows, `${h.P.taxYear}. Outside: best salary, the rest as dividends, nothing kept in the company.`, ['r', 'r', 'r', 'r', 'r', 'l'])}
<p>Two patterns stand out. ${over === rates[0] ? 'Inside IR35 leaves more than outside at every rate in this table' : over ? `Inside IR35 overtakes outside from ${h.m(over)} a day in this table` : 'Outside stays ahead at every rate in this table, but the margin is thin'}, because the outside route now pays Corporation Tax and then dividend tax of ${h.pc(h.P.dividends.basic)} or ${h.pc(h.P.dividends.higher)} on the same money, while the inside figure bears no employer National Insurance. And the umbrella column is always lowest: it is employment income like the inside figure, with the employer’s own costs taken out first.</p>
<h2>How each column is worked out</h2>
<p><strong>Outside IR35.</strong> The company receives the fees, pays the costs, then the salary that leaves the most cash (${h.m(x.outside.salary)} at ${h.m(RATE)} a day) and employer National Insurance on it, with no Employment Allowance for a sole director. Corporation Tax of ${h.m(x.outside.ct.tax)} follows, and the rest is paid as dividends taxed at ${h.m(x.outside.it.tax)}.</p>
<p><strong>Inside IR35.</strong> The fee is treated as employment income. The deemed employer deducts Income Tax (${h.m(x.inside.incomeTax)}) and employee National Insurance (${h.m(x.inside.employeeNI)}) and pays employer National Insurance itself (${h.src('gov_ir35', 'HMRC, off-payroll working')}). Company costs are ignored here.</p>
<p><strong>Umbrella.</strong> From the ${h.m(x.fee)} paid to the umbrella come its margin (${h.m(x.umbrella.margin)}), employer National Insurance (${h.m(x.umbrella.employerNI)}) and the levy (${h.m(x.umbrella.levy)}). What remains is gross pay of ${h.m(x.umbrella.gross)}, taxed through PAYE. Holiday pay and pension contributions also appear on real umbrella pay statements; the ${h.a('umbrella-company-calculator', 'umbrella calculator')} explains each line.</p>
<h2>What moves the result</h2>
<p>Student loans first. Inside IR35 the deemed employer does not deduct them, so they arrive in the Self Assessment bill: a Plan 2 borrower at ${h.m(RATE)} a day owes ${h.m(plan.inside.loan)}. Then the number of days: holidays, gaps between contracts and sickness are days without fees, so ${h.num(200)} days is a cautious figure for planning. And the company’s costs (insurance, accountancy, equipment) reduce Corporation Tax outside IR35 but are simply spent inside it.</p>
<p>The status itself is not chosen with a calculator. Medium and large clients decide it and explain why in a status determination statement; the ${h.a('ir35', 'IR35 guide')} covers who decides and how.</p>`;
  },
});
