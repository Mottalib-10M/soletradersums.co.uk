import { definePage } from '../../lib/guide-types';

const PROFIT = 60000;

export default definePage({
  id: 'self-employed-tax-on-60000',
  group: 'amounts',
  order: 25,
  tool: { kind: 'se', props: { turnover: PROFIT, expenses: 0 } },
  related: ['self-employed-tax-on-50000', 'self-employed-tax-on-75000', 'child-benefit-charge-self-employed', 'limited-company-vs-sole-trader'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_hicbc', 'gov_child_benefit', 'gov_pension_relief', 'gov_ct_rates_pub'],
  slug: 'self-employed-tax-on-60000',
  nav: '£60,000 profit',
  card: 'Right on the Child Benefit charge threshold, and the profit where a company and a sole trader draw level.',
  title: '£60,000 Self-Employed Tax 2026/27: Child Benefit and Company',
  description: 'Tax on £60,000 of self-employed profit in 2026/27: the higher-rate bill in rUK and Scotland, where the Child Benefit charge starts and how a company compares.',
  h1: 'Self-employed on £60,000: tax, Child Benefit and the company question',
  intro: 'Two lines meet at sixty thousand pounds: the start of the Child Benefit charge and the profit at which a company comes closest to a sole trader on cash.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const c = h.E.compareStructures({ profit: PROFIT, region: 'ruk' });
    const H = h.P.hicbc;
    return `At ${h.m(PROFIT)} of profit a sole trader in England, Wales or Northern Ireland pays ${h.m(r.it.tax)} of Income Tax and ${h.m(r.class4.total)} of Class 4 for ${h.P.taxYear}, ${h.m(r.saBill)} in all, and keeps ${h.m(r.takeHome)}. In Scotland the bill rises to ${h.m(s.saBill)}. Of the profit, ${h.m(PROFIT - h.T.basicTo)} is already taxed at the higher rate of ${h.pc(h.P.incomeTax.ruk.bands[1].rate)}. The figure is also the exact starting point of the High Income Child Benefit Charge, which applies when adjusted net income is over ${h.m(H.start)}. Sitting precisely on it, nothing is repaid; each further ${h.m(H.stepPerPercent)} takes back one per cent of the year's Child Benefit, until all of it goes at ${h.m(H.end)}. Sixty thousand is also about where a one-person company comes closest to a sole trader. Paying everything out as salary and dividends, the company leaves ${h.m(Math.abs(c.gapAllDrawn))} ${c.gapAllDrawn < 0 ? 'less' : 'more'} than trading alone, before its running costs, so the outcome depends on those costs and on how much profit stays in the business.`;
  },
  faqs: (h) => {
    const H = h.P.hicbc;
    const two = h.E.childBenefitCharge(PROFIT, 2), two64 = h.E.childBenefitCharge(64000, 2);
    const base = h.E.selfEmployed({ profit: 64000, region: 'ruk' });
    const withPension = h.E.selfEmployed({ profit: 64000, region: 'ruk', pensionGross: 4000 });
    const saved = base.saBill - withPension.saBill + two64.charge - h.E.childBenefitCharge(withPension.it.adjustedNetIncome, 2).charge;
    const c = h.E.compareStructures({ profit: PROFIT, region: 'ruk' });
    return [
      { q: 'Do I pay the Child Benefit charge on £60,000 of self-employed profit?', a: `Not if ${h.m(PROFIT)} is your whole adjusted net income. The charge applies to income over ${h.m(H.start)}, so the bill at exactly that figure is ${h.m(two.charge)}. One more ${h.m(H.stepPerPercent)} of profit and one per cent of the year's Child Benefit is repaid; for two children at ${h.m(64000)} that is ${h.m(two64.charge)}, collected through your Self Assessment return.` },
      { q: 'Can a pension payment stop the Child Benefit charge on £64,000 profit?', a: `It can bring adjusted net income back to ${h.m(H.start)}. A gross contribution of ${h.m(4000)}, paid as ${h.m(4000 * (1 - h.P.pension.basicRelief))} into a relief-at-source scheme, removes a ${h.m(two64.charge)} charge for two children and also earns higher-rate relief on the return. Together those save ${h.m(saved)}, so the real cost of putting ${h.m(4000)} into the pension is ${h.m(4000 * (1 - h.P.pension.basicRelief) - saved)}.` },
      { q: 'Is a limited company better than being a sole trader at £60,000?', a: `On cash, the two are nearly level. With a salary of ${h.m(c.salary)} and the rest drawn as dividends, the director keeps ${h.m(c.ltdAll.takeHome)}; a sole trader in England, Wales or Northern Ireland keeps ${h.m(c.soleTakeHome)}. Company costs such as accounts and payroll then decide it. Leaving profit inside the company, where it bears Corporation Tax at the small profits rate of ${h.pc(h.P.corporationTax.smallRate)}, is what tilts the comparison.` },
    ];
  },
  body: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const R = h.P.incomeTax.ruk.bands, S = h.P.incomeTax.scotland.bands, C4 = h.P.class4, H = h.P.hicbc;
    const c = h.E.compareStructures({ profit: PROFIT, region: 'ruk' });
    const cal = h.E.saCalendar(h.P.year);
    const rows = [PROFIT, 62000, 65000, 70000, 75000, H.end].map((p) => {
      const one = h.E.childBenefitCharge(p, 1), two = h.E.childBenefitCharge(p, 2);
      return [h.m(p), `${two.pct} %`, h.m(one.charge), h.m(two.charge)];
    });
    const mHigh = h.E.marginalOnProfit({ profit: PROFIT, region: 'ruk' });
    const extra = (h.E.childBenefitCharge(70000, 2).charge - h.E.childBenefitCharge(PROFIT, 2).charge) / 10000;
    return `
<h2>Standing exactly on the Child Benefit threshold</h2>
<p>The charge looks at adjusted net income, not at profit as such. For a sole trader with no salary, savings or dividends, the two are the same, minus any pension contributions or Gift Aid. Up to ${h.m(H.start)} nothing is due. Above it, every ${h.m(H.stepPerPercent)} costs one per cent of the year's Child Benefit, so the whole benefit is repaid by ${h.m(H.end)}. Because you already file a return, HMRC requires the charge to go through Self Assessment, added to the same January bill.</p>
${h.table(['Adjusted net income', 'Share repaid', 'One child', 'Two children'], rows, `High Income Child Benefit Charge on a full year of Child Benefit, ${h.P.taxYear} weekly rates.`, ['r', 'r', 'r', 'r'])}
<p>For a parent of two, the charge works like an extra tax of about ${h.pc(Math.round(extra * 1000) / 1000)} on each pound of profit between ${h.m(H.start)} and ${h.m(H.end)}, on top of the ${h.pc(mHigh)} already paid in Income Tax and Class 4. If both parents are over the line, the one with the higher income pays. More detail is on the ${h.a('child-benefit-charge-self-employed', 'Child Benefit charge page')}.</p>
<h2>Pension contributions pull the figure back</h2>
<p>Paying into a personal pension lowers adjusted net income by the gross amount. A photographer who expects ${h.m(64000)} and pays ${h.m(4000)} gross is back at ${h.m(H.start)} for the charge. Relief comes from two directions: the provider adds the basic ${h.pc(h.P.pension.basicRelief)}, and the return gives back the difference between the higher rate and that basic rate on the slice taxed at ${h.pc(R[1].rate)}. Class 4 is unaffected, because it is charged on profit before any pension. Figures for other amounts are on the ${h.a('pension-tax-relief-self-employed', 'pension relief page')}.</p>
<h2>Company and sole trader neck and neck</h2>
<p>When every pound is paid out, a one-person company gets nearest to self-employment at around this profit. At ${h.m(58000)} it trails by ${h.m(Math.abs(h.E.compareStructures({ profit: 58000, region: 'ruk' }).gapAllDrawn))}. At ${h.m(PROFIT)}, a salary of ${h.m(c.salary)} plus dividends leaves the director ${h.m(c.ltdAll.takeHome)}, against ${h.m(c.soleTakeHome)} as a sole trader. Further up the gap opens again: company profit above ${h.m(h.P.corporationTax.lowerLimit)} starts to lose the small profits rate, and dividends reach the upper rate of ${h.pc(h.P.dividends.higher)}, so at ${h.m(75000)} the company is ${h.m(Math.abs(h.E.compareStructures({ profit: 75000, region: 'ruk' }).gapAllDrawn))} behind. Accountancy fees easily exceed that gap, so the decision tends to rest on other things: whether profit can be left in the business, how stable the income is, and the extra administration. The ${h.a('limited-company-vs-sole-trader', 'comparison tool')} lets you test a partial payout.</p>
<h2>Paying the higher rate on ${h.m(PROFIT - h.T.basicTo)}</h2>
<p>Above ${h.m(h.T.basicTo)}, Income Tax rises to ${h.pc(R[1].rate)} and Class 4 drops to ${h.pc(C4.upperRate)}, so the next pound costs ${h.pc(mHigh)}. In Scotland the same pound costs ${h.pc(h.E.marginalOnProfit({ profit: PROFIT, region: 'scotland' }))}, since ${h.pc(S[3].rate)} applies, and the bill of ${h.m(s.saBill)} is ${h.m(s.saBill - r.saBill)} higher. Once established, this business pays two instalments of ${h.m(r.poaEach)}, on ${h.date(cal.payment)} and ${h.date(cal.secondPoa)}.</p>`;
  },
});
