import { definePage } from '../../lib/guide-types';

const PROFIT = 80000;

export default definePage({
  id: 'corporation-tax-calculator',
  group: 'company',
  order: 43,
  tool: { kind: 'mini:ct', props: { profit: PROFIT, assoc: 0, months: 12 } },
  related: ['limited-company-tax-calculator', 'limited-company-vs-sole-trader', 'dividend-tax-calculator', 'salary-and-dividends-calculator'],
  sources: ['gov_ct_rates_pub', 'leg_cta_18b', 'gov_employers_2627'],
  slug: 'corporation-tax-calculator',
  nav: 'Corporation Tax',
  card: 'Small profits rate, main rate and marginal relief, with associated companies and short periods.',
  title: 'Corporation Tax Calculator 2026: Marginal Relief Included',
  description: 'Corporation Tax from 1 April 2026: 19 % to £50,000, 25 % from £250,000, marginal relief between, and how associated companies and short periods move the limits.',
  h1: 'Corporation Tax calculator with marginal relief',
  intro: 'One rate for small profits, one for large ones, and a sliding scale in the middle that hides a steeper rate than either.',
  resume: (h) => {
    const C = h.P.corporationTax;
    const r = h.E.corporationTax(PROFIT);
    const marg = (h.E.corporationTax(150100).tax - h.E.corporationTax(150000).tax) / 100;
    return `A company with ${h.m(PROFIT)} of taxable profit in the financial year starting 1 April 2026 pays ${h.m(r.tax)} of Corporation Tax: the main rate of ${h.pc(C.mainRate)} on the whole profit, minus ${h.m(r.relief)} of marginal relief, an effective rate of ${h.pc(Math.round(r.effectiveRate * 1000) / 1000)}. The rules have not changed since April 2023. Profits up to the lower limit of ${h.m(C.lowerLimit)} pay the small profits rate of ${h.pc(C.smallRate)}; profits of ${h.m(C.upperLimit)} or more pay ${h.pc(C.mainRate)}; between the two, marginal relief equals the standard fraction of ${C.fractionNum}/${C.fractionDen} times the gap between the upper limit and the profit. Both limits are divided by one plus the number of associated companies and cut in proportion for an accounting period shorter than twelve months. The relief tapers away as profit rises, so each extra pound inside the band costs ${h.pc(marg)}, more than the main rate itself.`;
  },
  faqs: (h) => {
    const C = h.P.corporationTax;
    const r100 = h.E.corporationTax(100000);
    const a = h.E.corporationTax(PROFIT, 1);
    const s6 = h.E.corporationTax(40000, 0, 6);
    const marg = (h.E.corporationTax(150100).tax - h.E.corporationTax(150000).tax) / 100;
    return [
      { q: 'What is the Corporation Tax on £100,000 of profit?', a: `${h.m(r100.tax)} for an accounting period of twelve months starting on or after 1 April 2026, with no associated companies. That is ${h.pc(C.mainRate)} of ${h.m(100000)}, less ${h.m(r100.relief)} of marginal relief, so an effective rate of ${h.pc(Math.round(r100.effectiveRate * 1000) / 1000)}. With one associated company the limits halve and the bill would be higher.` },
      { q: 'How do associated companies change the marginal relief limits?', a: `Both limits are divided by the number of associated companies plus one. With one associated company they become ${h.m(C.lowerLimit / 2)} and ${h.m(C.upperLimit / 2)}, so ${h.m(PROFIT)} of profit costs ${h.m(a.tax)} instead of ${h.m(h.E.corporationTax(PROFIT).tax)}. A company is associated with another if one controls the other or the same person or persons control both.` },
      { q: `Why is the marginal Corporation Tax rate ${h.pc(marg)}?`, a: `Because marginal relief shrinks as profit grows. Between ${h.m(C.lowerLimit)} and ${h.m(C.upperLimit)}, each extra pound is taxed at the main rate of ${h.pc(C.mainRate)} and also loses ${C.fractionNum}/${C.fractionDen} of a pound of relief, so the next pound costs ${h.pc(marg)}. The average rate stays below ${h.pc(C.mainRate)} all the way up.` },
      { q: 'Does a six-month accounting period change the Corporation Tax limits?', a: `Yes. The limits are cut in proportion to the length of the period, so six months gives ${h.m(C.lowerLimit / 2)} and ${h.m(C.upperLimit / 2)}. A first period of six months with ${h.m(40000)} of profit pays ${h.m(s6.tax)}, against ${h.m(h.E.corporationTax(40000).tax)} over a full year at the small profits rate.` },
    ];
  },
  body: (h) => {
    const C = h.P.corporationTax;
    const marg = (p: number) => (h.E.corporationTax(p + 100).tax - h.E.corporationTax(p).tax) / 100;
    const rows = [30000, 50000, 80000, 120000, 180000, 249000, 300000].map((p) => { const r = h.E.corporationTax(p);
      return [h.m(p), r.band === 'small' ? 'small profits rate' : r.band === 'main' ? 'main rate' : 'marginal relief', h.m(r.relief), h.m(r.tax), h.pc(Math.round(r.effectiveRate * 1000) / 1000), h.pc(marg(p))]; });
    const ex = h.E.corporationTax(PROFIT);
    const salary = h.P.class1.primaryThreshold;
    const withSal = h.E.corporationTax(PROFIT - salary - h.E.class1Employer(salary));
    return `
<h2>From £30,000 to £300,000</h2>
<p>The table shows the tax for a company with no associated companies and a twelve-month accounting period. The last column is what the next ${h.m(100)} of profit costs, as a percentage: the figure to watch when deciding whether to spend on equipment before the year end or pay a bonus.</p>
${h.table(['Taxable profit', 'Regime', 'Marginal relief', 'Corporation Tax', 'Average rate', 'Rate on the next pound'], rows, 'Financial year from 1 April 2026, 12-month period, no associated companies.', ['r', 'l', 'r', 'r', 'r', 'r'])}
<h2>Working out marginal relief by hand</h2>
<p>For ${h.m(PROFIT)}: the main rate gives ${h.m(PROFIT * C.mainRate)}. The gap to the upper limit is ${h.m(C.upperLimit - PROFIT)}, and ${C.fractionNum}/${C.fractionDen} of that is ${h.m(ex.relief)}. Take the relief off: ${h.m(ex.tax)} to pay. The full formula in ${h.src('leg_cta_18b', 'section 18B of the Corporation Tax Act 2010')} also scales the relief by the ratio of taxable profit to augmented profit; a company receiving distributions from companies that are neither related nor associated has augmented profits above its taxable profit and gets a little less relief than this simple version shows.</p>
<h2>Associated companies and short periods</h2>
<p>HMRC’s Company Taxation Manual treats two companies as associated when one controls the other or both are controlled by the same person or persons. Each association divides the limits: with two associated companies they fall to a third. A builder who runs a trading company and a separate property company may therefore pay ${h.pc(C.mainRate)} on profits far below ${h.m(C.upperLimit)}. A first or final accounting period shorter than a year reduces the limits in proportion too, which the months box in the calculator applies. Marginal relief is not available to close investment holding companies or to companies not resident in the UK.</p>
<h2>Where Corporation Tax sits in a director’s pay</h2>
<p>The figure in the calculator is charged on profit after the director’s salary and employer National Insurance. On ${h.m(PROFIT)} of trading profit, a ${h.m(salary)} salary and its employer National Insurance bring the taxable profit down and the bill to ${h.m(withSal.tax)}, before any dividend is paid. Dividends come out of what is left and are taxed again in the shareholder’s hands, which the ${h.a('limited-company-tax-calculator', 'limited company tax calculator')} adds up in one place.</p>
${h.box('Rates for 2026', `<p>Small profits rate ${h.pc(C.smallRate)}, main rate ${h.pc(C.mainRate)}, lower limit ${h.m(C.lowerLimit)}, upper limit ${h.m(C.upperLimit)}, standard fraction ${C.fractionNum}/${C.fractionDen} (${h.src('gov_ct_rates_pub', 'HMRC rates and allowances')}).</p>`, 'info')}`;
  },
});
