import { definePage } from '../../lib/guide-types';

const PROFIT = 125000;

export default definePage({
  id: 'self-employed-tax-on-125000',
  group: 'amounts',
  order: 29,
  tool: { kind: 'se', props: { turnover: PROFIT, expenses: 0 } },
  related: ['self-employed-tax-on-100000', 'personal-allowance-taper', 'pension-tax-relief-self-employed', 'self-employed-tax-scotland'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_scottish_income_tax', 'leg_ita_35', 'gov_pension_relief'],
  slug: 'self-employed-tax-on-125000',
  nav: '£125,000 profit',
  card: 'A sliver of allowance left, then the additional rate in the rest of the UK and the top rate in Scotland.',
  title: '£125,000 Self-Employed Tax 2026/27: Allowance Almost Gone',
  description: 'Tax on £125,000 of self-employed profit in 2026/27: the tapered allowance, the additional and Scottish top rates just above, and a pension that wins it back.',
  h1: 'Self-employed profit of £125,000: what the tax looks like',
  intro: 'The end of the Personal Allowance taper, a few pounds before the highest rates of Income Tax begin.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const R = h.P.incomeTax.ruk.bands, S = h.P.incomeTax.scotland.bands;
    const after = h.T.paGone + 1000;
    return `On ${h.m(PROFIT)} of profit, a sole trader in England, Wales or Northern Ireland owes ${h.m(r.saBill)} for ${h.P.taxYear}, ${h.m(r.it.tax)} of Income Tax and ${h.m(r.class4.total)} of Class 4, and keeps ${h.m(r.takeHome)}. A Scottish taxpayer owes ${h.m(s.saBill)}. Only ${h.m(r.it.personalAllowance)} of the Personal Allowance survives, because the taper has already removed the rest of the ${h.m(h.P.incomeTax.personalAllowance)}. It vanishes entirely at ${h.m(h.T.paGone)}, just ${h.m(h.T.paGone - PROFIT)} further on, and that same figure is where the additional rate of ${h.pc(R[2].rate)} begins in the rest of the UK and the top rate of ${h.pc(S[5].rate)} in Scotland. This profit therefore sits at the very end of the dearest stretch of the system: the next pound still costs ${h.pc(h.E.marginalOnProfit({ profit: PROFIT, region: 'ruk' }))} with Class 4, or ${h.pc(h.E.marginalOnProfit({ profit: PROFIT, region: 'scotland' }))} in Scotland. Once the allowance is spent, the cost of a new pound actually falls, to ${h.pc(h.E.marginalOnProfit({ profit: after, region: 'ruk' }))} and ${h.pc(h.E.marginalOnProfit({ profit: after, region: 'scotland' }))}. A pension contribution large enough to bring adjusted net income down to ${h.m(h.P.incomeTax.taperStart)} restores the whole allowance.`;
  },
  faqs: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const R = h.P.incomeTax.ruk.bands, S = h.P.incomeTax.scotland.bands;
    const g = PROFIT - h.P.incomeTax.taperStart, net = g * (1 - h.P.pension.basicRelief);
    const w = h.E.selfEmployed({ profit: PROFIT, region: 'ruk', pensionGross: g });
    return [
      { q: 'How much Personal Allowance is left at £125,000 profit?', a: `${h.m(r.it.personalAllowance)}, if the profit is your only income. The allowance of ${h.m(h.P.incomeTax.personalAllowance)} loses ${h.m(1)} for every ${h.m(1 / h.P.incomeTax.taperRate)} of adjusted net income over ${h.m(h.P.incomeTax.taperStart)}, and ${h.m(PROFIT - h.P.incomeTax.taperStart)} of excess removes all but that last sliver. At ${h.m(h.T.paGone)} or more nothing is left, which is where the allowance stops being a factor at all.` },
      { q: 'Is £125,000 of self-employed profit taxed at the additional rate?', a: `Not yet. In England, Wales and Northern Ireland the ${h.pc(R[2].rate)} rate applies to taxable income above ${h.m(R[1].upTo as number)}, and with ${h.m(r.it.personalAllowance)} of allowance left your taxable income is ${h.m(PROFIT - r.it.personalAllowance)}. In Scotland the ${h.pc(S[5].rate)} top rate uses the same line. Another ${h.m(h.T.additionalFrom - PROFIT)} of profit, or a little bank interest, would cross it.` },
      { q: 'What would a £25,000 pension contribution save on £125,000 of profit?', a: `It brings adjusted net income down to ${h.m(h.P.incomeTax.taperStart)}, restoring the full allowance. You pay ${h.m(net)} and the provider adds the basic relief; your Self Assessment bill then falls from ${h.m(r.saBill)} to ${h.m(w.saBill)} in England, Wales or Northern Ireland, a cut of ${h.m(r.saBill - w.saBill)}. The ${h.m(g)} in the pension costs you ${h.m(net - (r.saBill - w.saBill))}.` },
    ];
  },
  body: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const IT = h.P.incomeTax, R = IT.ruk.bands, S = IT.scotland.bands, C4 = h.P.class4;
    const rows = [120000, PROFIT, h.T.paGone, 130000, 150000, 200000].map((p) => {
      const a = h.E.selfEmployed({ profit: p, region: 'ruk' }), b = h.E.selfEmployed({ profit: p, region: 'scotland' });
      return [h.m(p), h.m(a.it.personalAllowance), h.m(a.it.tax), h.pc(h.E.marginalOnProfit({ profit: p, region: 'ruk' })), h.m(b.it.tax), h.pc(h.E.marginalOnProfit({ profit: p, region: 'scotland' }))];
    });
    const g = PROFIT - IT.taperStart;
    const ws = h.E.selfEmployed({ profit: PROFIT, region: 'scotland', pensionGross: g });
    const cal = h.E.saCalendar(h.P.year);
    return `
<h2>${h.m(r.it.personalAllowance)} of allowance and no more</h2>
<p>The taper has done almost all its work by this point. Each ${h.m(1 / IT.taperRate)} of income over ${h.m(IT.taperStart)} has taken ${h.m(1)} away, and ${h.m(PROFIT - IT.taperStart)} of excess leaves ${h.m(r.it.personalAllowance)}. A barrister or a software contractor finishing the year here is paying higher-rate tax on almost every pound above the basic band, plus the tax on the allowance that has been clawed back. Bank interest or a dividend from a small shareholding counts towards adjusted net income too, so a modest amount of either on top of this profit would take the allowance the rest of the way. The table follows the same profit a little further, to show what happens once there is nothing left to withdraw.</p>
${h.table(['Profit', 'Allowance', 'Income Tax rUK', 'Next pound rUK', 'Income Tax Scotland', 'Next pound Scotland'], rows, `Sole trader with no other income, ${h.P.taxYear}; the next-pound rate includes Class 4.`, ['r', 'r', 'r', 'r', 'r', 'r'])}
<h2>Into the additional rate</h2>
<p>From ${h.m(h.T.additionalFrom)} of taxable income, the rest of the UK charges ${h.pc(R[2].rate)}. With the allowance already gone, that is also the profit figure, so the bands line up neatly with the end of the taper. The rate on new profit then drops from ${h.pc(h.E.marginalOnProfit({ profit: PROFIT, region: 'ruk' }))} to ${h.pc(R[2].rate + C4.upperRate)}, the additional rate plus ${h.pc(C4.upperRate)} Class 4, and stays there however high profit goes. Pension relief changes shape too: on income taxed at ${h.pc(R[2].rate)}, the return gives back an extra ${h.pc(R[2].rate - h.P.pension.basicRelief)} on top of the basic relief claimed by the provider.</p>
<h2>Scotland's ${h.pc(S[5].rate)} band</h2>
<p>Scotland uses the same ${h.m(h.T.scotTopFrom)} line for its top rate, so a Scottish sole trader goes straight from the advanced rate of ${h.pc(S[4].rate)}, inflated by the taper, to ${h.pc(S[5].rate)} on everything above. With Class 4 the next pound then costs ${h.pc(S[5].rate + C4.upperRate)}. At ${h.m(PROFIT)} the Scottish bill is ${h.m(s.saBill)}, ${h.m(s.saBill - r.saBill)} more than in the rest of the UK, and the gap keeps widening by ${h.pc(S[5].rate - R[2].rate)} of each further pound. The ${h.a('self-employed-tax-scotland', 'Scottish tax page')} has the full set of bands.</p>
<h2>Recovering the allowance in one contribution</h2>
<p>Because gross pension contributions come off adjusted net income, a contribution of ${h.m(g)} gross takes this profit back to ${h.m(IT.taperStart)}, and the full ${h.m(IT.personalAllowance)} returns. In Scotland the same contribution cuts the bill from ${h.m(s.saBill)} to ${h.m(ws.saBill)}. Contributions only earn relief up to the amount of your earnings, and larger pension savings run into the annual allowance, a separate limit not modelled here. Without a contribution, a settled year at this level means instalments of ${h.m(r.poaEach)} on ${h.date(cal.payment)} and ${h.date(cal.secondPoa)}. The ${h.a('personal-allowance-taper', 'taper calculator')} shows how other income mixes change the picture.</p>`;
  },
});
