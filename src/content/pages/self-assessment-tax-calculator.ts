import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'self-assessment-tax-calculator',
  group: 'tax',
  order: 3,
  tool: { kind: 'se', props: { turnover: 16000, expenses: 2000, wages: 26000 } },
  related: ['self-assessment-tax-return', 'employed-and-self-employed', 'payments-on-account', 'dividend-tax-calculator'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_dividends', 'gov_sa_deadlines', 'gov_payments_on_account'],
  slug: 'self-assessment-tax-calculator',
  nav: 'Self Assessment calculator',
  card: 'The whole Self Assessment bill: profit, wages already taxed, dividends, Class 4 and the January total.',
  title: 'Self Assessment Tax Calculator 2026/27: Wages and Profit',
  description: 'Self Assessment tax calculator for 2026/27: adds profit to wages and dividends, takes off PAYE already paid, then Class 4, loans and payments on account.',
  h1: 'Self Assessment tax calculator',
  intro: 'HMRC’s own calculation stacks every kind of income in a fixed order, then subtracts what was taxed at source; this tool follows the same order.',
  resume: (h) => {
    const P = h.P;
    const r = h.E.selfEmployed({ profit: 14000, employment: 26000, region: 'ruk' });
    const cal = h.E.saCalendar(P.year);
    return `With ${h.m(26000)} of wages and ${h.m(14000)} of self-employed profit in ${P.taxYear}, the Self Assessment bill in England, Wales or Northern Ireland is ${h.m(r.saBill)}: ${h.m(r.itViaSA)} of Income Tax not already taken through PAYE and ${h.m(r.class4.total)} of Class 4. The total Income Tax on all ${h.m(40000)} of income is ${h.m(r.it.tax)}, but the employer has already deducted about ${h.m(r.itOnEmployment)}, so only the difference goes on the return. HMRC builds the figure in a set order: non-savings income such as wages and profit first, then savings, then dividends on top; the Personal Allowance of ${h.m(h.T.pa)} is used once, against the first income in that order. Class 4 is charged on the profit alone, so wages never raise it. Student loan repayments are added on income above your plan threshold. Because this bill passes ${h.m(P.paymentsOnAccount.minBill)}, a first payment on account of ${h.m(r.poaEach)} is added on ${h.date(cal.online)}.`;
  },
  faqs: (h) => {
    const P = h.P;
    const d = h.E.selfEmployed({ profit: 30000, dividends: 6000, region: 'ruk' });
    const n = h.E.selfEmployed({ profit: 30000, region: 'ruk' });
    const b = h.E.selfEmployed({ profit: 16000, employment: 30000, region: 'ruk' });
    return [
      { q: 'How is tax on dividends added to a Self Assessment bill?', a: `Dividends are stacked on top of profit and wages and taxed after a ${h.m(P.dividends.allowance)} allowance, at ${h.pc(P.dividends.basic)} within the basic band. A sole trader with ${h.m(30000)} of profit and ${h.m(6000)} of dividends owes ${h.m(d.saBill)} through Self Assessment, ${h.m(d.saBill - n.saBill)} more than on the profit alone.` },
      { q: 'Why does my Self Assessment calculation show tax I already paid at work?', a: `Because HMRC computes Income Tax on your whole income, then deducts the PAYE shown on your P60. With ${h.m(30000)} of salary and ${h.m(16000)} of profit, tax on everything is ${h.m(b.it.tax)}; PAYE covered about ${h.m(b.itOnEmployment)}, so ${h.m(b.itViaSA)} of Income Tax remains, plus ${h.m(b.class4.total)} of Class 4 on the profit.` },
      { q: 'Can I pay my Self Assessment bill through my tax code?', a: `Yes, if you are employed and file online by ${h.date(h.E.saCalendar(P.year).codingOut)} for the ${P.taxYear} return. HMRC then collects the balance through your salary in the following tax year instead of on ${h.date(h.E.saCalendar(P.year).online)}. Miss that date and the whole balance is paid the usual way, by the January deadline, with any payments on account on their normal dates.` },
      { q: 'Does a Self Assessment estimate include student loan repayments?', a: `This one does, if you choose a plan. HMRC charges ${h.pc(P.studentLoans.rate)} of total income above the plan threshold, ${h.m(P.studentLoans.plan2)} for Plan 2, and deducts what your employer already took. The repayment goes on the January bill in full; it is never part of the payments on account.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const r = h.E.selfEmployed({ profit: 14000, employment: 26000, region: 'ruk' });
    const lines = [
      ['Wages (P60)', h.m(26000)],
      ['Self-employed profit', h.m(14000)],
      ['Total income', h.m(r.it.totalIncome)],
      ['Personal Allowance', `−${h.m(r.it.personalAllowance)}`],
      ['Income Tax on all income', h.m(r.it.tax)],
      ['Less tax deducted through PAYE', `−${h.m(r.itOnEmployment)}`],
      ['Class 4 on the profit', h.m(r.class4.total)],
      ['Balance for the year', h.m(r.saBill)],
      ['First payment on account', h.m(r.poaEach)],
      [`Due on ${P.paymentsOnAccount.dueFirst}`, h.m(r.saBill + r.poaEach)],
    ];
    const cal = h.E.saCalendar(P.year);
    const hi = h.E.selfEmployed({ profit: 20000, employment: 45000, region: 'ruk' });
    return `
<h2>The calculation, line by line</h2>
<p>When you submit a return, HMRC produces a tax calculation, often called an SA302 because of the old form number. It reads like the table below, which reproduces the default case of the calculator: a part-time employee earning ${h.m(26000)} who also runs a small business with ${h.m(16000)} of takings and ${h.m(2000)} of costs.</p>
${h.table(['Line', 'Amount'], lines, `England, Wales or Northern Ireland, ${P.taxYear}, standard tax code, no student loan.`, ['l', 'r'])}
<p>The PAYE figure here is an estimate of what a standard tax code takes from ${h.m(26000)} over a full year. On your real return you copy the tax shown on your P60 instead, and any difference flows straight into the balance. If your employer used an emergency code, or you changed jobs mid-year, the real figure can be noticeably higher or lower.</p>

<h2>The order HMRC applies</h2>
<p>Income Tax rules sort income into layers. Non-savings income, which covers wages, trading profit, pensions and rent, sits at the bottom. Savings interest comes next and dividends go on top. The Personal Allowance is used against the lowest layer first, and each layer fills the bands from where the previous one stopped (${h.src('gov_income_tax_rates', 'GOV.UK, Income Tax rates')}). This is why a dividend can be taxed at the upper dividend rate even when the salary alone was comfortably basic rate: by the time dividends are counted, the basic band may already be full.</p>
<p>Dividends have their own rates, ${h.pc(P.dividends.basic)}, ${h.pc(P.dividends.higher)} and ${h.pc(P.dividends.additional)}, and a ${h.m(P.dividends.allowance)} allowance that is taxed at nothing but still takes up band space (${h.src('gov_dividends', 'GOV.UK, tax on dividends')}). A sole trader with shares in a former employer, or someone who also owns part of a small company, should put those dividends in the calculator, because they change the band that the profit pushes into.</p>

<h2>What is not on the bill</h2>
<p>Employee National Insurance on wages is settled through payroll and never appears on the return. Class 2 is no longer charged; with profit of ${h.m(h.T.spt)} or more it is treated as paid. Class 4 is charged on profit alone, at ${h.pc(P.class4.mainRate)} above ${h.m(h.T.lpl)} and ${h.pc(P.class4.upperRate)} above ${h.m(h.T.upl)} (${h.src('gov_se_nic', 'GOV.UK, self-employed National Insurance')}), so an employee earning ${h.m(45000)} with ${h.m(20000)} of side profit still pays the full ${h.pc(P.class4.mainRate)} on the profit: ${h.m(hi.class4.total)} here, while the Income Tax due through the return is ${h.m(hi.itViaSA)}, most of it at the higher rate.</p>

<h2>From the calculation to the payment</h2>
<p>The balance and the first payment on account are both due on ${h.date(cal.online)} for ${P.taxYear}, and the second payment on account on ${h.date(cal.secondPoa)} (${h.src('gov_payments_on_account', 'GOV.UK, payments on account')}). No payments on account are set when the bill is under ${h.m(P.paymentsOnAccount.minBill)}, or when more than ${h.pc(P.paymentsOnAccount.atSourceShare)} of your tax was already deducted at source, which is common for employees with a modest side income. The return itself must be filed online by the same January date, or on paper by ${h.date(cal.paper)} (${h.src('gov_sa_deadlines', 'GOV.UK, deadlines')}).</p>
${h.box('When the result is a refund', `<p>If PAYE took more than the tax due on all your income, for example because a tax code over-collected or the business made no profit, the calculation ends in a repayment. Enter the profit as nil in the calculator to see the tax on wages alone; the ${h.a('self-assessment-tax-return', 'tax return guide')} covers claiming the money back.</p>`, 'tip')}
<p>For the practical side of running a business next to a job (registration, the tax code and the trading allowance), see the ${h.a('employed-and-self-employed', 'job plus self-employment page')}.</p>`;
  },
});
