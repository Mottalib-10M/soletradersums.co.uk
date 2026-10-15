import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

const RATE = 400;
const DAYS = 220;
const MARGIN = 20;
const WEEKS = 46;

const umb = (h: Helpers, o: { rate?: number; margin?: number; levy?: boolean } = {}) =>
  h.E.ir35({ dayRate: o.rate ?? RATE, days: DAYS, region: 'ruk', umbrellaMarginWeekly: o.margin ?? MARGIN, weeks: WEEKS, levy: o.levy ?? true }).umbrella;

export default definePage({
  id: 'umbrella-company-calculator',
  group: 'contractors',
  order: 52,
  tool: { kind: 'mini:umbrella', props: { rate: RATE, days: DAYS, margin: MARGIN, weeks: WEEKS, levy: 1 } },
  related: ['ir35-calculator', 'ir35', 'limited-company-vs-sole-trader', 'employed-and-self-employed'],
  sources: ['gov_umbrella', 'gov_umbrella_2026', 'gov_employers_2627', 'gov_ir35'],
  slug: 'umbrella-company-calculator',
  nav: 'Umbrella take-home',
  card: 'From assignment rate to payslip: margin, employer NI, the levy, and the April 2026 PAYE rules.',
  title: 'Umbrella Company Calculator 2026/27: Rate to Take-Home',
  description: 'Umbrella company take-home for 2026/27: margin, employer NI and the levy taken from your rate, the Key Information Document and the PAYE rules from April 2026.',
  h1: 'Umbrella company calculator: from rate to take-home',
  intro: 'The rate an agency quotes for an umbrella role is not your salary: the employer’s costs come out of it first.',
  resume: (h) => {
    const u = umb(h);
    return `An umbrella worker on ${h.m(RATE)} a day for ${DAYS} days in ${h.P.taxYear} generates ${h.m(u.assignment)} of assignment income but takes home ${h.m(u.takeHome)}, ${h.pc(Math.round((u.takeHome / u.assignment) * 1000) / 1000)} of it, in England, Wales or Northern Ireland with no pension or student loan. Before any of your own tax, the umbrella keeps its margin (${h.m(u.margin)} at ${h.m(MARGIN)} a week for ${WEEKS} weeks) and pays its employer costs out of the rate: ${h.m(u.employerNI)} of employer National Insurance at ${h.pc(h.P.class1.employerRate)} and ${h.m(u.levy)} of Apprenticeship Levy. That leaves gross pay of ${h.m(u.gross)}, from which PAYE takes ${h.m(u.incomeTax)} of Income Tax and ${h.m(u.employeeNI)} of employee National Insurance. All of this is lawful, and the agency must set out the deductions in a Key Information Document before you start. Since 6 April 2026 the agency, or the end client if there is no agency, is also liable for any PAYE the umbrella fails to pay.`;
  },
  faqs: (h) => {
    const u = umb(h), z = umb(h, { margin: 0 }), n = umb(h, { levy: false });
    return [
      { q: 'Can an umbrella company take employer National Insurance out of my rate?', a: `Yes. GOV.UK lists employer National Insurance, the Apprenticeship Levy, employer pension contributions, holiday pay and the margin among the deductions made from the assignment rate before gross pay. On ${h.m(RATE)} a day the employer National Insurance alone is ${h.m(u.employerNI)} a year. What must never appear on the payslip is employer National Insurance deducted again from gross pay.` },
      { q: 'How much does a £20 a week umbrella margin cost me?', a: `${h.m(MARGIN * WEEKS)} a year over ${WEEKS} weeks, but less than that in lost take-home, because the margin comes out before tax: on ${h.m(RATE)} a day it lowers your take-home by ${h.m(z.takeHome - u.takeHome)}. Whether the levy is passed on matters too: without it you would keep ${h.m(n.takeHome - u.takeHome)} more.` },
      { q: 'What should a Key Information Document show?', a: `The agency must give it to you before an assignment starts. GOV.UK says it should name the umbrella company that will employ you, give the minimum assignment rate paid to it, list what the umbrella will deduct, and state your minimum gross pay. Compare those figures with the reconciliation statement and payslip once you are paid.` },
      { q: 'Who is liable if my umbrella company does not pay my PAYE?', a: `From 6 April 2026 HMRC can recover the unpaid PAYE from the agency that contracts with the end client, or from the end client when no agency is involved. The rule covers new and existing supply chains for money paid on or after that date. The umbrella remains your employer and must still pay you correctly.` },
    ];
  },
  body: (h) => {
    const u = umb(h);
    const rows = [
      ['Assignment income', h.m(u.assignment)],
      ['Umbrella margin', `−${h.m(u.margin)}`],
      ['Employer National Insurance', `−${h.m(u.employerNI)}`],
      ['Apprenticeship Levy', `−${h.m(u.levy)}`],
      ['Gross pay', h.m(u.gross)],
      ['Income Tax', `−${h.m(u.incomeTax)}`],
      ['Employee National Insurance', `−${h.m(u.employeeNI)}`],
      ['Take-home', h.m(u.takeHome)],
    ];
    const rates = [250, 350, 500, 650].map((d) => { const x = umb(h, { rate: d }); return [h.m(d), h.m(x.assignment), h.m(x.gross), h.m(x.takeHome), h.pc(Math.round((x.takeHome / x.assignment) * 1000) / 1000)]; });
    const C = h.P.class1;
    return `
<h2>The deductions, in order</h2>
${h.table(['Line', 'Year'], rows, `${h.m(RATE)} a day, ${DAYS} days, ${h.m(MARGIN)} a week margin over ${WEEKS} weeks, levy passed on, ${h.P.taxYear}, England, Wales or Northern Ireland.`, ['l', 'r'])}
<p>The first block belongs to the employer. The umbrella receives the assignment rate from the agency and pays its own costs from it, which is why employer National Insurance (${h.pc(C.employerRate)} above ${h.m(C.secondaryThreshold)} of gross pay) and the levy shrink the money before your salary is set. The second block is the employee’s: Income Tax and employee National Insurance at ${h.pc(C.employeeMain)} up to ${h.m(C.upperEarningsLimit)}, then ${h.pc(C.employeeUpper)}. A real pay statement may add holiday pay and pension lines, which this calculator leaves out.</p>
<h2>Four rates compared</h2>
${h.table(['Day rate', 'Assignment income', 'Gross pay', 'Take-home', 'Share kept'], rates, `${DAYS} days, same margin and levy.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The share kept falls as the rate rises, because higher gross pay moves into the ${h.pc(h.P.incomeTax.ruk.bands[1].rate)} band from ${h.m(h.T.higherFrom)}, while employer National Insurance keeps taking the same percentage at every level.</p>
<h2>The Apprenticeship Levy</h2>
<p>The levy is ${h.pc(C.apprenticeshipLevy)} of an employer’s pay bill, less an annual allowance of ${h.m(C.apprenticeshipLevyAllowance)}, so it only bites on large payrolls (${h.src('gov_employers_2627', 'HMRC rates for employers')}). An umbrella with a large enough pay bill owes it, and GOV.UK lists it among the deductions from the assignment rate, if applicable; the Key Information Document lists what will be deducted. Switch the levy option in the calculator to see the difference.</p>
<h2>The Key Information Document</h2>
<p>An agency that wants you to work through an umbrella, whether its preferred one or one you choose, must give you a Key Information Document before the assignment. It names the umbrella, the minimum assignment rate paid to it (also called the umbrella rate or uplifted rate), what it will deduct and your minimum gross pay (${h.src('gov_umbrella', 'GOV.UK, working through an umbrella company')}). Keep it: when the first reconciliation statement arrives, each deduction should match.</p>
<h2>PAYE rules from 6 April 2026</h2>
<p>New rules took effect for money paid on or after 6 April 2026. The agency that contracts with the end client, or the end client if there is no agency, must make sure the umbrella operates PAYE correctly, and HMRC can recover any shortfall from it. The rules cover existing supply chains as well as new ones. They do not apply when the worker is engaged through their own personal service company and certain conditions are met, which the ${h.a('ir35', 'IR35 guide')} covers, nor to managed service companies, salaried members of an LLP or workers already treated as employed by an agency (${h.src('gov_umbrella_2026', 'HMRC, PAYE rules for supply chains with umbrella companies')}).</p>
${h.box('Signs that something is wrong', `<p>GOV.UK points to a separate payment described as not taxable, such as a loan; being paid more than your payslip shows; money from anyone other than the umbrella; a second agreement on top of your contract; and an employer name or PAYE reference that keeps changing. Check that the tax and National Insurance on your payslips appear in your personal tax account.</p>`, 'warning')}
<p>Comparing an umbrella with a contract run through your own company, inside or outside IR35, is the job of the ${h.a('ir35-calculator', 'IR35 calculator')}.</p>`;
  },
});
