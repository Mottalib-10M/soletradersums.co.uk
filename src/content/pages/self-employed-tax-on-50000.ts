import { definePage } from '../../lib/guide-types';

const PROFIT = 50000;
import { P as PP } from '../../lib/engine/params';
import { formatPercent } from '../../lib/format';
const RB = PP.incomeTax.ruk.bands, SB = PP.incomeTax.scotland.bands, C4 = PP.class4;
const r = (x: number) => formatPercent(x, 0);
const BASIC = r(RB[0].rate), HIGHER = r(RB[1].rate), SHIGH = r(SB[3].rate), MAIN = r(C4.mainRate), UP = r(C4.upperRate), LOWM = r(RB[0].rate + C4.mainRate), HIGHM = r(RB[1].rate + C4.upperRate), SMARG = r(SB[3].rate + C4.mainRate), EXTRA = r(RB[1].rate - PP.pension.basicRelief), AT_SOURCE = r(PP.pension.basicRelief);

export default definePage({
  id: 'self-employed-tax-on-50000',
  group: 'amounts',
  order: 24,
  tool: { kind: 'se', props: { turnover: PROFIT, expenses: 0 } },
  related: ['self-employed-tax-on-40000', 'self-employed-tax-on-60000', 'making-tax-digital', 'limited-company-vs-sole-trader'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_scottish_income_tax', 'gov_mtd_when', 'gov_ct_rates_pub'],
  slug: 'self-employed-tax-on-50000',
  nav: '£50,000 profit',
  card: 'Just under the higher rate: why the next £270 is still cheap and what follows.',
  title: '£50,000 Self-Employed Tax 2026/27: rUK and Scotland Bills',
  description: 'Tax on £50,000 of self-employed profit in 2026/27: Income Tax and Class 4 in rUK and Scotland, the higher rate from £50,271, and why sales, not profit, set MTD.',
  h1: 'Tax on £50,000 of self-employed profit',
  intro: 'The last stop before the higher rate in England, Wales and Northern Ireland, and well inside it in Scotland.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    return `On ${h.m(PROFIT)} of profit in ${h.P.taxYear}, a sole trader in England, Wales or Northern Ireland pays ${h.m(r.it.tax)} of Income Tax and ${h.m(r.class4.total)} of Class 4 National Insurance: ${h.m(r.saBill)} in all, ${h.pc(Math.round(r.setAside * 1000) / 1000)} of the profit, leaving ${h.m(r.takeHome)}. The same profit in Scotland costs ${h.m(s.saBill)}, because ${h.m(PROFIT - h.T.scotHigherFrom + 1)} of it already falls in the Scottish higher rate of ${SHIGH}. Fifty thousand pounds sits ${h.m(h.T.basicTo - PROFIT)} below two limits that move together, the higher rate threshold of ${h.m(h.T.basicTo)} and the Class 4 upper profits limit, so the marginal cost of the next pound is still the basic one. Three other rules meet near this figure: Making Tax Digital, which looks at turnover over ${h.m(h.P.mtd.stages[0].threshold)}, the Corporation Tax small profits limit, and the point at which accountants start suggesting a company.`;
  },
  faqs: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const up = h.E.selfEmployed({ profit: 55000, region: 'ruk' });
    return [
      { q: 'How much tax will I pay on £50,000 self-employed?', a: `In England, Wales or Northern Ireland, ${h.m(r.it.tax)} of Income Tax and ${h.m(r.class4.total)} of Class 4, so ${h.m(r.saBill)} and a take-home of ${h.m(r.takeHome)}, assuming no other income and no student loan. In your first year the January payment adds half of that as a payment on account, ${h.m(r.poaEach)}.` },
      { q: 'What happens to my tax if profit goes from £50,000 to £55,000?', a: `The extra ${h.m(5000)} costs ${h.m(up.saBill - r.saBill)} in England, Wales or Northern Ireland. The first ${h.m(h.T.basicTo - PROFIT)} is still taxed at ${BASIC} plus ${MAIN} Class 4; everything above ${h.m(h.T.basicTo)} pays ${HIGHER} Income Tax but only ${UP} Class 4, so the combined rate on each new pound jumps from ${LOWM} to ${HIGHM}.` },
      { q: 'Do I have to use Making Tax Digital on £50,000?', a: `Only if your qualifying income is more than ${h.m(50000)}: turnover, not profit, plus gross rents. Exactly ${h.m(50000)} in 2024/25 does not bring you in from April 2026, but anything over ${h.m(30000)} in your 2025/26 return brings you in from 6 April 2027.` },
    ];
  },
  body: (h) => {
    const rows = [45000, 48000, 50000, h.T.basicTo, 52000, 55000].map((p) => { const a = h.E.selfEmployed({ profit: p, region: 'ruk' }), s = h.E.selfEmployed({ profit: p, region: 'scotland' });
      return [h.m(p), h.m(a.it.tax), h.m(a.class4.total), h.m(a.takeHome), h.m(s.takeHome)]; });
    const m1 = h.E.marginalOnProfit({ profit: 50000, region: 'ruk' }), m2 = h.E.marginalOnProfit({ profit: 50500, region: 'ruk' });
    const c = h.E.compareStructures({ profit: PROFIT, region: 'ruk' });
    return `
<h2>Two limits at £50,270</h2>
<p>England, Wales and Northern Ireland line up the higher rate threshold and the Class 4 upper profits limit on the same figure, ${h.m(h.T.basicTo)}. Below it, every extra pound of profit costs ${h.pc(m1)}: ${BASIC} Income Tax and ${MAIN} Class 4. Above it, the next pound costs ${h.pc(m2)}: ${HIGHER} Income Tax and ${UP} Class 4. At ${h.m(PROFIT)} you have ${h.m(h.T.basicTo - PROFIT)} of room left before the change, so a few late invoices in March do not change the picture, but a good year that ends at ${h.m(60000)} pays the higher rate on ${h.m(60000 - h.T.basicTo)} of it. If that happens, a pension contribution is the simplest lever: paid into a personal pension, it earns ${AT_SOURCE} from the provider and another ${EXTRA} through your return on the slice taxed at ${HIGHER}, and Class 4 is not affected either way.</p>
${h.table(['Profit', 'Income Tax rUK', 'Class 4', 'Kept rUK', 'Kept Scotland'], rows, `Sole trader, no other income, ${h.P.taxYear}.`, ['r', 'r', 'r', 'r', 'r'])}
<h2>Scotland at the same profit</h2>
<p>A Scottish taxpayer crossed into the ${SHIGH} band at ${h.m(h.T.scotHigherFrom)}, so ${h.m(PROFIT - h.T.scotHigherFrom + 1)} of a ${h.m(PROFIT)} profit is already taxed at the higher rate. Class 4 does not follow: it keeps the UK limits, ${MAIN} up to ${h.m(h.T.upl)}. The marginal rate in Scotland at this profit is therefore ${SMARG}, ${SHIGH} plus ${MAIN}, the highest combined rate a Scottish sole trader meets below ${h.m(h.T.taperStart)}. A Scottish sole trader at this profit who expects a better year should look at pension contributions first: relief at ${SHIGH} is worth more than at ${HIGHER}.</p>
<h2>Turnover, not profit, decides Making Tax Digital</h2>
<p>HMRC brought sole traders and landlords whose 2024/25 qualifying income was more than ${h.m(h.P.mtd.stages[0].threshold)} into Making Tax Digital on 6 April 2026. Qualifying income is turnover plus gross rents, before any expense. A consultant with ${h.m(PROFIT)} of profit and almost no costs may sit right at the line; a builder with the same profit and ${h.m(30000)} of materials is well over it. The test then drops to ${h.m(h.P.mtd.stages[1].threshold)} for 2025/26 figures and ${h.m(h.P.mtd.stages[2].threshold)} for 2026/27, so most people at this profit will be keeping digital records by April 2027 whatever happens.</p>
<h2>Is it time for a company?</h2>
<p>The old rule of thumb said yes. With ${h.P.taxYear} rates, a one-person company that pays itself the best salary, ${h.m(c.salary)} here, and draws everything else as dividends leaves ${h.m(c.ltdAll.takeHome)}, against ${h.m(c.soleTakeHome)} as a sole trader: ${h.m(Math.abs(c.gapAllDrawn))} ${c.gapAllDrawn < 0 ? 'less' : 'more'}, before accountancy fees. The company only pulls ahead if you leave profit inside it, for example to fund equipment next year or to draw it in a year when your other income is lower. The ${h.a('limited-company-vs-sole-trader', 'comparison calculator')} draws that curve.</p>`;
  },
});
