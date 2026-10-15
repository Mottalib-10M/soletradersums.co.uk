import { definePage } from '../../lib/guide-types';

const PROFIT = 90000;

export default definePage({
  id: 'self-employed-tax-on-90000',
  group: 'amounts',
  order: 27,
  tool: { kind: 'se', props: { turnover: PROFIT, expenses: 0 } },
  related: ['self-employed-tax-on-75000', 'self-employed-tax-on-100000', 'vat-threshold-sole-trader', 'how-much-tax-to-save-self-employed'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_vat_registration', 'gov_scottish_income_tax', 'gov_payments_on_account'],
  slug: 'self-employed-tax-on-90000',
  nav: '£90,000 profit',
  card: 'Same digits as the VAT threshold, but VAT reads twelve months of sales while Income Tax reads profit.',
  title: '£90,000 Self-Employed Tax 2026/27: Profit and the VAT Line',
  description: 'Tax on £90,000 of self-employed profit in 2026/27: Income Tax and Class 4 in rUK and Scotland, and why the VAT threshold is measured on turnover, not profit.',
  h1: 'Tax on a £90,000 sole trader profit, and where VAT fits in',
  intro: 'A profit that matches the VAT registration figure, which is why so many sole traders at this level confuse the two tests.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const V = h.P.vat;
    return `A sole trader who makes ${h.m(PROFIT)} of profit in ${h.P.taxYear} pays ${h.m(r.it.tax)} of Income Tax and ${h.m(r.class4.total)} of Class 4 in England, Wales or Northern Ireland, a bill of ${h.m(r.saBill)} that leaves ${h.m(r.takeHome)}. In Scotland the bill is ${h.m(s.saBill)}. The figure shares its digits with the VAT registration threshold, yet the two tests look at different things. VAT depends on taxable turnover, meaning sales before any costs, over any rolling twelve months, not on profit for the tax year. Registration is compulsory once that turnover goes over ${h.m(V.threshold)}, or when you expect it to go over in the next ${V.daysToRegister} days. A web developer with almost no costs and ${h.m(PROFIT)} of profit is sitting right on the line, while a joiner with the same profit and ${h.m(40000)} of timber and fixings crossed it months earlier. For Income Tax, nothing changes at this figure: the higher rate of ${h.pc(h.P.incomeTax.ruk.bands[1].rate)} continues until the allowance taper begins at ${h.m(h.P.incomeTax.taperStart)}.`;
  },
  faqs: (h) => {
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const V = h.P.vat;
    return [
      { q: 'Do I need to register for VAT with £90,000 of profit?', a: `Profit does not decide it. You must register once taxable turnover, your sales before expenses, goes over ${h.m(V.threshold)} in the last twelve months. With ${h.m(PROFIT)} of profit and any costs at all, turnover is above that, so registration is almost certainly due. Only sales that are VAT exempt or outside the scope of VAT are left out of the count.` },
      { q: 'If my 12-month sales pass £90,000 in March, what is my VAT registration date?', a: `You have ${V.daysToRegister} days from the end of the month in which turnover went over ${h.m(V.threshold)} to register, so by 30 April. HMRC then treats you as registered from the first day of the second month after you went over, which is 1 May, and any VAT you owe is payable from then. Profit for the tax year plays no part in either date.` },
      { q: 'What is the tax bill on £90,000 of self-employed profit in Scotland?', a: `${h.m(s.saBill)} for ${h.P.taxYear}: ${h.m(s.it.tax)} of Income Tax and ${h.m(s.class4.total)} of Class 4, leaving ${h.m(s.takeHome)}. That is ${h.m(s.saBill - r.saBill)} more than in England, Wales or Northern Ireland, because the Scottish higher rate of ${h.pc(h.P.incomeTax.scotland.bands[3].rate)} starts earlier, at ${h.m(h.T.scotHigherFrom)}, and profit above ${h.m(h.T.scotAdvancedFrom)} pays the advanced rate of ${h.pc(h.P.incomeTax.scotland.bands[4].rate)}. Class 4 is identical on both sides of the border.` },
    ];
  },
  body: (h) => {
    const r = h.E.selfEmployed({ profit: PROFIT, region: 'ruk' });
    const s = h.E.selfEmployed({ profit: PROFIT, region: 'scotland' });
    const V = h.P.vat, R = h.P.incomeTax.ruk.bands, C4 = h.P.class4;
    const cases: Array<[string, number, number]> = [
      ['IT consultant', 92000, 2000], ['Illustrator', PROFIT, 0], ['Joiner', 130000, 40000], ['Online seller of homeware', 160000, 70000], ['Wedding photographer', 88000, 8000],
    ];
    const rows = cases.map(([trade, t, e]) => [trade, h.m(t), h.m(e), h.m(t - e), t > V.threshold ? 'Yes' : 'No', h.m(h.E.selfEmployed({ profit: t - e, region: 'ruk' }).saBill)]);
    const cal = h.E.saCalendar(h.P.year);
    return `
<h2>Two numbers that only look the same</h2>
<p>Income Tax and Class 4 are worked out on profit for the tax year, after allowable expenses. VAT registration looks at taxable turnover, the total value of what you sell that is not exempt or out of scope, and it counts zero-rated sales too. The two can be far apart. The table runs five sole traders through both tests: each one's tax bill depends on the profit column, while the VAT question depends only on sales.</p>
${h.table(['Trade', 'Sales in 12 months', 'Costs', 'Profit', `Over ${h.m(V.threshold)}?`, 'Tax and Class 4'], rows, `Sales assumed to be the same over the rolling twelve months and the tax year; rest of the UK rates, ${h.P.taxYear}.`, ['l', 'r', 'r', 'r', 'l', 'r'])}
<p>The illustrator with ${h.m(PROFIT)} of sales and no costs is not over the threshold, because the rule bites on turnover going over it, not reaching it. One extra commission changes that. The ${h.a('vat-threshold-sole-trader', 'VAT threshold page')} has a checker for your own months.</p>
<h2>A rolling twelve months, not the tax year</h2>
<p>The VAT test does not wait for the end of the tax year. At the end of every month you look back over the previous twelve, and if taxable sales have gone over ${h.m(V.threshold)}, you have ${V.daysToRegister} days from the end of that month to register. Registration then takes effect from the first day of the second month after the one in which you went over. A second test looks forward: a contract signed today that will push sales over the threshold within the next ${V.daysToRegister} days means registering by the end of that period, effective from the day you realised. A seasonal business, such as a garden designer whose sales bunch into spring, can pass the line partway through a tax year whose total ends below it.</p>
<h2>The tax itself at ${h.m(PROFIT)}</h2>
<p>Nothing new starts here for Income Tax. The profit sits ${h.m(PROFIT - h.T.basicTo)} into the higher-rate band, where each pound pays ${h.pc(R[1].rate)} plus ${h.pc(C4.upperRate)} Class 4, and ${h.m(h.P.incomeTax.taperStart - PROFIT)} short of the point where the Personal Allowance starts to shrink. In Scotland the higher rate started at ${h.m(h.T.scotHigherFrom)} and the last ${h.m(PROFIT - h.T.scotAdvancedFrom + 1)} of profit is in the advanced band, so the bill there is ${h.m(s.saBill - r.saBill)} higher. Payments on account for the next year are ${h.m(r.poaEach)} each, due ${h.date(cal.payment)} and ${h.date(cal.secondPoa)}, so a first year at this level means finding ${h.m(r.saBill + r.poaEach)} in one January. The ${h.a('how-much-tax-to-save-self-employed', 'set-aside calculator')} turns that into a monthly figure.</p>
<h2>Staying under, or registering by choice</h2>
<p>Registration below the threshold is allowed: HMRC calls it voluntary registration, and the same duty applies once it is granted, with VAT owed from the date you are registered. A business that sells only VAT-exempt goods or services does not have to register at all, whatever its turnover. Which side of the line suits a particular trade depends on its customers and its costs, not on the Income Tax figures above.</p>`;
  },
});
