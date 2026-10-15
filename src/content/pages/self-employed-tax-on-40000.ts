import { definePage } from '../../lib/guide-types';

const PROFIT = 40000;

export default definePage({
  id: 'self-employed-tax-on-40000',
  group: 'amounts',
  order: 23,
  tool: { kind: 'se', props: { turnover: PROFIT, expenses: 0 } },
  related: ['self-employed-tax-on-30000', 'self-employed-tax-on-50000', 'student-loan-self-employed', 'limited-company-vs-sole-trader'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_scottish_income_tax', 'gov_student_loan_repay', 'gov_payments_on_account', 'gov_dividends'],
  slug: 'self-employed-tax-on-40000',
  nav: '£40,000 profit',
  card: 'A Plan 2 loan starts to bite, Scotland nears its higher rate and a company still leaves less cash.',
  title: '£40,000 Self-Employed Tax 2026/27: Plan 2 Loan and Scotland',
  description: 'Tax on £40,000 of self-employed profit in 2026/27: Income Tax, Class 4, Plan 2 loan repayments, the Scottish higher rate just above, and sole trader or company.',
  h1: 'Tax and loan repayments on £40,000 of self-employed profit',
  intro: 'A comfortable basic-rate year south of the border, a few thousand pounds short of the higher rate in Scotland.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const l = h.E.selfEmployed({ profit: PROFIT, region: 'ruk', plan: 'plan2' });
    const c = h.E.compareStructures({ profit: PROFIT, region: 'ruk' });
    const SL = h.P.studentLoans;
    return `A ${h.m(PROFIT)} profit in ${h.P.taxYear} costs a sole trader in England, Wales or Northern Ireland ${h.m(r.saBill)} through Self Assessment, ${h.m(r.it.tax)} of it Income Tax and ${h.m(r.class4.total)} Class 4, for a take-home of ${h.m(r.takeHome)}. In Scotland the bill is ${h.m(s.saBill)}, now a little above the rest of the UK, and the gap is about to widen: the Scottish higher rate of ${h.pc(h.P.incomeTax.scotland.bands[3].rate)} begins at ${h.m(h.T.scotHigherFrom)}, only ${h.m(h.T.scotHigherFrom - PROFIT)} further up. A graduate repaying a Plan 2 student loan adds ${h.m(l.loan.total)} to the January payment, as ${h.pc(SL.rate)} is collected on income above ${h.m(SL.plan2)}, which lifts the cost of each extra pound of profit from ${h.pc(h.E.marginalOnProfit({ profit: PROFIT, region: 'ruk' }))} to ${h.pc(h.E.marginalOnProfit({ profit: PROFIT, region: 'ruk', plan: 'plan2' }))}. The company question tends to surface at this level. On current rates, a one-person company paying out everything would leave ${h.m(Math.abs(c.gapAllDrawn))} ${c.gapAllDrawn < 0 ? 'less' : 'more'} than trading alone, before any accountancy fee.`;
  },
  faqs: (h) => {
    const l = h.E.selfEmployed({ profit: PROFIT, region: 'ruk', plan: 'plan2' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const c = h.E.compareStructures({ profit: PROFIT, region: 'ruk' });
    const SL = h.P.studentLoans, S = h.P.incomeTax.scotland.bands;
    return [
      { q: 'How much student loan do I repay on £40,000 of self-employed profit?', a: `On Plan 2, ${h.m(l.loan.total)} for ${h.P.taxYear}: ${h.pc(SL.rate)} of the ${h.m(PROFIT - SL.plan2)} above the ${h.m(SL.plan2)} threshold, assuming no other income. It is added to your Self Assessment balancing payment, not to the payments on account. Plan 1 starts lower, at ${h.m(SL.plan1)}, so the same profit would mean ${h.m(h.E.studentLoan(PROFIT, 'plan1').total)}.` },
      { q: 'Is £40,000 profit in the Scottish higher rate band?', a: `No. The ${h.pc(S[3].rate)} band starts at ${h.m(h.T.scotHigherFrom)} of income for someone with the standard Personal Allowance, so ${h.m(PROFIT)} is still in the ${h.pc(S[2].rate)} intermediate band at the top. The Scottish bill is ${h.m(s.saBill)}. Another ${h.m(h.T.scotHigherFrom - PROFIT)} of profit and the next pound would cost ${h.pc(S[3].rate + h.P.class4.mainRate)} with Class 4.` },
      { q: 'Would a limited company cut the tax on £40,000 profit?', a: `Not if all the profit is paid out. With the best salary for this case, ${h.m(c.salary)}, and the rest as dividends, the director keeps ${h.m(c.ltdAll.takeHome)} against ${h.m(c.soleTakeHome)} as a sole trader in England, Wales or Northern Ireland, before company running costs. Corporation Tax at ${h.pc(h.P.corporationTax.smallRate)} plus dividend tax at ${h.pc(h.P.dividends.basic)} outweigh the Class 4 saved.` },
    ];
  },
  body: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const l = h.E.selfEmployed({ profit: PROFIT, region: 'ruk', plan: 'plan2' });
    const S = h.P.incomeTax.scotland.bands, C4 = h.P.class4, SL = h.P.studentLoans;
    const c = h.E.compareStructures({ profit: PROFIT, region: 'ruk' });
    const cal = h.E.saCalendar(h.P.year);
    const rows = [36000, 38000, PROFIT, 42000, h.T.scotHigherFrom, 46000].map((p) => {
      const a = h.E.selfEmployed({ profit: p, region: 'ruk' }), b = h.E.selfEmployed({ profit: p, region: 'ruk', plan: 'plan2' }), d = h.E.selfEmployed({ profit: p, region: 'scotland', plan: 'plan2' });
      return [h.m(p), h.m(a.saBill), h.m(b.loan.total), h.m(b.saBill), h.m(d.saBill)];
    });
    const below = h.E.marginalOnProfit({ profit: PROFIT, region: 'scotland' }), above = h.E.marginalOnProfit({ profit: h.T.scotHigherFrom + 500, region: 'scotland' });
    return `
<h2>A loan repayment on top of the tax</h2>
<p>Employees see student loan deductions on their payslip. Sole traders meet them once a year, inside the Self Assessment calculation. For Plan 2, the deduction is ${h.pc(SL.rate)} of income over ${h.m(SL.plan2)}, and at ${h.m(PROFIT)} that comes to ${h.m(l.loan.total)}, taking the January bill to ${h.m(l.saBill)}. Two details trip people up. The loan is collected with the balancing payment, so it does not swell the payments on account. And because it is charged on the same profit as the tax, every pound earned above the threshold now carries three deductions: ${h.pc(h.P.incomeTax.ruk.bands[0].rate)} Income Tax, ${h.pc(C4.mainRate)} Class 4 and ${h.pc(SL.rate)} loan. The ${h.a('student-loan-self-employed', 'student loan page')} covers Plans 1, 4 and 5 and the postgraduate loan.</p>
${h.table(['Profit', 'Tax and Class 4', 'Plan 2 repayment', 'Total rUK', 'Total Scotland'], rows, `Self Assessment bill with a Plan 2 loan, no other income, ${h.P.taxYear}.`, ['r', 'r', 'r', 'r', 'r'])}
<h2>${h.m(h.T.scotHigherFrom - PROFIT)} short of the Scottish ${h.pc(S[3].rate)} band</h2>
<p>A Scottish electrician on ${h.m(PROFIT)} pays ${h.pc(below)} on the next pound of profit, the intermediate rate plus Class 4. At ${h.m(h.T.scotHigherFrom)} that becomes ${h.pc(above)}, because Scotland's higher rate starts well before the UK upper profits limit of ${h.m(C4.upperProfitsLimit)}, and Class 4 stays at its main rate until that limit. Between the two figures sits the most expensive stretch of profit for a Scottish sole trader below six figures. South of the border the same electrician keeps paying ${h.pc(h.E.marginalOnProfit({ profit: PROFIT, region: 'ruk' }))} on each pound until ${h.m(h.T.basicTo)}. Anyone in Scotland expecting a jump in profit can see the effect in the calculator by switching the region; the ${h.a('self-employed-tax-scotland', 'Scottish tax page')} explains the bands.</p>
<h2>Sole trader or company at forty thousand</h2>
<p>The comparison usually assumes the owner pays a small salary and takes the rest as dividends. At ${h.m(PROFIT)} the best salary in this model is ${h.m(c.salary)}. After Corporation Tax at the small profits rate of ${h.pc(h.P.corporationTax.smallRate)} and dividend tax, the director keeps ${h.m(c.ltdAll.takeHome)}; the sole trader keeps ${h.m(c.soleTakeHome)}. The difference of ${h.m(Math.abs(c.gapAllDrawn))} runs ${c.gapAllDrawn < 0 ? 'against' : 'in favour of'} the company even before its accounts, filing and payroll costs are counted. Even at its closest, around ${h.m(60000)} of profit, a company paying out everything only draws level; what changes the picture is money left inside the business, as the ${h.a('limited-company-vs-sole-trader', 'side-by-side comparison')} shows.</p>
<h2>Funding the January payment</h2>
<p>A settled business at this level pays in two halves, each ${h.m(r.poaEach)}, on ${h.date(cal.payment)} and ${h.date(cal.secondPoa)}, with any loan repayment added in January. A first-year trader pays ${h.m(l.saBill + l.poaEach)} in that first January if a Plan 2 loan is running. Setting aside ${h.m((l.saBill + l.poaEach) / 12)} a month from April, in an account kept apart from day-to-day spending, would cover it.</p>`;
  },
});
