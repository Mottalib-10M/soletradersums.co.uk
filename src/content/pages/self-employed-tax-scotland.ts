import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'self-employed-tax-scotland',
  group: 'tax',
  order: 2,
  tool: { kind: 'se', props: { region: 'scotland', turnover: 45000, expenses: 5000 } },
  related: ['self-employed-tax-on-40000', 'pension-tax-relief-self-employed', 'dividend-tax-calculator', 'student-loan-self-employed'],
  sources: ['gov_scottish_income_tax', 'gov_se_nic', 'gov_dividends', 'gov_student_loan_repay', 'gov_pension_relief', 'gov_scot_who_pays'],
  slug: 'self-employed-tax-scotland',
  nav: 'Scotland',
  card: 'Six Scottish bands on your profit, UK-wide Class 4, and where Scotland becomes dearer than England.',
  title: 'Self-Employed Tax in Scotland 2026/27: Six Bands on Profit',
  description: 'Scottish self-employed tax for 2026/27: the six Income Tax bands on profit, the point where Scotland costs more than England, who counts as Scottish and Plan 4.',
  h1: 'Self-employed tax in Scotland',
  intro: 'Holyrood sets the Income Tax bands on your trading profit; Westminster still sets Class 4, dividend tax and the Personal Allowance.',
  resume: (h) => {
    const P = h.P;
    const s = h.E.selfEmployed({ profit: 40000, region: 'scotland' });
    const r = h.E.selfEmployed({ profit: 40000, region: 'ruk' });
    const S = P.incomeTax.scotland.bands;
    return `A Scottish sole trader with ${h.m(40000)} of profit in ${P.taxYear} pays ${h.m(s.it.tax)} of Income Tax and ${h.m(s.class4.total)} of Class 4, ${h.m(s.saBill)} in all, against ${h.m(r.saBill)} for the same profit in England, Wales or Northern Ireland. The difference comes only from Income Tax: Scotland splits taxable profit into six bands, from a starter rate of ${h.pc(S[0].rate)} to a top rate of ${h.pc(S[5].rate)}, while Class 4 National Insurance is a UK tax charged at the same ${h.pc(P.class4.mainRate)} and ${h.pc(P.class4.upperRate)} everywhere. The Personal Allowance of ${h.m(h.T.pa)} and its taper above ${h.m(h.T.taperStart)} are also UK rules. Whether you count as a Scottish taxpayer depends on where your main home is, not on where your customers or your business address are. Dividends and savings interest stay on UK rates, and borrowers who applied through the Student Awards Agency Scotland repay a Plan 4 loan from ${h.m(P.studentLoans.plan4)}.`;
  },
  faqs: (h) => {
    const P = h.P;
    let cross = 0; for (let p = h.T.pa; p < 80000; p += 10) if (h.E.selfEmployed({ profit: p, region: 'scotland' }).saBill > h.E.selfEmployed({ profit: p, region: 'ruk' }).saBill) { cross = p; break; }
    const m45 = h.E.marginalOnProfit({ profit: 45000, region: 'scotland' });
    return [
      { q: 'At what profit do Scottish sole traders pay more than English ones?', a: `From about ${h.m(cross)} of profit in ${P.taxYear}. Below that, the ${h.pc(P.incomeTax.scotland.bands[0].rate)} starter band keeps the Scottish bill slightly lower; above it, the ${h.pc(P.incomeTax.scotland.bands[2].rate)} intermediate band and then the ${h.pc(P.incomeTax.scotland.bands[3].rate)} higher band from ${h.m(h.T.scotHigherFrom)} push it above the rest of the UK, assuming no other income.` },
      { q: 'I work in England but live in Scotland, which tax do I pay?', a: `Scottish Income Tax. GOV.UK ties it to where you live, so a joiner based in Dumfries who works on sites in Carlisle pays Scottish rates on all the profit. With two homes, the main one decides; where that is unclear, count the days, judged by where you are at midnight. Class 4 is unaffected, at ${h.pc(P.class4.mainRate)} above ${h.m(h.T.lpl)}.` },
      { q: 'What is the marginal rate on Scottish self-employed profit of £45,000?', a: `Each extra pound costs ${h.pc(m45)} through Self Assessment: ${h.pc(P.incomeTax.scotland.bands[3].rate)} Scottish higher rate plus ${h.pc(P.class4.mainRate)} Class 4, because the higher rate starts at ${h.m(h.T.scotHigherFrom)} while the Class 4 main rate runs on to ${h.m(h.T.upl)}. That overlap does not exist in England, where both limits sit at ${h.m(h.T.basicTo)}.` },
      { q: 'Do I pay Scottish tax if my business address is in England?', a: `It depends on where you live, not on the business address. A web designer living in Edinburgh who trades from a Manchester office pays Scottish rates on the profit; one living in Manchester pays rUK rates even with clients in Glasgow. On ${h.m(40000)} of profit the gap is ${h.m(h.E.selfEmployed({ profit: 40000, region: 'scotland' }).saBill - h.E.selfEmployed({ profit: 40000, region: 'ruk' }).saBill)} for ${P.taxYear}, all of it Income Tax.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const S = P.incomeTax.scotland.bands;
    const T = h.T;
    const bands = [
      ['Personal Allowance', `up to ${h.m(T.pa)}`, h.pc(0)],
      [S[0].name, `${h.m(T.pa + 1)} to ${h.m(T.scotStarterTo)}`, h.pc(S[0].rate)],
      [S[1].name, `${h.m(T.scotBasicFrom)} to ${h.m(T.scotIntermediateFrom - 1)}`, h.pc(S[1].rate)],
      [S[2].name, `${h.m(T.scotIntermediateFrom)} to ${h.m(T.scotHigherFrom - 1)}`, h.pc(S[2].rate)],
      [S[3].name, `${h.m(T.scotHigherFrom)} to ${h.m(T.scotAdvancedFrom - 1)}`, h.pc(S[3].rate)],
      [S[4].name, `${h.m(T.scotAdvancedFrom)} to ${h.m(T.scotTopFrom - 1)}`, h.pc(S[4].rate)],
      [S[5].name, `over ${h.m(T.scotTopFrom - 1)}`, h.pc(S[5].rate)],
    ];
    const cmp = [20000, 30000, 40000, 50000, 75000].map((p) => {
      const s = h.E.selfEmployed({ profit: p, region: 'scotland' }), r = h.E.selfEmployed({ profit: p, region: 'ruk' });
      return [h.m(p), h.m(s.saBill), h.m(r.saBill), `${s.saBill >= r.saBill ? '+' : '−'}${h.m(Math.abs(s.saBill - r.saBill))}`];
    });
    const def = h.E.selfEmployed({ profit: 40000, region: 'scotland' });
    const p4 = h.E.selfEmployed({ profit: 40000, region: 'scotland', plan: 'plan4' });
    return `
<h2>The six Scottish bands for ${P.taxYear}</h2>
<p>The table gives the ${P.taxYear} Scottish rates as income, with the standard Personal Allowance, as GOV.UK publishes them (${h.src('gov_scottish_income_tax', 'GOV.UK, Income Tax in Scotland')}). The allowance disappears for incomes over ${h.m(T.paGone)}, exactly as in the rest of the UK.</p>
${h.table(['Band', 'Income', 'Rate'], bands, `Scottish Income Tax, ${P.taxYear}, standard Personal Allowance.`, ['l', 'l', 'r'])}
<p>The calculator above starts from ${h.m(45000)} of takings and ${h.m(5000)} of costs, a profit of ${h.m(40000)}, and returns a bill of ${h.m(def.saBill)}. Change the figures to your own; the Scottish setting is already chosen.</p>

<h2>Where Scotland becomes the dearer place to trade</h2>
<p>At low profits a Scottish sole trader pays a little less than a counterpart in Newcastle or Cardiff, because the first slice above the allowance is taxed at ${h.pc(S[0].rate)} rather than ${h.pc(P.incomeTax.ruk.bands[0].rate)}. The intermediate band at ${h.pc(S[2].rate)} wipes out that saving in the low thirties, and from ${h.m(T.scotHigherFrom)} the ${h.pc(S[3].rate)} higher rate widens the gap fast. Around ${h.m(50000)} a Scottish trader is paying the higher rate on several thousand pounds that would still be basic-rate income south of the border.</p>
${h.table(['Profit', 'Scotland', 'England, Wales, NI', 'Difference'], cmp, `Income Tax and Class 4 through Self Assessment, ${P.taxYear}, no other income.`, ['r', 'r', 'r', 'r'])}

<h2>Class 4 keeps the UK limits</h2>
<p>National Insurance is not devolved. Class 4 is ${h.pc(P.class4.mainRate)} on profit between ${h.m(T.lpl)} and ${h.m(T.upl)} and ${h.pc(P.class4.upperRate)} above, in Inverness as in Plymouth (${h.src('gov_se_nic', 'GOV.UK, self-employed National Insurance rates')}). Because the Scottish higher rate starts well before the Class 4 upper limit, there is a stretch of profit, from ${h.m(T.scotHigherFrom)} to ${h.m(T.upl)}, where both bite at full strength. The combined marginal rate there is ${h.pc(S[3].rate + P.class4.mainRate)}, which is why pension contributions tend to come up earlier in conversations with Scottish freelancers.</p>

<h2>Who counts as a Scottish taxpayer</h2>
<p>GOV.UK’s test is residence. You pay Scottish Income Tax if you live in Scotland; with homes on both sides of the border, the one that counts is your main home, usually where you spend most of your time, but possibly the place where your family lives and your possessions, GP and bank are registered. A lorry driver or offshore worker with no settled home counts days instead: more days in Scotland than elsewhere in the UK, judged by where you are at midnight, makes you Scottish for the whole year. Someone who moves north and lives there longer than anywhere else in the UK during the tax year is Scottish for that year. On the online return there is a box to tell HMRC, and the rate follows the address HMRC holds, so a move should be reported.</p>

<h2>What stays on UK rules</h2>
<p>Dividends and savings interest are taxed at UK rates even for a Scottish taxpayer. Dividends use ${h.pc(P.dividends.basic)}, ${h.pc(P.dividends.higher)} and ${h.pc(P.dividends.additional)} with the UK band limits after a ${h.m(P.dividends.allowance)} allowance (${h.src('gov_dividends', 'GOV.UK, tax on dividends')}), which matters to anyone comparing a sole trader with a company: the ${h.a('dividend-tax-calculator', 'dividend tax calculator')} handles the mix. Pension relief, by contrast, follows the Scottish rates: a higher-rate Scottish taxpayer claims extra relief in line with the ${h.pc(S[3].rate)} band, as the ${h.a('pension-tax-relief-self-employed', 'pension relief page')} shows (${h.src('gov_pension_relief', 'GOV.UK, pension tax relief')}).</p>
<h3>Plan 4 student loans</h3>
<p>Anyone who applied to the Student Awards Agency Scotland is on Plan 4, for undergraduate and postgraduate courses alike, with a repayment threshold of ${h.m(P.studentLoans.plan4)} and a rate of ${h.pc(P.studentLoans.rate)} on income above it (${h.src('gov_student_loan_repay', 'GOV.UK, student loan repayments')}). Through Self Assessment, ${h.m(40000)} of profit means a Plan 4 repayment of ${h.m(p4.loan.total)}, which lifts the January bill to ${h.m(p4.saBill)}. The ${h.a('student-loan-self-employed', 'student loan page')} compares every plan.</p>`;
  },
});
