import { definePage } from '../../lib/guide-types';

const PROFIT = 100000;

export default definePage({
  id: 'self-employed-tax-on-100000',
  group: 'amounts',
  order: 28,
  tool: { kind: 'se', props: { turnover: PROFIT, expenses: 0 } },
  related: ['self-employed-tax-on-90000', 'self-employed-tax-on-125000', 'personal-allowance-taper', 'pension-tax-relief-self-employed'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'leg_ita_35', 'gov_pension_relief', 'gov_payments_on_account', 'gov_mtd_when'],
  slug: 'self-employed-tax-on-100000',
  nav: '£100,000 profit',
  card: 'The last pound with a full Personal Allowance, and the start of the dearest slice of sole trader profit.',
  title: '£100,000 Self-Employed Tax 2026/27: Where the Taper Starts',
  description: 'Tax on £100,000 of self-employed profit in 2026/27: the bill in rUK and Scotland, the Personal Allowance taper that begins here and how pensions restore it.',
  h1: 'A £100,000 self-employed profit: tax and the allowance taper',
  intro: 'Six figures exactly: the full tax-free allowance survives, but only just.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const IT = h.P.incomeTax;
    return `${h.m(PROFIT)} of profit is the last figure at which a sole trader keeps the whole Personal Allowance of ${h.m(IT.personalAllowance)}. In England, Wales or Northern Ireland the ${h.P.taxYear} bill is ${h.m(r.saBill)}, made of ${h.m(r.it.tax)} Income Tax and ${h.m(r.class4.total)} Class 4, which leaves ${h.m(r.takeHome)}; in Scotland it is ${h.m(s.saBill)}. Beyond this point the allowance is withdrawn, ${h.m(1)} for every ${h.m(1 / IT.taperRate)} of adjusted net income above ${h.m(IT.taperStart)}, so every extra pound of profit is taxed itself and also makes another fifty pence taxable. Over the next ${h.m(h.T.paGone - IT.taperStart)} of profit, the cost of each pound reaches ${h.pc(h.E.marginalOnProfit({ profit: PROFIT + 1000, region: 'ruk' }))} with Class 4 in the rest of the UK and ${h.pc(h.E.marginalOnProfit({ profit: PROFIT + 1000, region: 'scotland' }))} in Scotland, until the allowance is gone at ${h.m(h.T.paGone)}. Gross pension contributions are deducted when adjusted net income is measured, which is why a sole trader whose year ends above six figures can bring that income back to ${h.m(IT.taperStart)} and keep the full allowance.`;
  },
  faqs: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const up = h.E.selfEmployed({ profit: PROFIT + 1000, region: 'ruk' });
    const upS = h.E.selfEmployed({ profit: PROFIT + 1000, region: 'scotland' }), s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const cal = h.E.saCalendar(h.P.year);
    return [
      { q: 'Do I lose any Personal Allowance at exactly £100,000 profit?', a: `No. The taper applies to adjusted net income above ${h.m(h.P.incomeTax.taperStart)}, so at exactly that figure, with no other income, you keep ${h.m(r.it.personalAllowance)}. Bank interest, dividends or a small salary on top would push you over, and each ${h.m(1 / h.P.incomeTax.taperRate)} of excess removes ${h.m(1)} of allowance. A gross pension contribution of the same size cancels the effect.` },
      { q: 'What does £1,000 of extra profit above £100,000 cost a sole trader?', a: `${h.m(up.saBill - r.saBill)} in England, Wales or Northern Ireland, where ${h.pc(h.P.incomeTax.ruk.bands[1].rate)} on the ${h.m(1000)} is joined by the same rate on the ${h.m(1000 * h.P.incomeTax.taperRate)} of allowance lost, plus ${h.pc(h.P.class4.upperRate)} Class 4. In Scotland the advanced rate makes it ${h.m(upS.saBill - s.saBill)}. That leaves well under half of the extra profit in your pocket.` },
      { q: 'How big are payments on account on £100,000 of profit?', a: `Each one is half the bill, ${h.m(r.poaEach)}, due on ${h.date(cal.payment)} and ${h.date(cal.secondPoa)} for a business taxed in England, Wales or Northern Ireland. In a first year of trading at this level, the first January combines the ${h.m(r.saBill)} bill and the first instalment, ${h.m(r.saBill + r.poaEach)} in one payment.` },
    ];
  },
  body: (h) => {
    const IT = h.P.incomeTax, R = IT.ruk.bands, S = IT.scotland.bands, C4 = h.P.class4;
    const rows = [PROFIT, 105000, 110000, 115000, 120000, h.T.paGone].map((p) => {
      const a = h.E.selfEmployed({ profit: p, region: 'ruk' });
      return [h.m(p), h.m(a.it.personalAllowance), h.m(a.it.tax), h.m(a.saBill), h.pc(h.E.marginalOnProfit({ profit: p, region: 'ruk' }))];
    });
    const P1 = 110000, g = 10000;
    const base = h.E.selfEmployed({ profit: P1, region: 'ruk' }), withP = h.E.selfEmployed({ profit: P1, region: 'ruk', pensionGross: g });
    const net = g * (1 - h.P.pension.basicRelief), cut = base.saBill - withP.saBill;
    const st = h.P.mtd.stages[0];
    return `
<h2>The final pound of a full allowance</h2>
<p>The Personal Allowance is the one part of the Income Tax system that depends on the size of your income. Up to ${h.m(IT.taperStart)} of adjusted net income it stays at ${h.m(IT.personalAllowance)}; past that, it is reduced, and at ${h.m(h.T.paGone)} nothing is left. A sole trader with exactly ${h.m(PROFIT)} of profit and no other income is on the last pound of the full allowance. A management consultant who adds ${h.m(500)} of bank interest is already over, which is why the figure on the return matters more than the profit in the accounts. The rule comes from section 35 of the Income Tax Act 2007 (${h.src('leg_ita_35', 'legislation.gov.uk')}).</p>
<h2>A ${h.pc(h.E.marginalOnProfit({ profit: PROFIT + 1000, region: 'ruk' }))} slice above six figures</h2>
<p>Above ${h.m(IT.taperStart)}, a pound of profit is taxed at ${h.pc(R[1].rate)}, and it also takes ${h.m2(IT.taperRate)} off the allowance, which is then taxed at ${h.pc(R[1].rate)} too. Add ${h.pc(C4.upperRate)} Class 4 and the combined cost is the figure in the last column below. Scotland applies its advanced rate of ${h.pc(S[4].rate)} to the same mechanism, so the slice costs ${h.pc(h.E.marginalOnProfit({ profit: PROFIT + 1000, region: 'scotland' }))} there, and a Scottish bill of ${h.m(h.E.selfEmployed({ profit: PROFIT, region: 'scotland' }).saBill)} at six figures becomes ${h.m(h.E.selfEmployed({ profit: h.T.paGone, region: 'scotland' }).saBill)} by the time the allowance has gone. The ${h.a('personal-allowance-taper', 'taper page')} covers the same effect for people with a salary as well as profit.</p>
${h.table(['Profit', 'Personal Allowance', 'Income Tax', 'Bill with Class 4', 'Next pound costs'], rows, `Sole trader in England, Wales or Northern Ireland, no other income, ${h.P.taxYear}.`, ['r', 'r', 'r', 'r', 'r'])}
<h2>Getting back to ${h.m(IT.taperStart)} with a pension</h2>
<p>Adjusted net income is measured after gross pension contributions. Take a surveyor whose profit comes in at ${h.m(P1)}. Paying ${h.m(net)} into a personal pension, grossed up to ${h.m(g)} by the provider, brings adjusted net income back to ${h.m(P1 - g)}, restores the whole allowance and cuts the Self Assessment bill by ${h.m(cut)}. The pension receives ${h.m(g)}; the real cost is ${h.m(net - cut)}. Relief on this slice runs at the full taper rate rather than the ordinary higher rate, and Class 4 is left untouched. The ${h.a('pension-tax-relief-self-employed', 'pension relief calculator')} runs the same sum for other profits.</p>
<h2>Six-figure paperwork</h2>
<p>A business at this profit pays in instalments of ${h.m(h.E.selfEmployed({ profit: PROFIT, region: 'ruk' }).poaEach)}, and if its turnover was similar in ${st.basisYear}, it has been inside Making Tax Digital since ${h.date(st.start)}, because the first wave covered qualifying income over ${h.m(st.threshold)} on that return. Quarterly updates do not change the amount of tax. They do make it easier to see, part way through the year, whether profit is heading past ${h.m(IT.taperStart)} while a contribution can still be made inside the tax year.</p>`;
  },
});
