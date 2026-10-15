import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'sole-trader-tax',
  group: 'tax',
  order: 1,
  mini: { kind: 'mini:st-quick' },
  related: ['self-employed-expenses', 'class-4-national-insurance', 'how-much-tax-to-save-self-employed', 'limited-company-vs-sole-trader'],
  sources: ['gov_set_up_sole_trader', 'gov_income_tax_rates', 'gov_se_nic', 'gov_expenses', 'gov_sa_deadlines'],
  slug: 'sole-trader-tax',
  nav: 'Sole trader tax',
  card: 'How a sole trader is taxed: profit not drawings, the parts of the bill, the dates and the records.',
  title: 'Sole Trader Tax 2026/27: How Profit Is Taxed in Britain',
  description: 'Sole trader tax for 2026/27: why HMRC taxes profit rather than drawings, the Income Tax and Class 4 on it, when the bill falls due and which records to keep.',
  h1: 'Sole trader tax: how your profit is taxed',
  intro: 'A sole trader and the business are one taxpayer, so the profit lands on your own return whether you spend it or leave it in the account.',
  resume: (h) => {
    const P = h.P;
    const r = h.E.selfEmployed({ profit: 35000, region: 'ruk' });
    const cal = h.E.saCalendar(P.year);
    return `A sole trader with ${h.m(35000)} of profit in ${P.taxYear} pays ${h.m(r.it.tax)} of Income Tax and ${h.m(r.class4.total)} of Class 4 National Insurance in England, Wales or Northern Ireland, ${h.m(r.saBill)} in total, which is ${h.pc(Math.round(r.setAside * 1000) / 1000)} of the profit. The tax is worked out on profit, meaning sales minus allowable expenses, and never on the money you transfer to your personal account: those transfers, called drawings, are neither an expense nor taxable income. Profit is added to any wages, pension or rent you have, the Personal Allowance of ${h.m(h.T.pa)} comes off once, and the rest is taxed in bands. Class 4 is charged on the trading profit alone, at ${h.pc(P.class4.mainRate)} from ${h.m(h.T.lpl)} to ${h.m(h.T.upl)} and ${h.pc(P.class4.upperRate)} above. You report the year on a Self Assessment return and pay by ${h.date(cal.online)}, with payments on account towards the following year once the bill reaches ${h.m(P.paymentsOnAccount.minBill)}.`;
  },
  faqs: (h) => {
    const P = h.P;
    const a = h.E.selfEmployed({ profit: 22000, region: 'ruk' });
    return [
      { q: 'Do sole traders pay tax on money they take out of the business?', a: `No. Drawings are neither taxed nor deductible: HMRC taxes the profit of the year, whatever you withdraw. A tutor with ${h.m(22000)} of profit who draws ${h.m(30000)}, topping up from savings, pays the same as one who draws nothing: ${h.m(a.saBill)} of Income Tax and Class 4 in England, Wales or Northern Ireland.` },
      { q: 'Is a sole trader personally liable for business debts?', a: `Yes. GOV.UK describes the sole trader structure as having unlimited liability: the owner is personally responsible for every debt of the business, so a supplier or lender can pursue your own savings or property. Insurance can soften some risks, but the legal position is the same whether your profit is ${h.m(5000)} or ${h.m(500000)}.` },
      { q: 'Can a sole trader pay themselves a salary to cut tax?', a: `No. There is no employment between you and your own business, so a “salary” you pay yourself is simply drawings and not an allowable expense. Wages paid to genuine staff are deductible. Tax is charged on the profit, and the first ${h.m(h.T.pa)} of your total income is covered by the Personal Allowance while income stays under ${h.m(h.T.taperStart)}.` },
      { q: 'At what income does a sole trader start paying tax?', a: `With no other income, Income Tax starts once profit passes the Personal Allowance of ${h.m(h.T.pa)}, and Class 4 starts at the same point, its lower profits limit being ${h.m(h.T.lpl)}. You must still register with HMRC once gross trading income in a tax year passes ${h.m(P.tradingAllowance.amount)}, even if no tax ends up due.` },
      { q: 'Does a sole trader need a separate business bank account?', a: `GOV.UK sets no such rule for sole traders, unlike a company, which is a separate legal person. What HMRC requires is records good enough to work out profit and back up each figure. A separate account makes that far easier, and once turnover passes ${h.m(P.mtd.stages[1].threshold)} the records must also be digital under Making Tax Digital.` },
      { q: 'Do sole traders in Scotland pay different tax?', a: `On the profit, yes: Scottish taxpayers use six Income Tax bands, from ${h.pc(P.incomeTax.scotland.bands[0].rate)} to ${h.pc(P.incomeTax.scotland.bands[5].rate)}. Class 4 is the same across the UK. On ${h.m(35000)} a Scottish sole trader pays ${h.m(h.E.selfEmployed({ profit: 35000, region: 'scotland' }).saBill)} in total, against ${h.m(h.E.selfEmployed({ profit: 35000, region: 'ruk' }).saBill)} in the rest of the UK.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const B = P.incomeTax.ruk.bands;
    const cal = h.E.saCalendar(P.year);
    const rows = [15000, 25000, 35000, 50000, 70000].map((p) => {
      const r = h.E.selfEmployed({ profit: p, region: 'ruk' });
      return [h.m(p), h.m(r.it.tax), h.m(r.class4.total), h.m(r.saBill), h.pc(Math.round(r.setAside * 1000) / 1000)];
    });
    const loan = h.E.selfEmployed({ profit: 35000, region: 'ruk', plan: 'plan2' });
    const plain = h.E.selfEmployed({ profit: 35000, region: 'ruk' });
    const exp = h.E.selfEmployed({ profit: 31000, region: 'ruk' });
    return `
<h2>One person, one taxpayer</h2>
<p>Setting up as a sole trader creates no new legal person. GOV.UK calls it the simplest business structure: you work for yourself, you are classed as self-employed and you take every decision (${h.src('gov_set_up_sole_trader', 'GOV.UK, set up as a sole trader')}). The trading name on your van or your website is only a label. For tax purposes the plumber, the illustrator and the dog walker are individuals with a trade, and the trade’s profit is part of their own income for the year.</p>
<p>The same fact explains the main legal drawback. Sole traders have unlimited liability, so the debts of the business are your debts. A customer who sues, a supplier left unpaid or a loan you signed for the business can all reach your personal assets. That is a matter of law rather than tax, but it is the first thing people weigh when they set this structure against a company.</p>

<h2>Profit, not drawings</h2>
<p>New sole traders often assume they will be taxed on what they “pay themselves”. They will not. HMRC looks at the profit of the tax year: what the business earned, less the allowable expenses of earning it. Money moved from the business account to your personal account is a drawing, and drawings change nothing. GOV.UK puts it in one line on its expenses guide: allowable expenses do not include money taken from your business for personal use (${h.src('gov_expenses', 'GOV.UK, expenses if you are self-employed')}).</p>
<p>Two consequences follow. A designer who leaves ${h.m(10000)} in the business account at the end of the year is still taxed on it, because it is profit. A driver who draws more than the profit in a quiet year, living partly on last year’s savings, pays no extra tax for doing so. The bill moves with profit alone, which is why a projection of profit is the only figure you need to estimate it.</p>
<p>Expenses are where the bill can legitimately shrink. A cost incurred for the business, such as stock, fuel for business journeys, insurance or a trade subscription, comes off sales before tax. Starting from ${h.m(35000)} of profit, a further ${h.m(4000)} of genuine expenses brings the bill down from ${h.m(plain.saBill)} to ${h.m(exp.saBill)}. The ${h.a('self-employed-expenses', 'allowable expenses guide')} lists what HMRC accepts, and very small traders can use the ${h.a('trading-allowance', 'trading allowance')} of ${h.m(P.tradingAllowance.amount)} instead of real costs.</p>

<h2>The parts of a sole trader’s bill</h2>
<h3>Income Tax</h3>
<p>Profit is added to your other taxable income. The Personal Allowance of ${h.m(h.T.pa)} comes off first; in England, Wales and Northern Ireland the next slice is taxed at ${h.pc(B[0].rate)} up to ${h.m(h.T.basicTo)} of income, then ${h.pc(B[1].rate)}, and ${h.pc(B[2].rate)} above ${h.m(h.T.additionalFrom - 1)} (${h.src('gov_income_tax_rates', 'GOV.UK, Income Tax rates')}). From ${h.m(h.T.taperStart)} the allowance shrinks, and it has gone entirely at ${h.m(h.T.paGone)}. Scottish taxpayers apply their own six bands to the same profit, set out on the ${h.a('self-employed-tax-scotland', 'Scotland page')}.</p>
<h3>Class 4 National Insurance</h3>
<p>Class 4 is charged on trading profit only, never on wages or rent: ${h.pc(P.class4.mainRate)} between ${h.m(h.T.lpl)} and ${h.m(h.T.upl)}, ${h.pc(P.class4.upperRate)} on anything above (${h.src('gov_se_nic', 'GOV.UK, self-employed National Insurance rates')}). It is collected with Income Tax through Self Assessment. Class 2 is no longer charged: with profit of ${h.m(h.T.spt)} or more it is treated as paid, so the year counts towards your State Pension at no cost. The ${h.a('class-4-national-insurance', 'Class 4 page')} and the ${h.a('class-2-national-insurance', 'Class 2 guide')} go through each one.</p>
<h3>Student loan repayments</h3>
<p>If you have a student loan, HMRC adds the year’s repayment to your Self Assessment bill. On ${h.m(35000)} of profit, a Plan 2 borrower repays ${h.m(loan.loan.total)} on top of tax and Class 4, which takes the bill to ${h.m(loan.saBill)}. Thresholds by plan are on the ${h.a('student-loan-self-employed', 'student loan page')}.</p>
<h3>Payments on account</h3>
<p>These are not a tax of their own but an advance on next year’s. Once your Income Tax and Class 4 through Self Assessment reach ${h.m(P.paymentsOnAccount.minBill)}, HMRC asks for half of that figure on ${P.paymentsOnAccount.dueFirst} and half on ${P.paymentsOnAccount.dueSecond}. In the first year this makes January heavy, as the ${h.a('payments-on-account', 'payments on account page')} shows.</p>

<h2>What different profits cost</h2>
<p>The table runs the same engine as the calculator above for five profits, with no other income and no student loan, for someone living in England, Wales or Northern Ireland.</p>
${h.table(['Profit', 'Income Tax', 'Class 4', 'Total', 'Share of profit'], rows, `Sole trader, ${P.taxYear}, England, Wales or Northern Ireland.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The share climbs with profit because more of it sits in higher bands, yet it stays far below the headline rates: even at ${h.m(70000)} the bill is well under a third of the profit, since the first ${h.m(h.T.pa)} is untaxed and the basic band is wide.</p>

<h2>When the tax is paid</h2>
<p>The tax year runs from ${P.taxYearLong}. For ${P.taxYear}, a newcomer registers by ${h.date(cal.registerBy)}, files online by ${h.date(cal.online)} and pays on the same day (${h.src('gov_sa_deadlines', 'GOV.UK, Self Assessment deadlines')}). A paper return is due by ${h.date(cal.paper)}. Nothing is deducted from your invoices along the way, and that is the real difference from a job: the money sits with you until January, so the ${h.a('how-much-tax-to-save-self-employed', 'tax to put aside calculator')} turns the expected bill into a share of each payment you receive.</p>

<h2>Records HMRC expects</h2>
<p>From the first day of trading you must keep records that let you work out profit or loss: sales invoices or a log of takings, receipts for expenses, bank statements and any mileage log. HMRC can charge a penalty if records are inaccurate or incomplete, and it can ask to see them well after the return has gone in. Under Making Tax Digital, sole traders whose turnover was above ${h.m(P.mtd.stages[0].threshold)} keep those records in compatible software from ${h.date(P.mtd.stages[0].start)}, and the test falls to ${h.m(P.mtd.stages[1].threshold)} for a start on ${h.date(P.mtd.stages[1].start)}. The ${h.a('making-tax-digital', 'Making Tax Digital checker')} gives your own start date.</p>
${h.box('Other taxes to watch', `<p>VAT is separate from Income Tax: you must register once taxable turnover passes ${h.m(P.vat.threshold)} over a rolling twelve months, as the ${h.a('vat-threshold-sole-trader', 'VAT threshold page')} explains. Employing staff brings payroll and employer National Insurance. Neither changes how your own profit is taxed.</p>`, 'info')}

<h2>When people look at a company instead</h2>
<p>As profit grows, the question of a limited company comes up. A company pays Corporation Tax on its profit and you then pay tax on the salary and dividends you take out, which is a different set of rules rather than a lower rate. The ${h.a('limited-company-vs-sole-trader', 'sole trader or limited company comparison')} sets both side by side for any profit, with the costs and duties a company adds. For many one-person businesses at modest profit levels the sole trader route remains the simpler of the two.</p>`;
  },
});
