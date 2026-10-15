import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'student-loan-self-employed',
  group: 'tax',
  order: 8,
  tool: { kind: 'mini:sl' },
  related: ['how-much-tax-to-save-self-employed', 'payments-on-account', 'employed-and-self-employed', 'self-employed-tax-scotland'],
  sources: ['gov_student_loan_repay', 'gov_payments_on_account', 'gov_sa_deadlines', 'gov_sl_plan'],
  slug: 'student-loan-self-employed',
  nav: 'Student loans',
  card: 'Student loan repayments through Self Assessment: thresholds by plan, combined income and the January bill.',
  title: 'Student Loan Repayments When Self-Employed: 2026/27 Plans',
  description: 'Student loan repayments for the self-employed in 2026/27: thresholds for Plans 1, 2, 4, 5 and postgraduate, combined income with a job, and the January bill.',
  h1: 'Student loan repayments when self-employed',
  intro: 'No payroll means no monthly deduction: HMRC works out the whole year’s repayment from your tax return and adds it to the January bill.',
  resume: (h) => {
    const P = h.P;
    const S = P.studentLoans;
    const r = h.E.studentLoan(40000, 'plan2');
    return `A self-employed graduate on Plan 2 with ${h.m(40000)} of profit in ${P.taxYear} repays ${h.m(r.total)}: ${h.pc(S.rate)} of the income above the ${h.m(S.plan2)} threshold. HMRC calculates the amount from the Self Assessment return on the income of the whole year and adds it to the bill due on ${P.paymentsOnAccount.dueFirst}. The yearly thresholds for ${P.taxYear} are ${h.m(S.plan1)} for Plan 1, ${h.m(S.plan2)} for Plan 2, ${h.m(S.plan4)} for Plan 4 and ${h.m(S.plan5)} for Plan 5, all at ${h.pc(S.rate)}, and ${h.m(S.postgrad)} for a Postgraduate Loan at ${h.pc(S.postgradRate)}. If you also have a job, the test uses combined income, and what your employer already deducted comes off. The repayment is never part of payments on account, so it has to be found in full each January on top of any advance. The balance you owe has no effect on the yearly amount, which depends only on income.`;
  },
  faqs: (h) => {
    const P = h.P;
    const S = P.studentLoans;
    const g = h.E.studentLoan(42000, 'plan1');
    const pg = h.E.studentLoan(35000, 'plan2', true);
    return [
      { q: 'Do self-employed people repay student loans on profit or turnover?', a: `On income, which for a sole trader means taxable profit, not turnover. A Plan 1 borrower with ${h.m(32000)} of profit and a ${h.m(10000)} job has combined income of ${h.m(42000)}, so repays ${h.pc(S.rate)} above ${h.m(S.plan1)}: ${h.m(g.total)} for ${P.taxYear}. Wage deductions already made by the employer are subtracted.` },
      { q: 'How much do I repay with a Postgraduate Loan and Plan 2?', a: `Both, at different rates. On ${h.m(35000)} of profit in ${P.taxYear}, the Postgraduate Loan takes ${h.pc(S.postgradRate)} above ${h.m(S.postgrad)}, ${h.m(pg.postgrad)}, and Plan 2 takes ${h.pc(S.rate)} above ${h.m(S.plan2)}, ${h.m(pg.plan)}. The total of ${h.m(pg.total)} is added to the Self Assessment bill in one sum.` },
      { q: 'Do I repay my student loan in a year when my profit is low?', a: `Not if your income for the whole year stays at or under your plan threshold, ${h.m(S.plan2)} on Plan 2 for ${P.taxYear}. Self Assessment looks at the year as a whole, so a strong month does not trigger anything on its own. Interest is still added to the balance in a year with no repayment.` },
      { q: 'I have Plan 1 and Plan 2 loans, how is the repayment split?', a: `You repay ${h.pc(S.rate)} of income above the lower of the two thresholds, ${h.m(S.plan1)}, as a single amount. GOV.UK caps what goes to the lower-threshold loan by the gap between the thresholds and sends the rest to the other loan. The calculator above uses one plan; pick Plan 1 to see the total.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const S = P.studentLoans;
    const plans: Array<[string, 'plan1' | 'plan2' | 'plan4' | 'plan5', number]> = [['Plan 1', 'plan1', S.plan1], ['Plan 2', 'plan2', S.plan2], ['Plan 4', 'plan4', S.plan4], ['Plan 5', 'plan5', S.plan5]];
    const rows = plans.map(([n, k, t]) => [n, h.m(t), h.pc(S.rate), h.m(h.E.studentLoan(30000, k).total), h.m(h.E.studentLoan(45000, k).total)]);
    rows.push(['Postgraduate Loan', h.m(S.postgrad), h.pc(S.postgradRate), h.m(h.E.studentLoan(30000, 'none', true).total), h.m(h.E.studentLoan(45000, 'none', true).total)]);
    const a = h.E.selfEmployed({ profit: 40000, region: 'ruk' });
    const b = h.E.selfEmployed({ profit: 40000, region: 'ruk', plan: 'plan2' });
    return `
<h2>Thresholds and rates for ${P.taxYear}</h2>
<p>The figures below are the yearly thresholds HMRC applies through Self Assessment (${h.src('gov_student_loan_repay', 'GOV.UK, how much you repay')}). Employees see monthly and weekly versions of them on their payslips; a sole trader only ever meets the annual one.</p>
${h.table(['Plan', 'Yearly threshold', 'Rate', `On ${h.m(30000)}`, `On ${h.m(45000)}`], rows, `Repayment for the year, ${P.taxYear}, income from all sources.`, ['l', 'r', 'r', 'r', 'r'])}
<p>You cannot pick your plan; it follows where and when you applied. GOV.UK puts every borrower who applied to the Student Awards Agency Scotland on Plan 4 and every borrower from Student Finance Northern Ireland on Plan 1. English and Welsh borrowers can be on Plan 1, 2 or 5 depending on when their course started, with Plan 5 the newest. Your online student loan account shows which applies.</p>

<h2>One yearly sum, not monthly deductions</h2>
<p>For an employee the loan comes out of each pay packet. For the self-employed there is no payroll, so HMRC waits for the return, measures income for the whole year and charges the repayment in one go. GOV.UK says it plainly: repayments are based on your income for the whole year when you file Self Assessment. A seasonal trader, such as a wedding photographer with a busy summer and a dead winter, is therefore treated exactly like someone with a steady income of the same total.</p>
<p>Income here means taxable profit for a sole trader, plus wages and other income on the return. If you also work for an employer, combined income sets the repayment and whatever the employer deducted during the year is taken off. That can mean a repayment through Self Assessment even when neither the job nor the business crossed the threshold alone.</p>

<h2>Why January is bigger than you expect</h2>
<p>Payments on account cover Income Tax and Class 4 only (${h.src('gov_payments_on_account', 'GOV.UK, payments on account')}). The loan sits outside them, so each January you pay the full year’s repayment with the balance, however steady your income. On ${h.m(40000)} of profit in England, the Self Assessment bill goes from ${h.m(a.saBill)} without a loan to ${h.m(b.saBill)} with Plan 2, while the payment on account stays at ${h.m(b.poaEach)} either way. The ${h.a('how-much-tax-to-save-self-employed', 'tax to put aside calculator')} includes the loan when you choose a plan, which is the simplest way to stop it catching you out.</p>
${h.box('Interest keeps running', `<p>Interest is added to the balance even in years when your income is under the threshold and nothing is repaid. The yearly repayment, by contrast, does not depend on how much you owe: two people on the same plan and the same profit repay the same amount whatever their balances.</p>`, 'info')}

<h2>More than one loan</h2>
<p>With two undergraduate plans, for example Plan 1 and Plan 2, you repay ${h.pc(S.rate)} of income above the lower threshold, as one amount; GOV.UK then splits it between the loans. A Postgraduate Loan is separate: ${h.pc(S.postgradRate)} above ${h.m(S.postgrad)}, charged in addition to any other plan. A freelance researcher with a Plan 2 loan and a master’s loan pays both from the same January bill, which can add noticeably to what is due by ${h.date(h.E.saCalendar(P.year).online)} (${h.src('gov_sa_deadlines', 'GOV.UK, Self Assessment deadlines')}).</p>`;
  },
});
