import { definePage } from '../../lib/guide-types';

const RATE = 450;
const DAYS = 220;
/** £10.2 million, from the parameter file. */
const mil = (n: number) => `£${Math.round(n / 100000) / 10} million`;

export default definePage({
  id: 'ir35',
  group: 'contractors',
  order: 50,
  mini: { kind: 'mini:ir35-quick', props: { rate: RATE, days: DAYS } },
  related: ['ir35-calculator', 'umbrella-company-calculator', 'limited-company-vs-sole-trader', 'limited-company-tax-calculator'],
  sources: ['gov_ir35', 'gov_ir35_esm10006a', 'leg_itepa_ch10', 'gov_employers_2627', 'gov_employment_allowance', 'gov_student_loan_repay', 'gov_cest'],
  slug: 'ir35',
  nav: 'IR35 explained',
  card: 'Who decides, the client size test and its new thresholds, the SDS, CEST and what a deemed employer deducts.',
  title: 'IR35 Off-Payroll Rules 2026/27: Who Decides and What Changes',
  description: 'IR35 in 2026/27: who decides your status, the client size test and its higher thresholds, the status determination statement, CEST and deductions inside IR35.',
  h1: 'IR35 explained: the off-payroll working rules in 2026/27',
  intro: 'A contractor’s company can be taxed almost like an employer when the contract, looked at closely, is really employment.',
  resume: (h) => {
    const I = h.P.ir35;
    const x = h.E.ir35({ dayRate: RATE, days: DAYS, region: 'ruk' });
    return `IR35, officially the off-payroll working rules, applies when a contractor works through their own limited company for a client who would have been their employer had the contract been made directly. A contractor on ${h.m(RATE)} a day for ${DAYS} days in ${h.P.taxYear} keeps ${h.m(x.inside.takeHome)} inside IR35, where the fee-payer deducts Income Tax and employee National Insurance, against ${h.m(x.outside.takeHome)} outside, drawn through the company as a salary and dividends, assuming the client pays the same fee and bears ${h.m(x.inside.employerNIOnTop)} of employer National Insurance itself. Who makes the call depends on the client. Public authorities and medium or large private clients decide and issue a status determination statement; for a small private client, the contractor’s own company decides. A private company counts as medium or large when it passes two of three tests: turnover over ${mil(I.turnoverOld)}, balance sheet over ${mil(I.balanceOld)}, more than ${I.employees} employees. For financial years starting on or after 6 April 2025 the first two rise to ${mil(I.turnoverNew)} and ${mil(I.balanceNew)}, which can first change a client’s status for the 2027/28 tax year.`;
  },
  faqs: (h) => {
    const I = h.P.ir35;
    const x = h.E.ir35({ dayRate: RATE, days: DAYS, region: 'ruk', plan: 'plan2' });
    return [
      { q: 'Who decides if my contract is inside IR35?', a: `The client, if it is a public authority or a medium or large business or charity in the private sector, using the size test of ${mil(I.turnoverOld)} turnover, ${mil(I.balanceOld)} of assets and ${I.employees} employees (two of three). It must give its conclusion and reasons in a status determination statement. If the client is small and in the private sector, your own company decides instead.` },
      { q: `When do the new ${mil(I.turnoverNew)} and ${mil(I.balanceNew)} IR35 thresholds apply?`, a: `They apply to a client’s financial years beginning on or after 6 April 2025. Because size is judged on the last year whose accounts filing period ended before the tax year starts, and a company must change size for two years in a row, HMRC says the earliest tax year affected is 2027/28. The ${I.employees}-employee test does not change.` },
      { q: 'Does IR35 apply if my client is a small company?', a: `Yes, but the decision moves to you. With a small client outside the public sector, your intermediary decides whether the contract would be employment, and must then consider the older Chapter 8 rules that apply to the contractor’s own company. A company with no more than ${mil(I.turnoverOld)} of turnover and ${mil(I.balanceOld)} of assets is small for now, whatever its staff count.` },
      { q: 'Are student loan repayments taken from fees inside IR35?', a: `No. The deemed employer deducts Income Tax and employee National Insurance only. Student and postgraduate loan repayments are paid through Self Assessment, so you must register and file a return. On ${h.m(RATE)} a day for ${DAYS} days, a Plan 2 loan adds ${h.m(x.inside.loan)} to the Self Assessment bill, at ${h.pc(h.P.studentLoans.rate)} above ${h.m(h.P.studentLoans.plan2)}.` },
      { q: 'Can my company claim the Employment Allowance on income inside IR35?', a: `No. GOV.UK lists earnings within the off-payroll working rules among those that cannot be included in a claim. And if you are the sole director and only paid employee, the company cannot claim at all, so employer National Insurance at ${h.pc(h.P.class1.employerRate)} applies in full to any salary above ${h.m(h.P.class1.secondaryThreshold)}.` },
      { q: 'What happens if a client never gives me a status determination statement?', a: `Until the client passes its determination and reasons to you and to the party it contracts with, the client itself remains responsible for deducting Income Tax and employee National Insurance and for paying employer National Insurance. It must also take reasonable care in reaching its decision, and keep records of each determination and its reasons.` },
    ];
  },
  body: (h) => {
    const I = h.P.ir35;
    const C1 = h.P.class1;
    const x = h.E.ir35({ dayRate: RATE, days: DAYS, region: 'ruk' });
    const low = h.E.ir35({ dayRate: 300, days: DAYS, region: 'ruk' });
    const size = [
      ['Turnover', `more than ${mil(I.turnoverOld)}`, `more than ${mil(I.turnoverNew)}`],
      ['Balance sheet total (gross assets)', `more than ${mil(I.balanceOld)}`, `more than ${mil(I.balanceNew)}`],
      ['Average number of employees', `more than ${I.employees}`, `more than ${I.employees}`],
    ];
    return `
<h2>What the rules are for</h2>
<p>A software tester, a project manager or an engineer who invoices through a personal service company normally pays Corporation Tax on the company’s profit and takes the rest as a salary and dividends. The off-payroll rules look past the company. If the working relationship would have been employment had the client hired the person directly, the fees are treated much like a salary and taxed through PAYE, so the contractor pays broadly what an employee would. The test runs contract by contract: one contractor can hold an inside engagement and an outside engagement at the same time, and a written, spoken or implied agreement all count as a contract. Both the terms and the way the work is actually done are weighed, which is why a contract signed as outside can move inside when the working practices change.</p>
<h2>Who decides, by type of client</h2>
<p>The person responsible for the decision depends on who receives the work. Every public authority decides for its contractors: government departments, councils, schools and universities, NHS bodies. In the private and voluntary sectors, a medium or large client decides. A small private client does not: the contractor’s own intermediary decides whether the rules apply, and must consider the older provisions in Chapter 8 of Part 2 of the Income Tax (Earnings and Pensions) Act 2003 that then fall on the contractor’s own company. A client based wholly overseas, with no UK residence and no permanent establishment in the UK, is also outside the client-led regime, and the intermediary decides. Agencies in the chain have duties whatever their size, particularly when an agency is the deemed employer (${h.src('gov_ir35', 'HMRC, understanding off-payroll working')}).</p>
<h2>The client size test and the 2025 thresholds</h2>
<p>A private company, limited liability partnership or overseas company is medium or large when it meets at least two of three conditions, for two consecutive financial years. The thresholds come from the small companies regime of the Companies Act 2006, and two of them went up for financial years beginning on or after 6 April 2025.</p>
${h.table(['Condition', 'Financial years before 6 April 2025', 'Financial years from 6 April 2025'], size, 'Two conditions out of three, met in two consecutive financial years. HMRC Employment Status Manual ESM10006 and ESM10006A.', ['l', 'r', 'r'])}
<p>The year that counts is the last financial year whose period for filing accounts ended before the tax year began. That lag is why the higher thresholds cannot bite straight away. For a company with a normal twelve-month year, the earliest filing date for a year starting on or after 6 April 2025 falls in January 2027, so the first tax year the change can affect is 2027/28. A transitional rule lets a client re-test the previous year with the new thresholds, so a company that is small under them for two years in a row can leave the client-led regime from 6 April 2027 (${h.src('gov_ir35_esm10006a', 'ESM10006A')}). HMRC’s own example is a company with a 30 June year end: medium under the old figures for the year to June 2025, small under the new ones for the year to June 2026, and treated as small for both, so its contractors decide their own status from 2027/28.</p>
<p>Three refinements matter in practice. A newly incorporated company is small in its first financial year. When the parent of a group is medium or large, its subsidiaries apply the rules too, using group figures. And a client that is not a company, such as a partnership or a sole trader, looks at turnover alone, more than ${mil(I.turnoverOld)}, in a single year.</p>
<h2>The status determination statement</h2>
<p>A client that has to decide gives its answer in a status determination statement, or SDS. The statement must reach both the contractor and the party the client contracts with, usually the agency, and it must set out the conclusion and the reasons behind it. The client has to take reasonable care. If it gives no reasons, or skips the statement, it stays responsible for the Income Tax and National Insurance itself. A contractor who disagrees can raise it with the client up to the last payment for the work; the client must have a process to consider the representations and must reply, either confirming the decision with reasons or issuing a new one, within a fixed time limit set by the rules.</p>
<h2>CEST and the questions behind it</h2>
<p>HMRC’s check employment status for tax service, CEST, gives HMRC’s view of a worker’s status from the answers typed in. Anyone can use it, whether hirer, agency or contractor, and it is anonymous. HMRC says it will stand by the result as long as the information given is accurate and in line with its guidance, and the result can be saved and used as a valid status determination statement. Before starting you need the details of the contract, the worker’s responsibilities, who decides what work is done, who decides when, where and how it is done, how the worker is paid, and whether any corporate benefits or expenses are included. A tester embedded in the client’s team, told what to work on each morning and paid by the day, gives very different answers from a firm hired to deliver a defined piece of work in its own way. Using the tool is optional; the duty is to take reasonable care.</p>
<h2>What happens to the fee inside IR35</h2>
<p>Once a contract is inside, the deemed employer (always the client when it contracts directly with the contractor’s company; in an agency chain, an agency, depending on the conditions the parties meet) deducts Income Tax and employee National Insurance from the fee, then pays employer National Insurance and, where it is due, the Apprenticeship Levy out of its own pocket. On ${h.m(RATE)} a day for ${DAYS} days that means ${h.m(x.inside.incomeTax)} of Income Tax and ${h.m(x.inside.employeeNI)} of employee National Insurance taken from ${h.m(x.fee)}, with ${h.m(x.inside.employerNIOnTop)} of employer National Insurance paid on top by the deemed employer.</p>
<p>Two details follow from the guidance. Student and postgraduate loan repayments are not deducted by the deemed employer, so the contractor must register for Self Assessment and pay them there. And the company cannot include those earnings in an Employment Allowance claim (${h.src('gov_employment_allowance', 'GOV.UK, Employment Allowance eligibility')}).</p>
${h.box('Inside or outside, on the same fee', `<p>At ${h.m(RATE)} a day the engine finds ${h.m(x.inside.takeHome)} inside and ${h.m(x.outside.takeHome)} outside; at ${h.m(300)} a day, ${h.m(low.inside.takeHome)} inside and ${h.m(low.outside.takeHome)} outside. With the ${h.P.taxYear} dividend rates and no Employment Allowance for a sole director, the outside route no longer pulls clearly ahead on the same fee. Rates are often negotiated differently for inside roles, since the deemed employer bears employer National Insurance at ${h.pc(C1.employerRate)}; the ${h.a('ir35-calculator', 'IR35 calculator')} lets you set each rate separately.</p>`, 'example')}
<h2>Umbrella companies and IR35</h2>
<p>A contractor employed by an umbrella company is an employee of that umbrella, paid through its PAYE scheme, so the off-payroll rules are unlikely to apply to that engagement. Many inside roles are filled this way: the agency or client asks the contractor to join an umbrella rather than invoice through a personal company. The cost is different, because the umbrella takes its margin and its own employer National Insurance out of the assignment rate before working out gross pay; the ${h.a('umbrella-company-calculator', 'umbrella take-home calculator')} shows each deduction. HMRC also warns against schemes that claim to get round the rules, such as payments described as loans; the tax remains due.</p>
<p>Whether a particular contract is inside or outside is a judgement on its own facts. This page explains who makes it and on what grounds; it is not a determination for any contract.</p>`;
  },
});
