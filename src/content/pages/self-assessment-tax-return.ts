import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'self-assessment-tax-return',
  group: 'admin',
  order: 14,
  mini: { kind: 'mini:sa302', props: { turnover: 30000, exp: 4000, wages: 18000, paye: 1086, region: 0 } },
  related: ['self-assessment-tax-calculator', 'self-assessment-deadlines', 'self-employed-expenses', 'payments-on-account'],
  sources: ['gov_sa_deadlines', 'gov_payments_on_account', 'gov_register_se', 'gov_expenses', 'gov_cash_basis', 'gov_trading_allowance', 'gov_sa302', 'gov_sa_corrections', 'gov_sa_refund', 'gov_records'],
  slug: 'self-assessment-tax-return',
  nav: 'Filing your tax return',
  card: 'What to gather, the filing steps, how to read the SA302 calculation and whether you pay or get money back.',
  title: 'Self Assessment Tax Return 2026/27: UK Self-Employed Guide',
  description: 'Self Assessment tax return for the self-employed: the records and numbers to gather, filing online step by step, what the SA302 shows, and a balance or refund.',
  h1: 'Filing a self-employed Self Assessment tax return',
  intro: 'Most of the work happens before you sign in: once the figures are ready, the return itself is a matter of copying them across.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: 26000, employment: 18000, region: 'ruk' });
    const paye = h.E.incomeTax({ nonSavings: 18000, region: 'ruk' }).tax;
    const due = r.it.tax + r.class4.total - paye;
    const c = h.E.saCalendar(2025);
    return `A sole trader with ${h.m(26000)} of profit and an ${h.m(18000)} salary taxed through PAYE ends up, after the return is filed, with a balance of ${h.m(due)} to pay: Income Tax on all ${h.m(44000)} of income comes to ${h.m(r.it.tax)}, Class 4 to ${h.m(r.class4.total)}, and the ${h.m(paye)} already deducted by the employer is taken off. That is the logic of every Self Assessment return. You report what you earned from each source, HMRC’s system works out the tax on the total, subtracts anything already paid, and the result is either a bill or a repayment. For the ${c.taxYear} year the online return and the money are both due by ${h.date(c.online)}. The calculation that comes back is the SA302. Enter your own turnover, expenses and P60 figures below to see what yours is likely to show.`;
  },
  faqs: (h) => {
    const c = h.E.saCalendar(2025);
    const r = h.E.selfEmployed({ profit: 24000, region: 'ruk' });
    const ref = h.E.incomeTax({ nonSavings: 24500, region: 'ruk' }).tax;
    return [
      { q: 'Can I see how much tax I owe before I submit my return?', a: `Yes, if you file online. The calculation can be viewed in your account before you press submit, and it is worth saving a copy: after submission it can take up to 72 hours to appear. A sole trader with ${h.m(24000)} of profit and no other income would see ${h.m(r.saBill)} for the year, before any payment on account.` },
      { q: 'Why does my SA302 not show my payments on account?', a: `Because the SA302 is the tax for one year, not your account balance. It leaves out payments on account already made, Budget Payment Plan payments and older debts. If you paid ${h.m(r.poaEach)} twice towards a ${h.m(r.saBill)} bill, the SA302 still shows ${h.m(r.saBill)}; the Self Assessment statement is what shows the balance left to pay.` },
      { q: 'How do I get a tax refund through Self Assessment?', a: `File the return with your bank details on it. If the calculation shows you paid too much, for example PAYE of ${h.m(3000)} against a liability of ${h.m(ref)} on ${h.m(24500)} of income, HMRC repays the difference. It may hold the money back instead if a payment such as a payment on account is due within the next 45 days, and set it against that.` },
      { q: 'Can I amend a self assessment tax return after submitting it?', a: `Yes, within twelve months of the filing deadline: for ${c.taxYear}, that runs to ${h.date(h.E.saCalendar(2026).online)}. Online, you wait 72 hours after filing, then reopen the return and file it again. On paper, you send the corrected pages marked “amendment” with your name and UTR. After that window, corrections are made by writing to HMRC.` },
      { q: 'Do I send receipts with my self employed tax return?', a: `No. The return carries totals only: turnover, expenses by category, and other income. The receipts, invoices and bank statements behind them stay with you, and you must keep them for at least five years after the ${h.P.paymentsOnAccount.dueFirst} deadline. For a ${c.taxYear} return filed by ${h.date(c.online)}, that means until at least the end of January ${Number(c.online.slice(0, 4)) + 5}.` },
      { q: 'What if I do not know my final profit by 31 January?', a: `File on time anyway, using provisional figures, which are your best estimate, and tell HMRC that you have done so. When the real numbers arrive, amend the return. Interest is charged from ${h.P.paymentsOnAccount.dueFirst} on any extra tax that turns out to be due, while filing on time with the estimate avoids the ${h.m(h.P.selfAssessment.penalties.initial)} late filing penalty.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const c = h.E.saCalendar(2025);
    const pay = h.E.selfEmployed({ profit: 26000, employment: 18000, region: 'ruk' });
    const paye = h.E.incomeTax({ nonSavings: 18000, region: 'ruk' }).tax;
    const due = pay.it.tax + pay.class4.total - paye;
    const ref = h.E.selfEmployed({ profit: 500, employment: 24000, region: 'ruk' });
    const ta = h.E.tradingAllowance(2400, 1900);
    const steady = h.E.selfEmployed({ profit: 38000, region: 'ruk' });
    return `
<h2>What to gather before you sign in</h2>
<p>A return goes faster when every figure is on one sheet before you open the form. For a sole trader that sheet has three parts.</p>
<h3>The business figures</h3>
<p>Turnover for the year: everything invoiced or, under the cash basis, everything received. Then allowable expenses, grouped the way the form groups them: stock and materials, travel, premises, phone and stationery, insurance and so on (${h.src('gov_expenses', 'GOV.UK, expenses if you’re self-employed')}). If you use simplified expenses for mileage or working from home, have the miles and the hours ready. If your gross income is small, compare your real expenses with the ${h.m(P.tradingAllowance.amount)} trading allowance: a market stall with ${h.m(2400)} of takings and ${h.m(1900)} of costs is taxed on ${h.m(ta.profit)} using ${ta.best === 'expenses' ? 'its expenses' : 'the allowance'}, because that gives the lower profit.</p>
<h3>Income from elsewhere</h3>
<p>Your P60 for any job (pay and tax deducted), untaxed savings interest, dividends, rent, and anything else HMRC does not already tax at source. The return covers all your income, not only the business, which is why a salary changes the tax on the profit.</p>
<h3>Reliefs and loans</h3>
<p>Personal pension contributions paid under relief at source, which can bring extra relief at the higher rates, and your student loan plan if you have one: repayments on self-employed income are collected through the return, and they are added to the bill rather than reducing it.</p>
<p>Finally, the practical items: your Unique Taxpayer Reference, your sign-in details, and your bank details for a possible repayment. First-time filers must have registered for Self Assessment first, by ${P.selfAssessment.registerBy} after the end of the tax year (${h.src('gov_register_se', 'GOV.UK, how to register')}).</p>
<h2>Which year, and which accounts</h2>
<p>The return for ${c.taxYear} covers the tax year that ended on ${h.date(c.yearEnd)}. GOV.UK points out that records kept to the same 6 April to 5 April dates make the return simpler. Since 2024/25 the cash basis is the default: income counts when the money arrives and costs when you pay them, so an invoice sent in March but paid in May belongs to the next year (${h.src('gov_cash_basis', 'GOV.UK, cash basis')}). If you opted out for traditional accounting, add what customers owed you at the year end and the bills you had received but not paid, plus stock and work in progress.</p>
<p>A business whose accounts end on another date has profit to allocate between tax years. If the final number is not ready by the deadline, GOV.UK allows provisional figures, flagged as such, with an amended return once the accounts are done.</p>
<h2>The filing itself, step by step</h2>
<ol>
<li>Sign in to HMRC online services with your sign-in details and UTR. You may be asked to prove your identity, usually with photo ID such as a passport or driving licence.</li>
<li>Work through the sections that apply to you: self-employment, employment, property and so on.</li>
<li>Fill in the self-employment page with turnover and expenses, or with the trading allowance in place of expenses.</li>
<li>Add the employment page from your P60, then any other income, reliefs and the student loan plan.</li>
<li>View the calculation before you submit and save a copy, since after filing it can take up to 72 hours to show.</li>
<li>Submit the return, then pay what the statement shows by ${P.paymentsOnAccount.dueFirst}.</li>
</ol>
<p>You do not have to finish in one sitting; the online return can be saved and picked up later. It can be filed any day after 5 April, and doing it early gives you the figure months before the payment is due.</p>
<h2>Reading the SA302 calculation</h2>
<p>The SA302 sets out your total income on which tax is due, the allowances and reliefs given against it, how HMRC worked out the tax, and the total you owe for the year. It deliberately ignores what you have already paid towards that year through payments on account or a budget plan, and any older debt. Those appear on the Self Assessment statement, which is the document that tells you what to pay (${h.src('gov_payments_on_account', 'GOV.UK, understand your Self Assessment bill')}). A copy can be printed from your online account, and GOV.UK explains how to get an official one, for example for a mortgage application.</p>
${h.box('In short', `<p>SA302: what the year costs. Statement: what you still owe after payments already made. Payments on account: the advance on next year, added to the statement, not to the SA302.</p>`, 'tip')}
<h2>When the result is a bill</h2>
<p>Take the example from the top of the page: an ${h.m(18000)} salary with ${h.m(paye)} of tax deducted through PAYE, and ${h.m(26000)} of profit from a weekend photography business. Tax on the combined income is ${h.m(pay.it.tax)}, Class 4 on the profit is ${h.m(pay.class4.total)}, so ${h.m(due)} remains to pay. Because less than ${h.pc(P.paymentsOnAccount.atSourceShare)} of the total was taken at source and the balance is over ${h.m(P.paymentsOnAccount.minBill)}, HMRC also sets payments on account of ${h.m(pay.poaEach)} each. In the first year, ${P.paymentsOnAccount.dueFirst} therefore brings the balance plus the first of those. For a sole trader with no job and ${h.m(38000)} of steady profit, the second year looks calmer: two payments on account of ${h.m(steady.poaEach)} cover a bill of ${h.m(steady.saBill)}, and nothing extra is due in January apart from the next instalment. The ${h.a('payments-on-account', 'payments on account page')} has the detail.</p>
<h2>When the result is a repayment</h2>
<p>A repayment appears when more was taken at source than the year’s liability, or when payments on account were set from a better year than this one. Picture someone with ${h.m(24000)} of wages and a small online shop that made ${h.m(500)}: the liability is ${h.m(ref.it.tax)} of Income Tax and ${h.m(ref.class4.total)} of Class 4, so if the P60 shows more than ${h.m(ref.it.tax)} deducted, the calculation ends with money owed back. HMRC pays it to the bank account on the return, unless a payment such as a payment on account falls due within the next 45 days, in which case it can be set against that instead.</p>
<h2>Paper returns and the cases online filing cannot handle</h2>
<p>The paper SA100 still exists, but it must arrive by ${h.date(c.paper)} for ${c.taxYear}, three months before the online date (${h.src('gov_sa_deadlines', 'GOV.UK, Self Assessment deadlines')}). HMRC’s own online service does not take partnership returns, trust or estate returns, returns for non-residents, or a few specialist cases such as Lloyd’s underwriters and ministers of religion; those go through commercial software or paper forms. An ordinary sole trader with no such complications can use HMRC’s online service.</p>
<h2>After filing</h2>
<p>Mistakes can be corrected within twelve months of the filing deadline, online after a 72-hour wait or on paper with each page marked as an amendment. The updated statement shows whether you owe more or are due money back, and any change to your payments on account. Keep the records behind the return for at least five years after the January deadline. Anyone already in Making Tax Digital still files a final return by the same January date, built on the quarterly updates sent during the year; the ${h.a('making-tax-digital', 'Making Tax Digital checker')} shows whether that applies to you. For a full estimate including student loans, use the ${h.a('self-assessment-tax-calculator', 'Self Assessment calculator')}.</p>`;
  },
});
