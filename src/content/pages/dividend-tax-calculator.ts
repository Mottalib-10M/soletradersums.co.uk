import { definePage } from '../../lib/guide-types';

const SALARY = 12570;
const DIV = 30000;

export default definePage({
  id: 'dividend-tax-calculator',
  group: 'company',
  order: 42,
  tool: { kind: 'mini:dividend', props: { other: SALARY, div: DIV, region: 0 } },
  related: ['salary-and-dividends-calculator', 'limited-company-tax-calculator', 'limited-company-vs-sole-trader', 'self-assessment-deadlines'],
  sources: ['gov_dividends', 'gov_income_tax_rates', 'gov_scottish_income_tax', 'gov_sa_deadlines'],
  slug: 'dividend-tax-calculator',
  nav: 'Dividend tax',
  card: 'The 2026/27 dividend rates, how the £500 allowance really works, and when to tell HMRC.',
  title: 'Dividend Tax Calculator 2026/27: Rates, Bands and Allowance',
  description: 'Dividend tax for 2026/27: the 10.75 %, 35.75 % and 39.35 % rates, why the £500 allowance still uses up your band, Scottish taxpayers and how to report it.',
  h1: 'Dividend tax calculator for 2026/27',
  intro: 'Dividends sit on top of your other income, so the same payment can be taxed at three different rates depending on what else you earn.',
  resume: (h) => {
    const D = h.P.dividends;
    const r = h.E.incomeTax({ nonSavings: SALARY, dividends: DIV, region: 'ruk' });
    return `A director who takes a ${h.m(SALARY)} salary and ${h.m(DIV)} of dividends in ${h.P.taxYear} owes ${h.m(r.dividendTax)} of dividend tax and nothing on the salary. The salary uses the Personal Allowance, the first ${h.m(D.allowance)} of dividends falls in the dividend allowance at 0 %, and the remaining ${h.m(DIV - D.allowance)} is taxed at the ordinary rate of ${h.pc(D.basic)}. From 6 April 2026 the three dividend rates are ${h.pc(D.basic)}, ${h.pc(D.higher)} and ${h.pc(D.additional)}, applied according to the band the dividends land in once they are stacked on top of salary, trading profit, pension and rent. Two points catch people out: the ${h.m(D.allowance)} allowance is not an extra band, it uses the same band space as the dividends it covers; and a Scottish taxpayer pays the same dividend tax as everyone else in the UK, using the UK band limits, whatever rate applies to their salary.`;
  },
  faqs: (h) => {
    const D = h.P.dividends;
    const big = h.E.incomeTax({ nonSavings: SALARY, dividends: 50000, region: 'ruk' });
    const sl = (n: string) => big.dividendSlices.filter((x) => x.name === n).reduce((t, x) => t + x.amount, 0);
    const bigOrd = sl('Dividend ordinary rate'), bigUp = sl('Dividend upper rate');
    const lo = h.E.incomeTax({ nonSavings: 0, dividends: 20000, region: 'ruk' });
    return [
      { q: 'How much dividend tax is due on £50,000 with a £12,570 salary?', a: `${h.m(big.dividendTax)} in ${h.P.taxYear}. The salary uses the Personal Allowance, ${h.m(D.allowance)} of dividends is covered by the allowance, ${h.m(bigOrd)} is taxed at ${h.pc(D.basic)} up to the ${h.m(h.T.basicTo)} limit, and the remaining ${h.m(bigUp)} at ${h.pc(D.higher)}. The answer is the same for a Scottish taxpayer, because dividends use the UK bands.` },
      { q: 'Does the £500 dividend allowance count towards my tax band?', a: `Yes. The first ${h.m(D.allowance)} of dividends is taxed at 0 % but still fills ${h.m(D.allowance)} of the band it sits in. If your salary and dividends together go past ${h.m(h.T.basicTo)}, the allowance does not push the higher rate of ${h.pc(D.higher)} any further up; it just makes ${h.m(D.allowance)} of the dividends free.` },
      { q: 'How much tax do I pay on £20,000 of dividends with no other income?', a: `${h.m(lo.dividendTax)} in ${h.P.taxYear}. The Personal Allowance covers the first ${h.m(h.P.incomeTax.personalAllowance)} of dividends when nothing else uses it, the next ${h.m(D.allowance)} falls in the dividend allowance, and the rest is taxed at ${h.pc(D.basic)}. Someone with a pension or a salary using the allowance would pay more on the same dividends.` },
      { q: 'Do I need to tell HMRC about dividends under £500?', a: `No, not if all your dividends for the tax year fit within the ${h.m(D.allowance)} allowance, or within the part of your Personal Allowance you have not used. Above that, a person who files Self Assessment reports them on the return; someone who does not must tell HMRC after 5 April and by ${h.P.selfAssessment.registerBy}.` },
    ];
  },
  body: (h) => {
    const D = h.P.dividends;
    const cases: Array<[number, number, string]> = [[0, 20000, 'No other income'], [SALARY, 30000, 'Director, typical salary'], [SALARY, 50000, 'Director, larger draw'], [30000, 10000, 'Employee with shares'], [60000, 20000, 'Higher rate employee'], [100000, 30000, 'Allowance tapered']];
    const rows = cases.map(([o, d, who]) => {
      const r = h.E.incomeTax({ nonSavings: o, dividends: d, region: 'ruk' });
      const at = (n: string) => h.m(r.dividendSlices.filter((x) => x.name === n).reduce((t, x) => t + x.amount, 0));
      return [who, h.m(o), h.m(d), at('Dividend ordinary rate'), at('Dividend upper rate'), at('Dividend additional rate'), h.m(r.dividendTax)];
    });
    const edge = h.T.basicTo - SALARY + D.allowance;
    const e = h.E.incomeTax({ nonSavings: SALARY, dividends: edge, region: 'ruk' });
    const eUp = e.dividendSlices.find((x) => x.name === 'Dividend upper rate');
    const top = h.E.incomeTax({ nonSavings: 100000, dividends: 30000, region: 'ruk' });
    return `
<h2>Six people, six dividend bills</h2>
<p>Each row stacks the dividends on top of the other income shown, then splits them between the rate bands. The amounts under each rate are the slices of dividend taxed there; the ${h.m(D.allowance)} allowance and any unused Personal Allowance make up the difference.</p>
${h.table(['Who', 'Other income', 'Dividends', `At ${h.pc(D.basic)}`, `At ${h.pc(D.higher)}`, `At ${h.pc(D.additional)}`, 'Dividend tax'], rows, `${h.P.taxYear}, England, Wales or Northern Ireland.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The employee on ${h.m(60000)} pays the higher dividend rate on all but the first ${h.m(D.allowance)}, because the salary has already used the basic rate band. The last row shows the additional rate at work: with ${h.m(130000)} of total income the Personal Allowance has gone, and ${h.m(top.dividendSlices.filter((x) => x.name === 'Dividend additional rate').reduce((t, x) => t + x.amount, 0))} of the dividends sits above the additional rate threshold.</p>
<h2>The allowance uses band space</h2>
<p>A company director on a ${h.m(SALARY)} salary has ${h.m(h.T.basicTo - SALARY)} of basic rate band left for dividends. Paying ${h.m(edge)} of dividends, ${h.m(D.allowance)} more than that, does not buy an extra ${h.m(D.allowance)} at 0 % on top: the allowance sits at the bottom of the dividends, inside the band, and ${h.m(eUp ? eUp.amount : 0)} ends up taxed at ${h.pc(D.higher)} (${h.m(eUp ? eUp.tax : 0)} of tax). GOV.UK’s own worked example on ${h.src('gov_dividends', 'tax on dividends')} sets out the same order: wages first, then the allowance, then the taxable dividends.</p>
<h2>Scotland uses the UK bands for dividends</h2>
<p>Scottish Income Tax has ${h.P.incomeTax.scotland.bands.length} bands and a higher rate from ${h.m(h.T.scotHigherFrom)}, but it covers only non-savings, non-dividend income. A Scottish director’s dividends are taxed exactly as in Cardiff or Belfast, with the ordinary dividend rate running to ${h.m(h.T.basicTo)} of total income. That is why the dividend calculator asks where you live only to work out the tax on the other income.</p>
<h2>Paying and reporting</h2>
<p>Nothing is deducted when a company pays a dividend. If you already file a Self Assessment return, the dividends go on it, and the tax is due by ${h.P.paymentsOnAccount.dueFirst} after the end of the tax year, often with payments on account as well. If you do not, smaller amounts can be collected by changing your tax code; larger ones require a return, and you must tell HMRC by ${h.P.selfAssessment.registerBy} after the tax year in which you received them. Dividends from shares held in an ISA are not taxed at all. To set dividends against a salary for a director, the ${h.a('salary-and-dividends-calculator', 'salary and dividends calculator')} finds the combination that leaves the most.</p>`;
  },
});
