import { definePage } from '../../lib/guide-types';

const PROFIT = 15000;

export default definePage({
  id: 'self-employed-tax-on-15000',
  group: 'amounts',
  order: 20,
  tool: { kind: 'se', props: { turnover: PROFIT, expenses: 0 } },
  related: ['self-employed-tax-on-20000', 'class-2-national-insurance', 'trading-allowance', 'payments-on-account'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_payments_on_account', 'gov_trading_allowance', 'gov_scottish_income_tax'],
  slug: 'self-employed-tax-on-15000',
  nav: '£15,000 profit',
  card: 'A three-figure bill, Class 2 treated as paid and no payment on account to fund in January.',
  title: '£15,000 Self-Employed Tax 2026/27: Small Bill, Full NI Year',
  description: 'Tax on £15,000 of self-employed profit in 2026/27: a modest Income Tax and Class 4 bill, Class 2 treated as paid, and why no payment on account is due yet.',
  h1: 'Self-employed tax on £15,000 of profit',
  intro: 'A first-rung profit: most of it is tax-free, the National Insurance year is protected and January stays light.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    return `A sole trader in England, Wales or Northern Ireland with ${h.m(PROFIT)} of profit in ${h.P.taxYear} owes ${h.m(r.it.tax)} of Income Tax and ${h.m(r.class4.total)} of Class 4 National Insurance, a Self Assessment bill of ${h.m(r.saBill)} that leaves ${h.m(r.takeHome)} to live on. Only ${h.m(PROFIT - h.T.pa)} of the year is taxed at all, because the first ${h.m(h.T.pa)} is covered both by the Personal Allowance and by the Class 4 lower profits limit, so the bill works out at ${h.pc(Math.round(r.setAside * 1000) / 1000)} of the profit. In Scotland it falls slightly, to ${h.m(s.saBill)}, since the taxed slice sits in the ${h.pc(h.P.incomeTax.scotland.bands[0].rate)} starter band. Two quieter things happen at this level. Profit is above the small profits threshold of ${h.m(h.T.spt)}, so Class 2 contributions are treated as paid and the National Insurance record is protected without any voluntary payment. And because the bill stays below ${h.m(h.P.paymentsOnAccount.minBill)}, HMRC does not ask for payments on account towards the following year.`;
  },
  faqs: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const C2 = h.P.class2, TA = h.P.tradingAllowance.amount;
    const withAllowance = h.E.selfEmployed({ profit: PROFIT + 3000 - TA, region: 'ruk' });
    let poaFrom = PROFIT; while (!h.E.selfEmployed({ profit: poaFrom, region: 'ruk' }).poaDue) poaFrom += 10;
    return [
      { q: 'Is Class 2 National Insurance treated as paid on £15,000 of profit?', a: `Yes. At ${h.m(PROFIT)} you are well above the small profits threshold of ${h.m(h.T.spt)}, so HMRC treats Class 2 as paid and the year protects your National Insurance record. Nothing is added to the bill for it. Only a profit under that threshold would leave you deciding whether to pay voluntary Class 2 at ${h.m2(C2.weeklyRate)} a week, ${h.m2(C2.weeklyRate * C2.weeks)} for a full year.` },
      { q: 'Will HMRC ask for payments on account if I make £15,000 profit?', a: `Not if this is your only income. The bill of ${h.m(r.saBill)} is under the ${h.m(h.P.paymentsOnAccount.minBill)} line below which payments on account are not required, so January brings that sum and nothing towards the next year. With no other income, the line is crossed at about ${h.m(poaFrom)} of profit; from there each advance payment is half of the previous bill.` },
      { q: 'How much should I put aside each month on £15,000 self-employed profit?', a: `Around ${h.m(r.saBill / 12)} a month covers the ${h.m(r.saBill)} bill in England, Wales or Northern Ireland; a Scottish taxpayer needs about ${h.m(s.saBill / 12)}. A tutor or cleaner with uneven months can work the other way: keep back ${h.pc(h.P.incomeTax.ruk.bands[0].rate + h.P.class4.mainRate)} of whatever is earned once the year passes ${h.m(h.T.pa)} of profit, since that is what each of those pounds costs.` },
      { q: `Can I use the ${h.m(TA)} trading allowance instead of expenses on £15,000?`, a: `You can, but it replaces your real costs rather than adding to them. A driver with ${h.m(PROFIT + 3000)} of takings and ${h.m(3000)} of fuel and insurance has ${h.m(PROFIT)} of profit; claiming the allowance instead would leave ${h.m(PROFIT + 3000 - TA)} taxable and lift the bill by ${h.m(withAllowance.saBill - r.saBill)}. It only helps when genuine expenses are below ${h.m(TA)}.` },
    ];
  },
  body: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const R = h.P.incomeTax.ruk.bands, S = h.P.incomeTax.scotland.bands, C4 = h.P.class4, C2 = h.P.class2;
    const min = h.P.paymentsOnAccount.minBill;
    let poaFrom = PROFIT; while (!h.E.selfEmployed({ profit: poaFrom, region: 'ruk' }).poaDue) poaFrom += 10;
    const cal = h.E.saCalendar(h.P.year);
    const next = h.E.selfEmployed({ profit: 20000, region: 'ruk' });
    const rows = [h.T.spt, 10000, h.T.pa, PROFIT, poaFrom, 20000].map((p) => {
      const a = h.E.selfEmployed({ profit: p, region: 'ruk' });
      return [h.m(p), a.class2.credited ? 'Treated as paid' : 'Voluntary', h.m(a.it.tax), h.m(a.class4.total), h.m(a.saBill), a.poaDue ? h.m(a.poaEach) + ' each' : 'None'];
    });
    return `
<h2>Class 2 credited, Class 4 barely started</h2>
<p>Two National Insurance thresholds sit below this profit, and they do different jobs. Above ${h.m(h.T.spt)}, Class 2 contributions count as paid even though nobody pays them. Above ${h.m(C4.lowerProfitsLimit)}, Class 4 starts at ${h.pc(C4.mainRate)}. A self-employed gardener on ${h.m(PROFIT)} is past both, but only just past the second: Class 4 bites on ${h.m(PROFIT - C4.lowerProfitsLimit)} and comes to ${h.m(r.class4.total)}. Compare a first-year trader who finishes on ${h.m(6000)}. That person pays no Class 4 and gets no automatic Class 2 credit either, so the year is a gap in the record unless voluntary Class 2 is bought at ${h.m2(C2.weeklyRate)} a week. Getting over ${h.m(h.T.spt)} quietly removes that decision.</p>
<h2>Building the ${h.m(r.saBill)} bill</h2>
<p>Income Tax is simple at this level. Take away the Personal Allowance of ${h.m(h.T.pa)}, and ${h.m(PROFIT - h.T.pa)} remains, all of it at the basic rate of ${h.pc(R[0].rate)}: ${h.m(r.it.tax)}. Class 4 uses the same starting point, which is why the two charges move in step until much higher up. In Scotland the taxable slice is small enough to fit inside the starter band, the first ${h.m(S[0].upTo as number)} of taxable income at ${h.pc(S[0].rate)}, so Income Tax there is ${h.m(s.it.tax)}. The table follows the same person from the Class 2 threshold up to ${h.m(20000)}.</p>
${h.table(['Profit', 'Class 2', 'Income Tax', 'Class 4', 'Bill', 'Payments on account'], rows, `England, Wales and Northern Ireland, sole trader with no other income, ${h.P.taxYear}.`, ['r', 'l', 'r', 'r', 'r', 'r'])}
<h2>No payment on account below ${h.m(min)}</h2>
<p>Payments on account are advance instalments towards next year, each half of the last bill. HMRC skips them when the last bill was under ${h.m(min)}, or when more than ${h.pc(h.P.paymentsOnAccount.atSourceShare)} of the tax was already collected at source. For the ${h.P.taxYear} year, that means a single payment of ${h.m(r.saBill)} by ${h.date(cal.payment)}. The comfortable position does not last long if the business grows. With no other income, the line is crossed at about ${h.m(poaFrom)} of profit. A year of ${h.m(20000)} would mean ${h.m(next.saBill)} for the year itself plus a first instalment of ${h.m(next.poaEach)} in the same January, then another ${h.m(next.poaEach)} on ${h.date(cal.secondPoa)}. More on that on the ${h.a('payments-on-account', 'payments on account page')}.</p>
<h2>Trading allowance or real costs</h2>
<p>The ${h.m(h.P.tradingAllowance.amount)} ${h.a('trading-allowance', 'trading allowance')} is often mentioned to people starting out, but at ${h.m(PROFIT)} of profit it is rarely the better claim. It replaces actual expenses rather than sitting on top of them. A dog walker with almost no costs might gain a little from it; a mobile hairdresser buying products, or a courier paying for a van, will usually record more than ${h.m(h.P.tradingAllowance.amount)} of genuine expenses and keep them. Every pound of allowable cost saves ${h.pc(R[0].rate + C4.mainRate)} here, the combined rate on profit between ${h.m(h.T.pa)} and ${h.m(h.T.basicTo)}. The ${h.a('self-employed-expenses', 'expenses guide')} lists what HMRC accepts, and the calculator above shows the bill once your own figures are in.</p>`;
  },
});
