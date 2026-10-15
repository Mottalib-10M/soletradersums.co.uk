import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'trading-allowance',
  group: 'tax',
  order: 11,
  tool: { kind: 'mini:trading', props: { gross: 3200, exp: 450 } },
  related: ['employed-and-self-employed', 'register-as-self-employed', 'self-employed-expenses', 'simplified-expenses'],
  sources: ['gov_trading_allowance', 'leg_ittoia_783a', 'gov_register_se', 'gov_expenses', 'gov_income_tax_rates'],
  slug: 'trading-allowance',
  nav: 'Trading allowance',
  card: 'Up to £1,000 of side income tax-free, or £1,000 off bigger takings instead of your real costs.',
  title: 'Trading Allowance 2026/27: £1,000 Tax-Free or Expenses?',
  description: 'The £1,000 trading allowance in 2026/27: full relief under £1,000, partial relief above it, when real expenses beat it, who cannot use it and when to register.',
  h1: 'The £1,000 trading allowance',
  intro: 'A flat £1,000 deduction for small trading income, used instead of your real costs and never on top of them.',
  resume: (h) => {
    const A = h.P.tradingAllowance.amount;
    const ex = h.E.tradingAllowance(3200, 450);
    return `The trading allowance lets an individual earn up to ${h.m(A)} of gross trading income in ${h.P.taxYear} without paying tax on it and, in most cases, without telling HMRC; GOV.UK calls this full relief. Above ${h.m(A)} it becomes a choice: deduct a flat ${h.m(A)} from your takings, known as partial relief, or deduct your real allowable expenses, but never both. A weekend dog walker who takes ${h.m(3200)} and spends ${h.m(450)} on leads, treats and insurance is taxed on ${h.m(ex.profit)} with the allowance instead of ${h.m(ex.withExpenses)} with receipts. Gross means everything you invoice or receive before any cost, from one trade or several added together. Once gross income passes ${h.m(A)} you must register for Self Assessment by ${h.P.selfAssessment.registerBy} after the end of the tax year, even if the allowance then wipes out most of the profit. Type your takings and costs below to see which route leaves less to tax.`;
  },
  faqs: (h) => {
    const A = h.P.tradingAllowance.amount;
    const side = h.E.tradingAllowance(2600, 300);
    const job = h.E.selfEmployed({ profit: side.profit, employment: 30000, region: 'ruk' });
    return [
      { q: 'Do I have to tell HMRC about £900 of income from selling crafts?', a: `Usually not. Gross trading income of ${h.m(A)} or less a year is covered by full relief, so there is nothing to declare unless you need a return for another reason, want to claim a loss, or want to pay voluntary Class 2 to protect benefits. You still have to keep a record of what you received, such as invoices or bank statements.` },
      { q: 'Can I deduct the trading allowance and my expenses at the same time?', a: `No. Above ${h.m(A)} of gross income you pick one: the flat ${h.m(A)}, or your actual allowable expenses and capital allowances. With the allowance no other costs can be taken off. If your real costs are higher than ${h.m(A)}, or you made a loss, the expenses route will normally leave less profit to tax.` },
      { q: 'How much tax is due on £2,600 of side income next to a £30,000 salary?', a: `With the trading allowance, ${h.m(side.profit)} is taxable. On top of a ${h.m(30000)} salary in England, Wales or Northern Ireland that costs ${h.m(job.saBill)} through Self Assessment in ${h.P.taxYear}, all of it basic-rate Income Tax, because Class 4 only starts once the trading profit itself passes ${h.m(h.T.lpl)}.` },
      { q: 'Can I use the trading allowance on money from my own employer?', a: `No. The allowances cannot be used in a tax year where you have trading income from your employer or from your spouse’s or civil partner’s employer, from a company you or someone connected to you controls, or from a partnership you or a connected person belong to. Partnership trading income is excluded in every case.` },
    ];
  },
  body: (h) => {
    const A = h.P.tradingAllowance.amount;
    const cases: Array<[string, number, number]> = [['Babysitter', 1800, 120], ['Market stall', 6000, 2900], ['Tool hire to neighbours', 1400, 650], ['Weekend photographer', 4500, 980]];
    const rows = cases.map(([who, g, e]) => { const r = h.E.tradingAllowance(g, e); return [who, h.m(g), h.m(e), h.m(r.withAllowance), h.m(r.withExpenses), r.best === 'allowance' ? 'allowance' : 'expenses']; });
    const g = 4000, wages = 26000;
    const r = h.E.tradingAllowance(g, 300);
    const t1 = h.E.selfEmployed({ profit: r.withAllowance, employment: wages, region: 'ruk' });
    const t2 = h.E.selfEmployed({ profit: r.withExpenses, employment: wages, region: 'ruk' });
    return `
<h2>Full relief and partial relief</h2>
<p>The allowance sits in section 783A of the Income Tax (Trading and Other Income) Act 2005 and works at two levels. If total gross trading income for the year is ${h.m(A)} or less, all of it is exempt: no tax, and usually no return. If gross income is higher, you may deduct up to ${h.m(A)} instead of working out expenses, but you cannot create a loss with it. The same rule applies whether you keep your books on the ${h.a('cash-basis', 'cash basis')} or with traditional accounting, because the test looks at what goes on the return before any deduction.</p>
<p>The allowance belongs to the person, not to each activity. A tutor who also sells prints online adds both sets of takings together, and a single ${h.m(A)} covers the total. There is a separate ${h.m(A)} property allowance for rental income, so a landlord with a small side trade can have both.</p>
<h2>Allowance or real costs: four examples</h2>
<p>The comparison is simple arithmetic: the allowance wins whenever your genuine allowable costs are below ${h.m(A)}. Activities with very few costs, such as tutoring or casual services, tend to favour it; anything that buys stock or materials usually does not.</p>
${h.table(['Activity', 'Gross', 'Real costs', 'Taxable with allowance', 'Taxable with expenses', 'Better route'], rows, `Figures for one tax year, ${h.P.taxYear}.`, ['l', 'r', 'r', 'r', 'r', 'l'])}
<p>The babysitter is under ${h.m(A)} once you look at the taxable column, but not exempt: gross takings of ${h.m(1800)} are above the limit, so registration is still needed even though the profit after the allowance is small.</p>
<h2>What it is worth next to a job</h2>
<p>Most people using the allowance have a salary as well, so the profit is taxed at their top rate through Self Assessment. Someone earning ${h.m(wages)} who makes ${h.m(g)} from evening bike repairs with ${h.m(300)} of parts pays ${h.m(t1.saBill)} using the allowance, against ${h.m(t2.saBill)} if they listed the parts instead. The ${h.a('employed-and-self-employed', 'job plus self-employment calculator')} handles larger side businesses, where Class 4 starts to matter.</p>
<h2>Registering, records and other effects</h2>
<p>When gross income goes over ${h.m(A)}, ${h.a('register-as-self-employed', 'registering for Self Assessment')} is required, by ${h.P.selfAssessment.registerBy} after the tax year in which it happened. Some people under the limit register anyway, for example to claim a loss, to pay voluntary Class 2 contributions or to claim Maternity Allowance or Tax-Free Childcare based on self-employment. Records still matter at any level: invoices, bank statements, a diary of jobs or a simple spreadsheet of receipts. Profit reduced by the allowance also counts for the High Income Child Benefit Charge and student loan repayments, while Universal Credit uses its own income rules and ignores the allowance. Source: ${h.src('gov_trading_allowance')}.</p>`;
  },
});
