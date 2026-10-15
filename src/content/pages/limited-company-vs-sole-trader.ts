import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

const EXAMPLE = 60000;
const TOP = 300000;

/** Bands of profit (£500 steps, as the engine's crossover) where a company drawn in full leaves more than a sole trader. */
const cache = new Map<string, Array<[number, number]>>();
function wins(h: Helpers, region: 'ruk' | 'scotland', extraCosts = 0): Array<[number, number]> {
  const key = `${region}-${extraCosts}`;
  const hit = cache.get(key); if (hit) return hit;
  const out: Array<[number, number]> = [];
  let start: number | null = null;
  for (let p = 5000; p <= TOP; p += 500) {
    const w = h.E.compareStructures({ profit: p, region, extraCosts }).gapAllDrawn > 0;
    if (w && start === null) start = p;
    if (!w && start !== null) { out.push([start, p - 500]); start = null; }
  }
  if (start !== null) out.push([start, TOP]);
  cache.set(key, out);
  return out;
}
const say = (h: Helpers, r: Array<[number, number]>) => r.length === 0 ? `at no level of profit up to ${h.m(TOP)}`
  : r.map(([a, b]) => (a === b ? `in a narrow window around ${h.m(a)}` : `from about ${h.m(a)} to ${h.m(b)}`)).join(' and ');

