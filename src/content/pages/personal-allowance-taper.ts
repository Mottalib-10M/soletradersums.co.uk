import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'personal-allowance-taper',
  group: 'tax',
  order: 10,
  tool: { kind: 'mini:taper', props: { income: 110000, region: 0 } },
  related: ['self-employed-tax-on-100000', 'self-employed-tax-on-125000', 'pension-tax-relief-self-employed', 'child-benefit-charge-self-employed'],
  sources: ['gov_income_tax_rates', 'leg_ita_35', 'gov_scottish_income_tax', 'gov_se_nic', 'gov_pension_relief'],
  slug: 'personal-allowance-taper',
  nav: 'The £100,000 trap',
  card: 'Between £100,000 and £125,140 the allowance melts away: 62 % on each pound, 69.5 % in Scotland.',
  title: 'Personal Allowance Taper 2026/27: the £100,000 Tax Trap',
  description: 'Personal Allowance taper for sole traders in 2026/27: how £100,000 to £125,140 costs 62 % a pound (69.5 % in Scotland) and how pension or Gift Aid wins it back.',
  h1: 'The £100,000 trap: the Personal Allowance taper',
  intro: 'Above £100,000 of adjusted net income the tax-free allowance shrinks, and the slice up to £125,140 is the most heavily taxed of all.',
  resume: (h) => {
    const T = h.T;
    const ruk = h.E.marginalOnProfit({ profit: T.taperStart, region: 'ruk' }, 1000);
    const sco = h.E.marginalOnProfit({ profit: T.taperStart, region: 'scotland' }, 1000);
    const at110 = h.E.personalAllowance(110000);
    return `A sole trader in England, Wales or Northern Ireland whose adjusted net income sits between ${h.m(T.taperStart)} and ${h.m(T.paGone)} pays ${h.pc(ruk)} on each extra pound of profit in ${h.P.taxYear}, once Income Tax and Class 4 are added together; a Scottish taxpayer in the same slice pays ${h.pc(sco)}. The reason is the taper written into section 35 of the Income Tax Act 2007: the ${h.m(T.pa)} Personal Allowance falls by £1 for every ${h.m(1 / h.P.incomeTax.taperRate)} of income above ${h.m(T.taperStart)}, so each pound earned drags another ${h.m2(h.P.incomeTax.taperRate)} out of the tax-free band and into the higher rate. At ${h.m(110000)} only ${h.m(at110)} of allowance is left; at ${h.m(T.paGone)} there is none. Adjusted net income is not the same as profit: gross personal pension contributions and Gift Aid donations come off it first, which is why they are the usual way out of the trap. Enter your figure below to see the allowance you keep and the contribution that restores it in full.`;
  },
  faqs: (h) => {
    const T = h.T;
    const ruk = h.E.marginalOnProfit({ profit: T.taperStart, region: 'ruk' }, 1000);
    const sco = h.E.marginalOnProfit({ profit: T.taperStart, region: 'scotland' }, 1000);
    const higher = h.P.incomeTax.ruk.bands[1].rate, adv = h.P.incomeTax.scotland.bands[4].rate;
    const base = h.E.selfEmployed({ profit: 115000, region: 'ruk' });
    const withPen = h.E.selfEmployed({ profit: 115000, region: 'ruk', pensionGross: 15000 });
    return [
      { q: 'Why is the tax rate 62% on self-employed profit between £100,000 and £125,140?', a: `Each extra £1 is taxed at the ${h.pc(higher)} higher rate and also removes ${h.m2(h.P.incomeTax.taperRate)} of Personal Allowance, which then gets taxed at ${h.pc(higher)} too. That makes ${h.pc(higher * (1 + h.P.incomeTax.taperRate))} of Income Tax, and Class 4 adds ${h.pc(h.P.class4.upperRate)} above ${h.m(T.upl)}. The combined ${h.pc(ruk)} stops at ${h.m(T.paGone)}, where the allowance has gone and the additional rate begins.` },
      { q: 'How much pension do I need to pay to get my full Personal Allowance back?', a: `A gross contribution equal to the amount by which your adjusted net income exceeds ${h.m(T.taperStart)}. On ${h.m(115000)} of profit that is ${h.m(15000)} gross: you pay the provider ${h.m(15000 * (1 - h.P.pension.basicRelief))}, it claims the rest from HMRC, and your Self Assessment bill falls by ${h.m(base.saBill - withPen.saBill)} in England, Wales or Northern Ireland.` },
      { q: 'Is the £100,000 tax trap worse for Scottish sole traders?', a: `Yes. In the taper slice a Scottish taxpayer is in the advanced rate band at ${h.pc(adv)}, so each pound costs ${h.pc(adv)} plus the lost allowance taxed at the same rate, ${h.pc(adv * (1 + h.P.incomeTax.taperRate))} in all, and Class 4 takes it to ${h.pc(sco)}. Class 4 itself uses the same UK limits everywhere, so the whole gap with England comes from Income Tax.` },
      { q: 'Do Gift Aid donations reduce adjusted net income for the taper?', a: `Yes. Adjusted net income is your total taxable income before allowances, less certain reliefs, and GOV.UK names pension contributions and Gift Aid among them. A self-employed designer at ${h.m(104000)} who gives to charity under Gift Aid therefore lowers the income tested against ${h.m(T.taperStart)} and keeps more of the ${h.m(T.pa)} allowance.` },
    ];
  },
  body: (h) => {
    const T = h.T, IT = h.P.incomeTax;
    const higher = IT.ruk.bands[1].rate, addl = IT.ruk.bands[2].rate;
    const rows = [T.taperStart, 105000, 110000, 115000, 120000, T.paGone].map((p) => {
      const a = h.E.selfEmployed({ profit: p, region: 'ruk' }), s = h.E.selfEmployed({ profit: p, region: 'scotland' });
      return [h.m(p), h.m(h.E.personalAllowance(p)), h.m(a.saBill), h.m(s.saBill)];
    });
    const below = h.E.marginalOnProfit({ profit: T.taperStart - 1000, region: 'ruk' }, 1000);
    const inside = h.E.marginalOnProfit({ profit: T.taperStart, region: 'ruk' }, 1000);
    const above = h.E.marginalOnProfit({ profit: T.paGone, region: 'ruk' }, 1000);
    const lo = h.E.selfEmployed({ profit: T.taperStart, region: 'ruk' }), hi = h.E.selfEmployed({ profit: 120000, region: 'ruk' });
    const P0 = 112000, gross = P0 - T.taperStart;
    const b0 = h.E.selfEmployed({ profit: P0, region: 'ruk' }), b1 = h.E.selfEmployed({ profit: P0, region: 'ruk', pensionGross: gross });
    const atSource = gross * h.P.pension.basicRelief, viaSA = b0.saBill - b1.saBill;
    return `
<h2>Three marginal rates in a row</h2>
<p>Follow the cost of an extra ${h.m(1000)} invoice as a consultant’s profit climbs. Just under ${h.m(T.taperStart)} it costs ${h.pc(below)}: higher-rate Income Tax plus the small Class 4 rate. Once adjusted net income passes ${h.m(T.taperStart)}, the same invoice costs ${h.pc(inside)}, because half of it also strips allowance away. From ${h.m(T.paGone)} the allowance has gone, the additional rate of ${h.pc(addl)} applies, and the marginal cost settles back to ${h.pc(above)}. The dearest pounds are therefore not the top ones but the ${h.m(T.paGone - T.taperStart)} in the middle. Going from ${h.m(T.taperStart)} to ${h.m(120000)} of profit adds ${h.m(hi.saBill - lo.saBill)} to the Self Assessment bill in England, Wales or Northern Ireland.</p>
${h.table(['Adjusted net income', 'Allowance left', 'Bill rUK', 'Bill Scotland'], rows, `Sole trader with no other income and no pension contributions, ${h.P.taxYear}. Bill = Income Tax and Class 4.`, ['r', 'r', 'r', 'r'])}
<h2>Profit is only the starting point</h2>
<p>The test uses adjusted net income, not the profit on your return. Begin with all taxable income: trading profit, any salary, rent, savings interest and dividends. Then take off gross personal pension contributions and Gift Aid donations. A photographer with ${h.m(96000)} of profit and ${h.m(6000)} of dividends from old shares is over the line even though the business alone is not, and a locum pharmacist at ${h.m(108000)} who pays ${h.m(8000)} gross into a personal pension is not in the taper at all. Payments on account are worked out from the bill, so a year spent in the taper also inflates the two advance payments for the following year (see ${h.a('payments-on-account', 'payments on account')}).</p>
<h2>Winning the allowance back with a pension</h2>
<p>Contributions to a relief-at-source pension work in two places. The provider adds basic-rate relief straight away, and your tax return claims the rest of the relief while lowering adjusted net income by the gross amount. Take a sole trader with ${h.m(P0)} of profit who pays ${h.m(gross)} gross, exactly the excess over ${h.m(T.taperStart)}. The provider claims ${h.m(atSource)} from HMRC, so the cash leaving the business account is ${h.m(gross - atSource)}. Self Assessment then cuts the bill by ${h.m(viaSA)}, because the full ${h.m(T.pa)} allowance comes back and the contribution earns relief at ${h.pc(higher)} rather than ${h.pc(h.P.pension.basicRelief)}. The pension pot rises by ${h.m(gross)} for a net cost of ${h.m(gross - atSource - viaSA)}. Class 4 does not move, because it is charged on profit rather than income. The ${h.a('pension-tax-relief-self-employed', 'pension relief calculator')} works out other amounts.</p>
${h.box('Timing matters', `<p>Relief is given on contributions paid in the tax year, which for ${h.P.taxYear} runs to ${h.date(h.P.valid_to)}. A sole trader only knows the final profit after the year closes, so the usual approach is a rough estimate in February or March from the bookkeeping so far, with any shortfall left for the following year.</p>`, 'tip')}
<h2>Other figures that move with it</h2>
<p>Adjusted net income also drives the ${h.a('child-benefit-charge-self-employed', 'High Income Child Benefit Charge')}, which has already taken back all the Child Benefit by the time income reaches ${h.m(h.P.hicbc.end)}, so a parent in the taper pays that charge in full as well. The ${h.a('self-employed-tax-on-100000', '£100,000 profit page')} and the ${h.a('self-employed-tax-on-125000', '£125,000 profit page')} show full bills on either side of the trap. Sources: ${h.src('gov_income_tax_rates')}; ${h.src('leg_ita_35')}.</p>`;
  },
});
