import { definePage } from '../../lib/guide-types';

const PROFIT = 20000;

export default definePage({
  id: 'self-employed-tax-on-20000',
  group: 'amounts',
  order: 21,
  tool: { kind: 'se', props: { turnover: PROFIT, expenses: 0 } },
  related: ['self-employed-tax-on-15000', 'self-employed-tax-on-30000', 'mtd-qualifying-income', 'self-employed-tax-scotland'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_scottish_income_tax', 'gov_mtd_when', 'gov_mtd_qualifying', 'gov_payments_on_account'],
  slug: 'self-employed-tax-on-20000',
  nav: '£20,000 profit',
  card: 'The last Making Tax Digital threshold sits here, and Scotland is still the cheaper side of the border.',
  title: '£20,000 Self-Employed Tax 2026/27: MTD Line and Scotland',
  description: 'Tax on £20,000 of self-employed profit in 2026/27: the bill in rUK and Scotland, the first payments on account, and the turnover test for MTD from April 2028.',
  h1: 'What a £20,000 self-employed profit costs in tax',
  intro: 'The figure at which the third and final Making Tax Digital threshold is set, and where a Scottish address still saves a little.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const S = h.P.incomeTax.scotland.bands, st = h.P.mtd.stages[2];
    return `${h.m(PROFIT)} of profit leaves a sole trader in England, Wales or Northern Ireland with a ${h.P.taxYear} bill of ${h.m(r.saBill)}, made of ${h.m(r.it.tax)} Income Tax and ${h.m(r.class4.total)} Class 4, so ${h.m(r.takeHome)} is kept. A Scottish taxpayer pays ${h.m(s.saBill)}, which is ${h.m(r.saBill - s.saBill)} less, because the ${h.pc(S[0].rate)} starter band still applies and the ${h.pc(S[2].rate)} intermediate rate only begins at ${h.m(h.T.scotIntermediateFrom)}. The number also matters for paperwork. Making Tax Digital for Income Tax reaches sole traders whose ${st.basisYear} qualifying income is more than ${h.m(st.threshold)}, from ${h.date(st.start)}, and qualifying income means turnover before expenses. Takings of exactly ${h.m(PROFIT)} stay outside; the same profit earned on larger takings does not. This is also the first rung where payments on account start, since the bill is above ${h.m(h.P.paymentsOnAccount.minBill)}: in a first year, the January payment is ${h.m(r.saBill + r.poaEach)}.`;
  },
  faqs: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const S = h.P.incomeTax.scotland.bands, st = h.P.mtd.stages[2];
    const cal = h.E.saCalendar(h.P.year);
    return [
      { q: 'Does £20,000 of turnover put me into Making Tax Digital?', a: `Not at exactly that figure. The rule for the third stage is qualifying income of more than ${h.m(st.threshold)} on your ${st.basisYear} return, and only then do you start on ${h.date(st.start)}. Qualifying income is turnover from self-employment plus gross property income, before expenses, so a builder with ${h.m(PROFIT)} of profit and ${h.m(15000)} of materials is well over it.` },
      { q: 'Why do Scottish sole traders pay less tax on £20,000?', a: `Because the first ${h.m(S[0].upTo as number)} of taxable income in Scotland is charged at the starter rate of ${h.pc(S[0].rate)} instead of ${h.pc(S[1].rate)}. Nothing else at this level differs: Class 4 uses the same UK limits everywhere. The saving is ${h.m(r.saBill - s.saBill)}, which is why a Scottish bill on ${h.m(PROFIT)} is ${h.m(s.saBill)} against ${h.m(r.saBill)} elsewhere.` },
      { q: 'How much is due in January on a first £20,000 year of self-employment?', a: `${h.m(r.saBill + r.poaEach)} by ${h.date(cal.payment)} for a ${h.P.taxYear} start in England, Wales or Northern Ireland: the ${h.m(r.saBill)} bill plus a first payment on account of ${h.m(r.poaEach)} towards the next year. A second instalment of the same size follows on ${h.date(cal.secondPoa)}. If profit then falls, you can ask HMRC to reduce those instalments.` },
    ];
  },
  body: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const R = h.P.incomeTax.ruk.bands, S = h.P.incomeTax.scotland.bands, C4 = h.P.class4, M = h.P.mtd;
    const st = M.stages[2];
    const cal = h.E.saCalendar(h.P.year);
    const window = h.E.mtdStart({ y2425: 0, y2526: 0, y2627: 24000 });
    let flip = PROFIT; while (h.E.selfEmployed({ profit: flip, region: 'scotland' }).saBill <= h.E.selfEmployed({ profit: flip, region: 'ruk' }).saBill) flip += 100;
    const rows = [16000, 18000, PROFIT, 25000, h.T.scotIntermediateFrom, flip].map((p) => {
      const a = h.E.selfEmployed({ profit: p, region: 'ruk' }).saBill, b = h.E.selfEmployed({ profit: p, region: 'scotland' }).saBill;
      return [h.m(p), h.m(a), h.m(b), (b - a < 0 ? '-' : '+') + h.m(Math.abs(b - a))];
    });
    return `
<h2>One pound over the 2028 line</h2>
<p>Making Tax Digital is arriving in three waves, each with a lower bar: more than ${h.m(M.stages[0].threshold)}, then ${h.m(M.stages[1].threshold)}, then ${h.m(st.threshold)}. The last wave looks at the ${st.basisYear} tax return, the one covering this very year, and sends those over the bar into the system on ${h.date(st.start)}. The test reads turnover, not profit. A window cleaner who invoices ${h.m(24000)} and spends ${h.m(4000)} on a van and ladders has the profit this page is about, yet ${window ? `would start on ${h.date(window.start)}` : 'would be caught'}. A copywriter with ${h.m(PROFIT)} of sales and nothing to deduct sits exactly on the line and stays out, because the rule says more than. Once in, the year is reported in four quarterly updates, the first due by ${M.quarters[0].deadline}, followed by the usual annual return. The ${h.a('mtd-qualifying-income', 'qualifying income guide')} covers rents, partnerships and joint property.</p>
<h2>Where Scotland stops being cheaper</h2>
<p>At ${h.m(PROFIT)} a Scottish sole trader pays ${h.m(r.saBill - s.saBill)} less. The whole saving comes from one band: the first ${h.m(S[0].upTo as number)} of taxable income at ${h.pc(S[0].rate)} rather than ${h.pc(R[0].rate)}. Above that the Scottish basic rate is the same as the rate in the rest of the UK, and Class 4 takes ${h.pc(C4.mainRate)} on both sides of the border, so the gap stays fixed for a while. It starts to close at ${h.m(h.T.scotIntermediateFrom)}, where the ${h.pc(S[2].rate)} intermediate rate begins, and by about ${h.m(flip)} of profit the Scottish bill is the larger one.</p>
${h.table(['Profit', 'Bill rUK', 'Bill Scotland', 'Scotland vs rUK'], rows, `Income Tax and Class 4 through Self Assessment, sole trader with no other income, ${h.P.taxYear}.`, ['r', 'r', 'r', 'r'])}
<h2>The first January with an instalment</h2>
<p>Below ${h.m(h.P.paymentsOnAccount.minBill)} of tax, HMRC collects the bill once a year. At ${h.m(PROFIT)} the bill is ${h.m(r.saBill)}, so the system switches to advance payments. Someone who began trading in ${h.P.taxYear} pays the full bill by ${h.date(cal.payment)} and, in the same transfer, half of it again (${h.m(r.poaEach)}) towards the next year. The second half follows on ${h.date(cal.secondPoa)}. That double January catches many new sole traders off guard, and it is the reason a modest profit can still mean a four-figure payment in one go. The ${h.a('payments-on-account', 'payments on account calculator')} shows the sequence for any bill.</p>
<h2>Monthly set-aside for a ${h.m(PROFIT)} year</h2>
<p>Spread evenly, the ${h.m(r.saBill)} bill is ${h.m(r.saBill / 12)} a month. In a first year with payments on account the target is closer to ${h.m((r.saBill + r.poaEach) / 12)}, so that the January payment is covered. Every pound of extra profit between ${h.m(h.T.pa)} and ${h.m(h.T.basicTo)} costs ${h.pc(R[0].rate + C4.mainRate)}, so a personal trainer who adds a few evening clients can set aside that share of the new money and leave the rest alone. Allowable costs work in reverse at the same rate.</p>`;
  },
});
