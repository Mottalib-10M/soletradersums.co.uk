import { definePage } from '../../lib/guide-types';

const PROFIT = 30000;

export default definePage({
  id: 'self-employed-tax-on-30000',
  group: 'amounts',
  order: 22,
  tool: { kind: 'se', props: { turnover: PROFIT, expenses: 0 } },
  related: ['self-employed-tax-on-20000', 'self-employed-tax-on-40000', 'making-tax-digital', 'mtd-quarterly-deadlines'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_scottish_income_tax', 'gov_mtd_when', 'gov_mtd_quarterly'],
  slug: 'self-employed-tax-on-30000',
  nav: '£30,000 profit',
  card: 'Second Making Tax Digital threshold and the first slice of the Scottish intermediate rate.',
  title: '£30,000 Self-Employed Tax 2026/27: MTD from April 2027',
  description: 'Tax on £30,000 of self-employed profit in 2026/27: Income Tax and Class 4 in rUK and Scotland, the intermediate rate band, and quarterly MTD from April 2027.',
  h1: 'Sole trader tax on a £30,000 profit',
  intro: 'Thirty thousand pounds is where quarterly digital reporting arrives for many sole traders, and where the Scottish intermediate rate takes its first slice.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const S = h.P.incomeTax.scotland.bands, st = h.P.mtd.stages[1];
    return `On ${h.m(PROFIT)} of self-employed profit, ${h.P.taxYear} Income Tax comes to ${h.m(r.it.tax)} and Class 4 to ${h.m(r.class4.total)} in England, Wales and Northern Ireland, so HMRC is owed ${h.m(r.saBill)} and ${h.m(r.takeHome)} remains. A Scottish taxpayer is charged ${h.m(s.saBill)}. The two land close together because two Scottish features pull in opposite directions: the ${h.pc(S[0].rate)} starter band saves a little at the bottom, while the ${h.pc(S[2].rate)} intermediate rate, which begins at ${h.m(h.T.scotIntermediateFrom)}, takes some of it back on the top ${h.m(PROFIT - h.T.scotIntermediateFrom + 1)}. This profit level is also the second Making Tax Digital threshold. Sole traders and landlords whose ${st.basisYear} return shows qualifying income of more than ${h.m(st.threshold)} keep digital records and send quarterly updates from ${h.date(st.start)}, and HMRC measures that on turnover before costs. Anyone earning this profit with real expenses to deduct is therefore very likely to be in the April 2027 group.`;
  },
  faqs: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const S = h.P.incomeTax.scotland.bands, st = h.P.mtd.stages[1];
    const start = h.E.mtdStart({ y2425: 31000, y2526: 31000, y2627: 31000 });
    return [
      { q: 'If my turnover was £31,000 in 2025/26, when do I start Making Tax Digital?', a: `From ${h.date(start ? start.start : st.start)}, provided your ${h.P.mtd.stages[0].basisYear} turnover was not above ${h.m(h.P.mtd.stages[0].threshold)}. The ${st.basisYear} test catches qualifying income of more than ${h.m(st.threshold)}, and ${h.m(31000)} is over it whatever your profit was. From that date you keep digital records, send a summary every quarter and still file and pay by ${h.P.paymentsOnAccount.dueFirst} after each tax year ends.` },
      { q: 'Does the Scottish intermediate rate apply to £30,000 of profit?', a: `Yes, but only to a small slice. The ${h.pc(S[2].rate)} rate starts at ${h.m(h.T.scotIntermediateFrom)} of income, so ${h.m(PROFIT - h.T.scotIntermediateFrom + 1)} of a ${h.m(PROFIT)} profit is charged at it. The rest sits in the starter and basic bands, and Class 4 is unchanged. That is why the Scottish bill, ${h.m(s.saBill)}, is still a touch lower than the ${h.m(r.saBill)} paid elsewhere.` },
      { q: 'What is the take-home pay on £30,000 of self-employed profit?', a: `${h.m(r.takeHome)} for the year in England, Wales or Northern Ireland, about ${h.m(r.takeHome / 12)} a month, after ${h.m(r.it.tax)} of Income Tax and ${h.m(r.class4.total)} of Class 4. In Scotland it is ${h.m(s.takeHome)}. A Plan 2 student loan would take a further ${h.m(h.E.studentLoan(PROFIT, 'plan2').total)}, since repayments start once income passes ${h.m(h.P.studentLoans.plan2)}.` },
    ];
  },
  body: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const S = h.P.incomeTax.scotland.bands, M = h.P.mtd, st = M.stages[1];
    const chair = h.E.mtdStart({ y2425: 0, y2526: 38000, y2627: 38000 });
    const exact = h.E.mtdStart({ y2425: 0, y2526: PROFIT, y2627: PROFIT });
    const slices = h.E.incomeTax({ nonSavings: PROFIT, region: 'scotland' }).nonSavingsSlices;
    const rows = slices.map((x) => [x.name, h.pc(x.rate), h.m(x.amount), h.m(x.tax)]);
    rows.push(['Total Income Tax, Scotland', '', h.m(slices.reduce((t, x) => t + x.amount, 0)), h.m(s.it.tax)]);
    rows.push(['Total Income Tax, rest of the UK', '', h.m(PROFIT - h.T.pa), h.m(r.it.tax)]);
    const mS = h.E.marginalOnProfit({ profit: PROFIT, region: 'scotland' }), mR = h.E.marginalOnProfit({ profit: PROFIT, region: 'ruk' });
    return `
<h2>Turnover in ${st.basisYear} decides April 2027</h2>
<p>The second wave of Making Tax Digital is set by the tax return for ${st.basisYear}, the one most people file by January 2027. Qualifying income above ${h.m(st.threshold)} brings you in on ${h.date(st.start)}. That figure is gross: sales from every self-employment plus rents, with no deduction for costs. A hairdresser renting a chair, taking ${h.m(38000)} and paying ${h.m(8000)} in rent and products, makes exactly the profit on this page and ${chair ? `starts on ${h.date(chair.start)}` : 'is caught'}. A freelance translator with ${h.m(PROFIT)} of sales and nothing to deduct is not above the bar and ${exact ? `waits until ${h.date(exact.start)}` : 'is only tested again on the next return, against the lower bar'}. Profit, in other words, says little about the date; the top line of the accounts says everything. The ${h.a('making-tax-digital', 'Making Tax Digital checker')} applies the three tests to your own figures.</p>
<h2>The ${h.pc(S[2].rate)} band from ${h.m(h.T.scotIntermediateFrom)}</h2>
<p>Scotland splits basic-rate income into three parts. A sole trader on ${h.m(PROFIT)} touches all of them, and the last ${h.m(PROFIT - h.T.scotIntermediateFrom + 1)} is in the intermediate band. The result is a bill only ${h.m(r.saBill - s.saBill)} lighter than the one paid in Cardiff or Belfast, and a marginal rate that has already moved: each extra pound now costs ${h.pc(mS)} in Scotland against ${h.pc(mR)} elsewhere, once Class 4 is added.</p>
${h.table(['Scottish band', 'Rate', 'Slice of taxable profit', 'Tax'], rows, `Income Tax on ${h.m(PROFIT)} of profit after the ${h.m(h.T.pa)} Personal Allowance, ${h.P.taxYear}.`, ['l', 'r', 'r', 'r'])}
<h2>What the quarters look like</h2>
<p>Under Making Tax Digital the tax itself does not change, and neither does the payment date: the bill of ${h.m(r.saBill)} for ${h.P.taxYear} is still settled by ${h.date(h.E.saCalendar(h.P.year).payment)}. What changes is the rhythm of the records. Software totals income and expenses every three months and sends a summary, which HMRC describes as an update rather than a return. On standard periods the first quarter runs ${M.quarters[0].standard} with a deadline of ${M.quarters[0].deadline}, the second to ${M.quarters[1].deadline}, then ${M.quarters[2].deadline} and ${M.quarters[3].deadline}. A sole trader whose books run ${M.quarters[3].calendar} can opt for calendar periods instead, and the deadlines stay the same. Dates and grace rules are on the ${h.a('mtd-quarterly-deadlines', 'quarterly deadlines page')}.</p>
<h2>Living on ${h.m(r.takeHome)}</h2>
<p>After tax, the year leaves ${h.m(r.takeHome / 12)} a month to spend in England, Wales or Northern Ireland. The amount to keep aside is ${h.m(r.saBill / 12)} a month in a settled year, but a business reaching ${h.m(PROFIT)} for the first time should plan for ${h.m((r.saBill + r.poaEach) / 12)}, because the first January also asks for a payment on account of ${h.m(r.poaEach)}. Anyone repaying a Plan 2 student loan through Self Assessment needs a further ${h.m(h.E.studentLoan(PROFIT, 'plan2').total)} on top; the ${h.a('student-loan-self-employed', 'student loan page')} shows how that is collected.</p>`;
  },
});
