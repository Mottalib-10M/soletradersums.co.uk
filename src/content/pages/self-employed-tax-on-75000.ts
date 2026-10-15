import { definePage } from '../../lib/guide-types';

const PROFIT = 75000;

export default definePage({
  id: 'self-employed-tax-on-75000',
  group: 'amounts',
  order: 26,
  tool: { kind: 'se', props: { turnover: PROFIT, expenses: 0 } },
  related: ['self-employed-tax-on-60000', 'self-employed-tax-on-90000', 'pension-tax-relief-self-employed', 'self-employed-tax-scotland'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_scottish_income_tax', 'gov_pension_relief', 'gov_hicbc'],
  slug: 'self-employed-tax-on-75000',
  nav: '£75,000 profit',
  card: 'The last pound of the Scottish higher band, and the profit at which pension relief is worth most per pound.',
  title: '£75,000 Self-Employed Tax 2026/27: Scottish Advanced Rate',
  description: 'Tax on £75,000 of self-employed profit in 2026/27: Income Tax and Class 4 in rUK and Scotland, the Scottish advanced rate from £75,001 and pension relief.',
  h1: 'Self-employed tax on £75,000: rest of the UK and Scotland',
  intro: 'Scotland moves its sole traders into the advanced rate one pound above this profit, which makes pension relief unusually valuable here.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const S = h.P.incomeTax.scotland.bands;
    return `A sole trader with ${h.m(PROFIT)} of profit in England, Wales or Northern Ireland owes ${h.m(r.saBill)} for ${h.P.taxYear}, made of ${h.m(r.it.tax)} Income Tax and ${h.m(r.class4.total)} Class 4, and keeps ${h.m(r.takeHome)}. The same trader in Scotland owes ${h.m(s.saBill)}, which is ${h.m(s.saBill - r.saBill)} more. That difference is about to grow faster. With the standard Personal Allowance, the Scottish higher rate of ${h.pc(S[3].rate)} ends at ${h.m(h.T.scotAdvancedFrom - 1)} and the advanced rate of ${h.pc(S[4].rate)} takes over from ${h.m(h.T.scotAdvancedFrom)}, so the next pound of Scottish profit costs ${h.pc(h.E.marginalOnProfit({ profit: PROFIT, region: 'scotland' }))} with Class 4, against ${h.pc(h.E.marginalOnProfit({ profit: PROFIT, region: 'ruk' }))} elsewhere. Pension contributions are worth looking at closely at this level. Every gross pound paid into a personal pension comes off the top slice of income, so relief runs at the higher rate in the rest of the UK and at ${h.pc(S[3].rate)} or more in Scotland, while Class 4 is left unchanged.`;
  },
  faqs: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const S = h.P.incomeTax.scotland.bands;
    const g = 5000, net = g * (1 - h.P.pension.basicRelief);
    const pr = h.E.selfEmployed({ profit: PROFIT, region: 'ruk', pensionGross: g });
    const ps = h.E.selfEmployed({ profit: PROFIT, region: 'scotland', pensionGross: g });
    const s0 = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    return [
      { q: 'Does £75,000 profit in Scotland reach the advanced rate?', a: `Not quite. With the full Personal Allowance, the ${h.pc(S[4].rate)} advanced rate starts at ${h.m(h.T.scotAdvancedFrom)} of income, so a profit of exactly ${h.m(PROFIT)} is taxed at no more than ${h.pc(S[3].rate)}. Any extra profit, or other income such as bank interest above your allowances, pushes the top slice into the advanced band, where each pound costs ${h.pc(S[4].rate + h.P.class4.upperRate)} with Class 4.` },
      { q: 'What does a £5,000 pension contribution really cost on £75,000 profit?', a: `You pay ${h.m(net)} to the provider, which claims the basic relief to make ${h.m(g)}. Your return then cuts the bill by ${h.m(r.saBill - pr.saBill)} in England, Wales or Northern Ireland, so the contribution costs ${h.m(net - (r.saBill - pr.saBill))}. In Scotland the reduction is ${h.m(s0.saBill - ps.saBill)} and the cost ${h.m(net - (s0.saBill - ps.saBill))}, because the slice relieved was taxed at ${h.pc(S[3].rate)}.` },
      { q: 'What is the take-home on £75,000 self-employed profit in England?', a: `${h.m(r.takeHome)} for ${h.P.taxYear}, or about ${h.m(r.takeHome / 12)} a month, once ${h.m(r.it.tax)} of Income Tax and ${h.m(r.class4.total)} of Class 4 are paid, with no other income and no student loan. Wales and Northern Ireland give the same result. A parent claiming Child Benefit would also repay ${h.E.childBenefitCharge(PROFIT, 1).pct} per cent of it at this income.` },
    ];
  },
  body: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const R = h.P.incomeTax.ruk.bands, S = h.P.incomeTax.scotland.bands, B = h.P.pension.basicRelief, H = h.P.hicbc;
    const rows = [2000, 5000, 10000, 15000].map((g) => {
      const a = h.E.selfEmployed({ profit: PROFIT, region: 'ruk', pensionGross: g }), b = h.E.selfEmployed({ profit: PROFIT, region: 'scotland', pensionGross: g });
      return [h.m(g), h.m(g * (1 - B)), h.m(r.saBill - a.saBill), h.m(g * (1 - B) - (r.saBill - a.saBill)), h.m(s.saBill - b.saBill), h.m(g * (1 - B) - (s.saBill - b.saBill))];
    });
    const d90 = h.E.selfEmployed({ profit: 90000, region: 'scotland' }).saBill - h.E.selfEmployed({ profit: 90000, region: 'ruk' }).saBill;
    const cal = h.E.saCalendar(h.P.year);
    const cb = h.E.childBenefitCharge(PROFIT, 2);
    return `
<h2>The last pound of the Scottish higher band</h2>
<p>Scotland has six Income Tax rates, against three in the rest of the UK, and the fifth one starts here. Taxable income above ${h.m(S[3].upTo as number)}, which means ${h.m(h.T.scotAdvancedFrom)} of profit once the Personal Allowance is added back, is charged at ${h.pc(S[4].rate)}. It runs all the way to ${h.m(h.T.paGone)}, where the top rate of ${h.pc(S[5].rate)} begins. A Scottish architect who finishes the year on ${h.m(PROFIT)} has used up the higher band to the pound. A good final quarter would be taxed at ${h.pc(S[4].rate)} instead of ${h.pc(S[3].rate)}, before the ${h.pc(h.P.class4.upperRate)} Class 4 that applies on all profit above ${h.m(h.T.upl)}.</p>
<h2>What a pension contribution really costs at this profit</h2>
<p>Relief at source works in two steps. The provider adds the basic ${h.pc(B)} to what you pay, and the tax return gives back the rest of the rate charged on the slice of income the contribution covers. In the rest of the UK that slice is taxed at ${h.pc(R[1].rate)}; in Scotland at ${h.pc(S[3].rate)}, so the extra relief there is a little larger. Class 4 is charged on profit and does not change. The table puts numbers on four contribution sizes.</p>
${h.table(['Gross contribution', 'You pay the provider', 'Bill cut rUK', 'Real cost rUK', 'Bill cut Scotland', 'Real cost Scotland'], rows, `Sole trader on ${h.m(PROFIT)} of profit, relief-at-source pension, ${h.P.taxYear}.`, ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>All four sizes fit inside the slice of profit taxed at the higher rate, so the cost per pound is the same in every row. Higher-rate relief would run out only for contributions beyond ${h.m(PROFIT - h.T.basicTo)} in the rest of the UK, or ${h.m(PROFIT - h.T.scotHigherFrom + 1)} in Scotland. The ${h.a('pension-tax-relief-self-employed', 'pension relief calculator')} works out the cut for any profit and any amount.</p>
<h2>A border gap that widens from here</h2>
<p>At ${h.m(PROFIT)} a Scottish sole trader pays ${h.m(s.saBill - r.saBill)} more than one in Newport or Newry. Up to this point the difference grew by ${h.pc(S[3].rate - R[1].rate)} on each pound of higher-rate profit; past ${h.m(h.T.scotAdvancedFrom)} it grows by ${h.pc(S[4].rate - R[1].rate)}. At ${h.m(90000)} of profit the gap is ${h.m(d90)}. The ${h.a('self-employed-tax-scotland', 'Scottish tax page')} sets the bands side by side.</p>
<h2>Instalments and the Child Benefit charge</h2>
<p>A business that is settled at this level pays two instalments of ${h.m(r.poaEach)}, on ${h.date(cal.payment)} and ${h.date(cal.secondPoa)}. Parents should add the High Income Child Benefit Charge: at ${h.m(PROFIT)} of adjusted net income, ${cb.pct} per cent of the year's benefit is repaid, ${h.m(cb.charge)} for two children, and the whole of it goes at ${h.m(H.end)}. The pension contributions above also reduce that charge.</p>`;
  },
});