export default definePage({
  id: 'limited-company-vs-sole-trader',
  group: 'company',
  order: 40,
  tool: { kind: 'compare', props: { profit: EXAMPLE, region: 'ruk', draw: 100 } },
  related: ['limited-company-tax-calculator', 'salary-and-dividends-calculator', 'dividend-tax-calculator', 'ir35'],
  sources: ['gov_dividends', 'gov_ct_rates_pub', 'gov_se_nic', 'gov_employers_2627', 'gov_employment_allowance', 'gov_scottish_income_tax'],
  slug: 'limited-company-vs-sole-trader',
  nav: 'Sole trader or limited company',
  card: 'Same profit, two structures: what each leaves you in 2026/27, and why retained profit decides.',
  title: 'Limited Company vs Sole Trader 2026/27: Tax Side by Side',
  description: 'Limited company vs sole trader in 2026/27: take-home at every profit with the new dividend rates, the Scottish exception, retained profit and non-tax costs.',
  h1: 'Limited company or sole trader: the 2026/27 comparison',
  intro: 'The same profit run through both structures by one engine, with the dividend rates that took effect on 6 April 2026.',
  resume: (h) => {
    const c = h.E.compareStructures({ profit: EXAMPLE, region: 'ruk' });
    const D = h.P.dividends;
    return `On ${h.m(EXAMPLE)} of profit in ${h.P.taxYear}, a sole trader in England, Wales or Northern Ireland keeps ${h.m(c.soleTakeHome)}, while a one-director company paying a ${h.m(c.salary)} salary and drawing everything else as dividends leaves ${h.m(c.ltdAll.takeHome)}: ${h.m(Math.abs(c.gapAllDrawn))} ${c.gapAllDrawn < 0 ? 'less' : 'more'}. That is close to the company’s best case. With dividends taxed at ${h.pc(D.basic)}, ${h.pc(D.higher)} and ${h.pc(D.additional)} from 6 April 2026, Corporation Tax between ${h.pc(h.P.corporationTax.smallRate)} and ${h.pc(h.P.corporationTax.mainRate)}, and employer National Insurance on the director’s salary with no Employment Allowance, a company that pays out all its profit leaves less than self-employment at almost every level of profit outside Scotland. The engine finds the company ahead only ${say(h, wins(h, 'ruk'))}. Scotland is different, because its Income Tax bands bite earlier on trading profit while dividends keep the UK bands. What really moves the answer is how much profit you leave inside the company, and the running costs a company adds that no tax table shows.`;
  },
  faqs: (h) => {
    const s = wins(h, 'scotland');
    const c40 = h.E.compareStructures({ profit: 30000, region: 'ruk' });
    const g70 = h.E.compareStructures({ profit: 70000, region: 'scotland' }), e70 = h.E.compareStructures({ profit: 70000, region: 'ruk' });
    const c100 = h.E.compareStructures({ profit: 100000, region: 'ruk' });
    const half = h.E.compareStructures({ profit: 80000, region: 'ruk', drawShare: 0.5 });
    return [
      { q: 'At what profit does a limited company become worth it in 2026/27?', a: `If every pound is paid out to you, there is barely such a point in England, Wales or Northern Ireland: the engine finds the company ahead only ${say(h, wins(h, 'ruk'))}. On ${h.m(100000)} it leaves ${h.m(Math.abs(c100.gapAllDrawn))} less than a sole trader. A Scottish resident sees the company ahead ${say(h, s)}, before any accountancy fee.` },
      { q: 'Is a limited company still more tax efficient with the 2026/27 dividend rates?', a: `Not when all the profit is drawn. At ${h.m(30000)} of profit a sole trader in England keeps ${h.m(c40.soleTakeHome)}; the company route leaves ${h.m(c40.ltdAll.takeHome)}. The advantage returns only for profit kept in the company: at ${h.m(80000)}, drawing half leaves ${h.m(half.ltd.takeHome)} in your pocket and ${h.m(half.ltd.retained)} inside, so far taxed at Corporation Tax only.` },
      { q: 'Does a one-person company get the Employment Allowance?', a: `No. GOV.UK says a company whose only director is also its only employee paid above the secondary threshold cannot claim it, so the company pays employer National Insurance at ${h.pc(h.P.class1.employerRate)} on salary above ${h.m(h.P.class1.secondaryThreshold)}. On a ${h.m(h.P.class1.primaryThreshold)} salary that is ${h.m(h.E.class1Employer(h.P.class1.primaryThreshold))} a year, which this comparison counts.` },
      { q: 'Is a limited company better in Scotland than in England?', a: `On the tax alone it can be, at some profits. At ${h.m(70000)}, drawing everything, the company leaves a Scottish resident ${h.m(Math.abs(g70.gapAllDrawn))} ${g70.gapAllDrawn >= 0 ? 'more' : 'less'} than self-employment, while in England it leaves ${h.m(Math.abs(e70.gapAllDrawn))} ${e70.gapAllDrawn >= 0 ? 'more' : 'less'}. The reason is that Scottish rates, ${h.pc(h.P.incomeTax.scotland.bands[3].rate)} from ${h.m(h.T.scotHigherFrom)}, hit trading profit but not dividends.` },
    ];
  },
  body: (h) => {
    const P = h.P, D = P.dividends, CT = P.corporationTax, C1 = P.class1;
    const sign = (n: number) => `${n >= 0 ? '+' : '−'}${h.m(Math.abs(n))}`;
    const rows = [20000, 30000, 40000, 50000, 60000, 80000, 100000, 150000].map((p) => {
      const r = h.E.compareStructures({ profit: p, region: 'ruk' }), s = h.E.compareStructures({ profit: p, region: 'scotland' });
      return [h.m(p), h.m(r.soleTakeHome), h.m(r.ltdAll.takeHome), sign(r.gapAllDrawn), sign(s.gapAllDrawn)];
    });
    const soleBasic = P.incomeTax.ruk.bands[0].rate + P.class4.mainRate;
    const soleHigher = P.incomeTax.ruk.bands[1].rate + P.class4.upperRate;
    const ctMarg = (h.E.corporationTax(100100).tax - h.E.corporationTax(100000).tax) / 100;
    const coBasic = Math.round((1 - (1 - CT.smallRate) * (1 - D.basic)) * 1000) / 1000;
    const coHigher = Math.round((1 - (1 - ctMarg) * (1 - D.higher)) * 1000) / 1000;
    const keep = [40000, 60000, 80000, 100000].map((p) => {
      const c = h.E.compareStructures({ profit: p, region: 'ruk', drawShare: 0.5 });
      return [h.m(p), h.m(c.soleTakeHome), h.m(c.ltd.takeHome), h.m(c.ltd.retained), h.m(c.ltd.takeHome + c.ltd.retained)];
    });
    const fee = 1500;
    const sc = h.E.compareStructures({ profit: 70000, region: 'scotland' });
    const beatFrom = [40000, 60000, 80000, 100000].find((p) => { const c = h.E.compareStructures({ profit: p, region: 'ruk', drawShare: 0.5 }); return c.ltd.takeHome + c.ltd.retained > c.soleTakeHome; });
    return `
<h2>Every level of profit, both structures</h2>
<p>The table runs each profit through the same engine twice. The company pays the director the salary that leaves the most cash (${h.m(C1.primaryThreshold)} for most of the range), then employer National Insurance, then Corporation Tax, and pays out everything left as a dividend. The last two columns show the gap: a minus sign means the company leaves less than staying self-employed.</p>
${h.table(['Profit', 'Sole trader keeps', 'Company, all drawn', 'Gap rUK', 'Gap Scotland'], rows, `${P.taxYear}, one director, no other income, no student loan, no company running costs counted.`, ['r', 'r', 'r', 'r', 'r'])}
<p>Outside Scotland the gap stays negative almost everywhere. A self-employed electrician on ${h.m(30000)} and a consultant on ${h.m(150000)} both keep more without a company, if they need all the money each year. The figures ignore what a company costs to run, so the real gap is wider than shown.</p>
<h2>Why the old advantage disappeared</h2>
<p>Look at the tax on one extra pound of profit. A sole trader in the basic rate band pays ${h.pc(soleBasic)} on it: Income Tax plus Class 4. Through a company the same pound first loses ${h.pc(CT.smallRate)} to Corporation Tax, then the dividend rate of ${h.pc(D.basic)} applies to what is left, about ${h.pc(coBasic)} in all. Higher up, the sole trader pays ${h.pc(soleHigher)}, because Class 4 falls to ${h.pc(P.class4.upperRate)} above ${h.m(h.T.upl)}, while a company profit inside the marginal relief band pays ${h.pc(ctMarg)} at the margin and then ${h.pc(D.higher)} on the dividend: about ${h.pc(coHigher)}.</p>
<p>The company keeps two genuine savings. Salary up to the Personal Allowance is a deductible cost with no employee National Insurance. And the director’s personal income (salary plus dividends) is smaller than the company’s profit, because Corporation Tax has already come out, so it stays in the basic rate band for longer. In ${P.taxYear} those savings are roughly cancelled by employer National Insurance at ${h.pc(C1.employerRate)} on salary above ${h.m(C1.secondaryThreshold)}, which a sole director cannot offset with the Employment Allowance (${h.src('gov_employment_allowance', 'GOV.UK eligibility rules')}), and by the dividend rates in force since 6 April 2026 (${h.src('gov_dividends', 'GOV.UK, tax on dividends')}).</p>
<h2>Scotland: where the company comes out ahead</h2>
<p>A Scottish sole trader pays Scottish rates on trading profit: ${h.pc(P.incomeTax.scotland.bands[2].rate)} in the intermediate band and ${h.pc(P.incomeTax.scotland.bands[3].rate)} from ${h.m(h.T.scotHigherFrom)}. Dividends do not follow: a Scottish taxpayer pays the same dividend tax as the rest of the UK, with the UK bands, so the higher dividend rate starts only at ${h.m(h.T.higherFrom)} of total income. The company lives off that mismatch. With everything drawn, the engine puts the company ahead ${say(h, wins(h, 'scotland'))}, and behind elsewhere. If the company costs, say, ${h.m(fee)} a year more to run than a sole trade, the company stays ahead only ${say(h, wins(h, 'scotland', fee))}.</p>
<p>Take a self-employed joiner in Glasgow with ${h.m(70000)} of profit. As a sole trader the bill is ${h.m(sc.sole.saBill)} and ${h.m(sc.soleTakeHome)} is left. Through a company paying ${h.m(sc.salary)} of salary, the company owes ${h.m(sc.ltdAll.employerNI)} of employer National Insurance and ${h.m(sc.ltdAll.ct.tax)} of Corporation Tax, then pays ${h.m(sc.ltdAll.dividends)} of dividends on which the director owes ${h.m(sc.ltdAll.it.tax)} of Income Tax. That leaves ${h.m(sc.ltdAll.takeHome)}, a difference of ${h.m(Math.abs(sc.gapAllDrawn))} ${sc.gapAllDrawn >= 0 ? 'in the company’s favour' : 'in favour of staying self-employed'}. The same joiner living in Carlisle would see the gap at ${sign(h.E.compareStructures({ profit: 70000, region: 'ruk' }).gapAllDrawn)}.</p>
<h2>Leaving profit in the company</h2>
<p>The comparison changes as soon as you stop drawing everything. Profit retained in the company has paid Corporation Tax but no dividend tax yet. A designer who lives on part of the profit and lets the rest build up for new equipment or a quiet year is in a different position from one who spends every pound. The table halves the draw.</p>
${h.table(['Profit', 'Sole trader keeps', 'Company: paid to you', 'Left in company', 'Both together'], keep, 'England, Wales or Northern Ireland, half of the profit after Corporation Tax paid out as dividends.', ['r', 'r', 'r', 'r', 'r'])}
<p>The last column adds the two${beatFrom ? ` and beats self-employment from ${h.m(beatFrom)} in this table` : ''}. Read it with care: money left in the company is not yours yet. It meets dividend tax when you take it, at a rate set by your income in that later year. Set the share you draw in the calculator above; the ${h.a('limited-company-tax-calculator', 'limited company tax calculator')} breaks the same split into Corporation Tax, employer National Insurance and your own tax.</p>
${h.box('Reading the result', `<p>All profit drawn: the sole trader usually keeps more in ${P.taxYear}, except across parts of the Scottish bands. Profit kept back: the company defers tax rather than removing it. None of this is advice for your own case; it is the arithmetic of the ${P.taxYear} rates.</p>`, 'tip')}
<h2>What the tax tables leave out</h2>
<p>A company is legally separate from its owners. Its debts are its own, so the owners are generally responsible only up to what they invested, while a sole trader is personally liable for every business debt. That protection is the strongest non-tax reason some builders and consultants incorporate.</p>
<p>In return the company brings duties. It is registered at Companies House, confirms its details there each year, files annual accounts and a Company Tax Return, registers as an employer to pay the director a salary, and keeps minutes and a voucher for every dividend. Its name, registered number and office address must appear on its letters, website and order forms, and a sole trader’s figures go to HMRC alone while a company’s accounts are filed at Companies House too. Most directors pay an accountant for part of this, a cost the tables above leave out.</p>
<p>Two last points. A contractor working through a company for a medium or large client may find a contract inside ${h.a('ir35', 'IR35')}, which removes most of the company’s tax effect on that income. And the salary you choose sets your National Insurance record as a director: the ${h.a('salary-and-dividends-calculator', 'director’s salary calculator')} shows what each level costs.</p>`;
  },
});
