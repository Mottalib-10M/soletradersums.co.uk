import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'child-benefit-charge-self-employed',
  group: 'tax',
  order: 15,
  tool: { kind: 'mini:hicbc', props: { income: 68000, kids: 2 } },
  related: ['personal-allowance-taper', 'pension-tax-relief-self-employed', 'self-employed-tax-on-60000', 'self-employed-tax-on-75000'],
  sources: ['gov_hicbc', 'gov_child_benefit', 'gov_pension_relief', 'gov_trading_allowance', 'gov_se_nic'],
  slug: 'child-benefit-charge-self-employed',
  nav: 'Child Benefit charge',
  card: 'Profit between £60,000 and £80,000 claws back Child Benefit: 1 % for every £200, all of it at £80,000.',
  title: 'Child Benefit Charge for the Self-Employed 2026/27',
  description: 'High Income Child Benefit Charge for sole traders, 2026/27: 1 % back per £200 over £60,000, all of it at £80,000, the real marginal rate, and pension relief.',
  h1: 'The High Income Child Benefit Charge when you are self-employed',
  intro: 'Once adjusted net income passes £60,000, Child Benefit is taken back through your tax return, a slice at a time.',
  resume: (h) => {
    const H = h.P.hicbc;
    const r = h.E.childBenefitCharge(70000, 2);
    return `A self-employed parent with ${h.m(70000)} of adjusted net income and two children pays back ${h.m(r.charge)} of the ${h.m(r.benefit)} of Child Benefit the family receives in ${h.P.taxYear}, ${r.pct} % of it. The High Income Child Benefit Charge takes 1 % of the year’s benefit for every ${h.m(H.stepPerPercent)} of income above ${h.m(H.start)}, and all of it once income passes ${h.m(H.end)}. Child Benefit itself is ${h.m2(H.eldestWeekly)} a week for the eldest or only child and ${h.m2(H.otherWeekly)} for each other child. The charge falls on the partner with the higher adjusted net income, whoever actually receives the payments, and a sole trader has to pay it through Self Assessment alongside Income Tax and Class 4. Adjusted net income starts with profit and other taxable income, savings and dividends included, then deducts gross pension contributions and Gift Aid. Enter yours and the number of children below to see the charge and what the family keeps.`;
  },
  faqs: (h) => {
    const H = h.P.hicbc;
    const one = h.E.childBenefitCharge(72000, 1), two = h.E.childBenefitCharge(72000, 2);
    const pen = 9000;
    const c0 = h.E.childBenefitCharge(69000, 2).charge, c1 = h.E.childBenefitCharge(69000 - pen, 2).charge;
    return [
      { q: 'How much Child Benefit do I pay back on £72,000 of self-employed profit?', a: `With no other income and no pension contributions, ${h.m(72000)} is ${h.m(72000 - H.start)} over the threshold, so ${one.pct} % of the benefit is charged: ${h.m(one.charge)} with one child or ${h.m(two.charge)} with two, in ${h.P.taxYear}. Gross pension contributions or Gift Aid would lower the figure tested.` },
      { q: 'Which partner pays the Child Benefit charge when both are self-employed?', a: `The one with the higher adjusted net income, as long as at least one of you is over ${h.m(H.start)}. It does not matter who claims the benefit or whose child it is. Partner means a spouse, civil partner or someone you live with as a couple, and a sole trader must report the charge on the Self Assessment return.` },
      { q: 'Can a pension contribution cancel the Child Benefit charge?', a: `It can reduce or remove it, because gross personal contributions come off adjusted net income. A sole trader at ${h.m(69000)} with two children who pays ${h.m(pen)} gross into a pension brings the figure to ${h.m(69000 - pen)}, and the charge falls from ${h.m(c0)} to ${h.m(c1)}, on top of the normal tax relief on the contribution.` },
      { q: 'Is it worth claiming Child Benefit if my profit is over £80,000?', a: `Above ${h.m(H.end)} the charge equals the benefit, so payments bring in nothing. Claiming and then opting out of payments still has value: no charge is due, you still get National Insurance credits that count towards the State Pension, and the child receives a National Insurance number without applying at 16.` },
    ];
  },
  body: (h) => {
    const H = h.P.hicbc;
    const span = H.end - H.start;
    const rows = [H.start, 62000, 65000, 70000, 75000, H.end].map((y) => [h.m(y), `${h.E.childBenefitCharge(y, 1).pct} %`, h.m(h.E.childBenefitCharge(y, 1).charge), h.m(h.E.childBenefitCharge(y, 2).charge), h.m(h.E.childBenefitCharge(y, 3).charge)]);
    const mr = h.E.marginalOnProfit({ profit: 70000, region: 'ruk' }, 1000);
    const r1 = (x: number) => Math.round(x * 1000) / 1000;
    const b2 = h.E.childBenefitCharge(0, 2).benefit, b3 = h.E.childBenefitCharge(0, 3).benefit;
    const P0 = 74000, gross = P0 - H.start;
    const ch = h.E.childBenefitCharge(P0, 2).charge;
    const s0 = h.E.selfEmployed({ profit: P0, region: 'ruk' }), s1 = h.E.selfEmployed({ profit: P0, region: 'ruk', pensionGross: gross });
    const atSource = gross * h.P.pension.basicRelief, viaSA = s0.saBill - s1.saBill;
    return `
<h2>The ${h.m(span)} band, step by step</h2>
<p>The charge rises in whole percentage points, one for each full ${h.m(H.stepPerPercent)} of income above ${h.m(H.start)}. It is a share of the Child Benefit paid for the tax year, never more than the benefit itself. The table assumes a full year of payments.</p>
${h.table(['Adjusted net income', 'Share repaid', '1 child', '2 children', '3 children'], rows, `Charge for ${h.P.taxYear}, ${H.weeks} weeks of Child Benefit at the current weekly rates.`, ['r', 'r', 'r', 'r', 'r'])}
<h2>What the band really costs a pound</h2>
<p>Inside the band every extra pound of profit pays tax and also gives back part of the benefit. For a sole trader in England, Wales or Northern Ireland at ${h.m(70000)}, Income Tax and Class 4 take ${h.pc(mr)} of the next pound. With two children the charge adds ${h.m(b2)} spread over ${h.m(span)}, or about ${h.pc(r1(b2 / span))}, so the true cost is close to ${h.pc(r1(mr + b2 / span))}. With three children it is close to ${h.pc(r1(mr + b3 / span))}. Few people notice this rate until the first tax return in the band, because the charge appears only when the return is filed, not when the money is earned.</p>
<h2>Adjusted net income, for someone who invoices</h2>
<p>For a sole trader the starting point is taxable profit, after allowable expenses and capital allowances, or after the ${h.a('trading-allowance', 'trading allowance')} if that was used. Add any salary, rental profit, savings interest and dividends. Then subtract gross personal pension contributions and Gift Aid. A graphic designer whose business makes ${h.m(58000)} but who also has ${h.m(5000)} of dividends is in the band; a partner with ${h.m(66000)} of profit who pays ${h.m(6000)} gross into a pension is not. Because profit is only known after the year ends, the charge for ${h.P.taxYear} is settled with the rest of the bill on ${h.date(h.E.saCalendar(h.P.year).payment)}.</p>
<h2>A pension contribution worked through</h2>
<p>Take a self-employed electrician at ${h.m(P0)} of profit with two children. The charge is ${h.m(ch)}. A gross pension contribution of ${h.m(gross)}, the amount above ${h.m(H.start)}, brings adjusted net income down to the threshold and removes the charge entirely. The provider adds ${h.m(atSource)} of basic-rate relief, so the electrician pays in ${h.m(gross - atSource)}; the return then gives ${h.m(viaSA)} of higher-rate relief. Add the ${h.m(ch)} of Child Benefit kept, and a ${h.m(gross)} pension costs ${h.m(gross - atSource - viaSA - ch)} out of pocket. The ${h.a('pension-tax-relief-self-employed', 'pension relief calculator')} works out the relief on other amounts.</p>
${h.box('Self Assessment is compulsory here', '<p>Employees can sometimes have the charge collected through their tax code. Anyone who already sends a tax return, as every sole trader over the trading allowance does, must report and pay it through Self Assessment instead.</p>', 'warning')}
<h2>Claiming, opting out and the bigger picture</h2>
<p>Registering for Child Benefit and then opting out of payments avoids the charge while keeping the National Insurance credits that count towards the State Pension. Payments can be restarted later if income falls. Above ${h.m(h.P.incomeTax.taperStart)} the ${h.a('personal-allowance-taper', 'Personal Allowance taper')} begins, which uses the same measure of income. Sources: ${h.src('gov_hicbc')}; ${h.src('gov_child_benefit')}.</p>`;
  },
});
