import { definePage } from '../../lib/guide-types';

const PROFIT = 70000;

export default definePage({
  id: 'limited-company-tax-calculator',
  group: 'company',
  order: 41,
  tool: { kind: 'mini:ltd', props: { profit: PROFIT, salary: 12570, draw: 100, region: 0 } },
  related: ['limited-company-vs-sole-trader', 'corporation-tax-calculator', 'dividend-tax-calculator', 'salary-and-dividends-calculator'],
  sources: ['gov_ct_rates_pub', 'gov_dividends', 'gov_employers_2627', 'gov_employment_allowance', 'gov_ltd_money'],
  slug: 'limited-company-tax-calculator',
  nav: 'Limited company take-home',
  card: 'Profit in, cash out: salary, employer NI, Corporation Tax, dividends and what stays in the company.',
  title: 'Limited Company Tax Calculator 2026/27: Your Take-Home',
  description: 'Limited company tax for 2026/27, step by step: director’s salary, employer NI, Corporation Tax, dividend tax and what is left in the company if you draw less.',
  h1: 'Limited company tax calculator: from profit to take-home',
  intro: 'Four taxes stand between a company’s profit and the director’s bank account; this calculator takes them in the order they apply.',
  resume: (h) => {
    const r = h.E.limitedCompany({ profit: PROFIT, salary: h.P.class1.primaryThreshold, region: 'ruk' });
    return `A one-director company with ${h.m(PROFIT)} of profit before the director’s pay, paying a salary of ${h.m(r.salary)} and the rest as dividends in ${h.P.taxYear}, leaves the director ${h.m(r.takeHome)} after every tax. The taxes come in a fixed order. The salary and the employer National Insurance on it (${h.m(r.employerNI)}, at ${h.pc(h.P.class1.employerRate)} above ${h.m(h.P.class1.secondaryThreshold)}) are business costs. Corporation Tax of ${h.m(r.ct.tax)} is then charged on the ${h.m(r.companyProfit)} that remains, with marginal relief because that profit sits between ${h.m(h.P.corporationTax.lowerLimit)} and ${h.m(h.P.corporationTax.upperLimit)}. The ${h.m(r.afterCT)} left can be paid out as dividends, which cost the director ${h.m(r.it.tax)} of Income Tax here. In all, ${h.m(r.totalTax)} goes to HMRC, ${h.pc(Math.round((r.totalTax / PROFIT) * 1000) / 1000)} of the profit. Change the share you draw and the money you leave in the company escapes dividend tax for now.`;
  },
  faqs: (h) => {
    const a = h.E.limitedCompany({ profit: 50000, salary: h.P.class1.primaryThreshold, region: 'ruk' });
    const k = h.E.limitedCompany({ profit: 100000, salary: h.P.class1.primaryThreshold, region: 'ruk', drawShare: 0.5 });
    const all = h.E.limitedCompany({ profit: 100000, salary: h.P.class1.primaryThreshold, region: 'ruk' });
    return [
      { q: 'How much tax does a limited company pay on £50,000 profit?', a: `With a ${h.m(a.salary)} director’s salary taken out first, the company pays ${h.m(a.employerNI)} of employer National Insurance and ${h.m(a.ct.tax)} of Corporation Tax at ${h.pc(h.P.corporationTax.smallRate)}, because its remaining profit is under ${h.m(h.P.corporationTax.lowerLimit)}. If the ${h.m(a.afterCT)} left is all paid out, the director adds ${h.m(a.it.tax)} of dividend tax, for a total of ${h.m(a.totalTax)}.` },
      { q: 'Does leaving money in my limited company reduce the tax I pay?', a: `It delays part of it. On ${h.m(100000)} of profit, drawing everything costs ${h.m(all.it.tax)} of personal tax; drawing half costs ${h.m(k.it.tax)} and leaves ${h.m(k.retained)} in the company. That money has paid Corporation Tax but will meet dividend tax whenever it is paid out later, at the rate of that year.` },
      { q: 'Is a director’s salary deducted before Corporation Tax?', a: `Yes. Salary and the employer National Insurance on it are costs of the company, so they reduce the profit charged to Corporation Tax. Dividends are not: they are paid out of profit that has already been taxed. That is why a salary up to ${h.m(h.P.class1.primaryThreshold)}, free of employee National Insurance, still pays its way despite employer National Insurance above ${h.m(h.P.class1.secondaryThreshold)}.` },
      { q: 'How much can I take out of my limited company as dividends?', a: `No more than the company’s available profits from the current and earlier years, after Corporation Tax. On ${h.m(PROFIT)} of profit with a ${h.m(h.P.class1.primaryThreshold)} salary, that ceiling for the year is about ${h.m(h.E.limitedCompany({ profit: PROFIT, salary: h.P.class1.primaryThreshold, region: 'ruk' }).afterCT)}. Each dividend is declared at a directors’ meeting, minuted, and recorded on a voucher, even in a one-person company.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const steps = [1, 0.5, 0].map((d) => h.E.limitedCompany({ profit: PROFIT, salary: P.class1.primaryThreshold, region: 'ruk', drawShare: d }));
    const rows: Array<Array<string>> = [
      ['Profit before your pay', ...steps.map(() => h.m(PROFIT))],
      ['Your salary', ...steps.map((r) => h.m(r.salary))],
      ['Employer National Insurance', ...steps.map((r) => h.m(r.employerNI))],
      ['Corporation Tax', ...steps.map((r) => h.m(r.ct.tax))],
      ['Dividends paid', ...steps.map((r) => h.m(r.dividends))],
      ['Your Income Tax', ...steps.map((r) => h.m(r.it.tax))],
      ['Cash to you', ...steps.map((r) => h.m(r.takeHome))],
      ['Left in the company', ...steps.map((r) => h.m(r.retained))],
    ];
    const scot = h.E.limitedCompany({ profit: PROFIT, salary: P.class1.primaryThreshold, region: 'scotland' });
    const big = h.E.limitedCompany({ profit: 120000, salary: P.class1.primaryThreshold, region: 'ruk' });
    const bigHalf = h.E.limitedCompany({ profit: 120000, salary: P.class1.primaryThreshold, region: 'ruk', drawShare: 0.5 });
    return `
<h2>The cascade, line by line</h2>
<p>The table follows ${h.m(PROFIT)} of profit through a company owned and run by one person, at three levels of payout. The salary is the Personal Allowance, ${h.m(P.class1.primaryThreshold)}, which is also the point where employee National Insurance starts, so the director pays none on it.</p>
${h.table(['Step', 'All drawn', 'Half drawn', 'Nothing drawn'], rows, `${P.taxYear}, England, Wales or Northern Ireland, one director, no other income.`, ['l', 'r', 'r', 'r'])}
<p>The first three lines never move: Corporation Tax is fixed by the profit, not by what you take. What changes is the dividend tax, which only exists when money leaves the company. With nothing drawn, the director lives on the salary alone and pays no personal tax at all.</p>
<h2>Where each figure comes from</h2>
<p>Employer National Insurance is ${h.pc(P.class1.employerRate)} of salary above the secondary threshold of ${h.m(P.class1.secondaryThreshold)} (${h.src('gov_employers_2627', 'HMRC rates for employers')}). A company whose director is its only paid employee cannot use the Employment Allowance to cancel it. Corporation Tax for the financial year from 1 April 2026 is ${h.pc(P.corporationTax.smallRate)} on profits up to ${h.m(P.corporationTax.lowerLimit)} and ${h.pc(P.corporationTax.mainRate)} from ${h.m(P.corporationTax.upperLimit)}, with marginal relief between; the ${h.a('corporation-tax-calculator', 'Corporation Tax calculator')} handles short periods and associated companies. Dividends are taxed on top of the salary, after a ${h.m(P.dividends.allowance)} allowance, at ${h.pc(P.dividends.basic)}, ${h.pc(P.dividends.higher)} or ${h.pc(P.dividends.additional)}.</p>
<h2>Scotland and bigger profits</h2>
<p>A Scottish director gets almost the same answer, ${h.m(scot.takeHome)} on the same ${h.m(PROFIT)}, because dividends are taxed at UK rates wherever you live in the UK and the salary sits inside the Personal Allowance. Where Scotland does matter is in the comparison with self-employment: a Scottish sole trader pays Scottish rates on the whole profit, which the ${h.a('limited-company-vs-sole-trader', 'sole trader comparison')} sets side by side.</p>
<p>At ${h.m(120000)} of profit the picture shifts. Corporation Tax rises to ${h.m(big.ct.tax)}, an effective ${h.pc(Math.round(big.ct.effectiveRate * 1000) / 1000)} of the company’s taxable profit, and drawing everything pushes ${h.m(big.dividends)} of dividends through the higher dividend rate. The director keeps ${h.m(big.takeHome)}. Drawing only half instead would cut the personal tax from ${h.m(big.it.tax)} to ${h.m(bigHalf.it.tax)} this year, with ${h.m(bigHalf.retained)} staying in the company until a later, possibly lower-income, year.</p>
<h2>Using the calculator</h2>
<p>Type the profit before your own pay, meaning sales less every business cost except your salary. Leave the salary at ${h.m(P.class1.primaryThreshold)} to see the usual set-up, or try ${h.m(P.class1.secondaryThreshold)} to see what changes when no employer National Insurance is due. The share paid out runs from 0 to 100 %: a plumber who wants to build a cash reserve for a new van might draw 60 %, while a consultant who needs every pound draws it all.</p>
${h.box('What the calculator does not include', `<p>Accountancy and other running costs, pension contributions made by the company, benefits in kind, directors’ loans and student loan repayments. Enter costs as a lower profit to approximate them.</p>`, 'info')}`;
  },
});
