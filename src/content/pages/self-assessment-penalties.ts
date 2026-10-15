import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'self-assessment-penalties',
  group: 'admin',
  order: 13,
  tool: { kind: 'mini:sa-penalty', props: { tax: 3000, filing: 120, pay: 120 } },
  related: ['self-assessment-deadlines', 'mtd-penalties', 'payments-on-account', 'making-tax-digital'],
  sources: ['gov_sa_penalties', 'gov_sa_deadlines', 'gov_mtd_penalties', 'gov_hmrc_interest', 'gov_mtd_when'],
  slug: 'self-assessment-penalties',
  nav: 'Late filing penalties',
  card: 'The £100 fine, daily charges, 5 % steps and interest, and when the MTD points system takes over.',
  title: 'Self Assessment Penalties 2026/27: UK Late Return and Tax',
  description: 'Self Assessment penalties for a late return or tax: £100, £10 a day, 5 % or £300 at 6 and 12 months, 5 % payment steps, interest and the switch to MTD rules.',
  h1: 'Self Assessment late filing and late payment penalties',
  intro: 'Two separate clocks run from 31 January: one for the return, one for the money, and each has its own charges.',
  resume: (h) => {
    const S = h.P.selfAssessment.penalties;
    const r = h.E.saPenalties(3000, 120, 120);
    return `A return filed 120 days late on a bill of ${h.m(3000)}, paid on the same day, costs ${h.m(r.total)} in penalties under the current Self Assessment rules: ${h.m(r.initial)} straight away, ${h.m(r.daily)} of daily penalties and ${h.m(r.payment)} for paying late, with interest on top. The filing side starts with a fixed ${h.m(S.initial)} the day after the deadline, whatever you owe. After ${S.dailyFromMonth} months HMRC adds ${h.m(S.daily)} a day, capped at ${h.m(S.dailyMax)}. At six months comes ${h.pc(S.sixMonthRate)} of the tax due or ${h.m(S.sixMonthMin)}, whichever is greater, and the same again at twelve months. The payment side charges ${h.pc(S.latePaymentRate)} of the unpaid tax at 30 days, six months and twelve months. These rules stop applying to you from the tax year you join Making Tax Digital. Enter your own delays below.`;
  },
  faqs: (h) => {
    const S = h.P.selfAssessment.penalties;
    const zero = h.E.saPenalties(0, 200, 0);
    const late = h.E.saPenalties(800, 10, 10);
    return [
      { q: 'Do I get a late filing penalty if I owe no tax?', a: `Yes. The first ${h.m(S.initial)} is charged for a late return whatever the bill. The daily penalties do not depend on the tax either, and the six-month charge has a floor of ${h.m(S.sixMonthMin)}. A return with nothing to pay that arrives 200 days late therefore costs ${h.m(zero.total)}. Late payment penalties, by contrast, are a share of unpaid tax, so they are nil.` },
      { q: 'How much is the fine if my tax return is ten days late?', a: `${h.m(late.filing)} for the return, and no late payment penalty yet if the money also goes in within 30 days: on a bill of ${h.m(800)} paid ten days late the total is ${h.m(late.total)}. Interest runs on the unpaid ${h.m(800)} from the due date. The daily charges only begin after ${S.dailyFromMonth} months.` },
      { q: 'Can I appeal a self assessment penalty?', a: `Yes, if you had a reasonable excuse for missing the deadline. The penalty notice explains the route. A penalty you do not appeal must be paid within 30 days of the date on the notice. A ${h.m(S.initial)} filing penalty does not go away just because the return is sent afterwards, so sending it quickly limits the damage rather than undoing it.` },
      { q: 'Do the old £100 late filing penalties still apply after I join MTD?', a: `Not to the tax years you are in Making Tax Digital. From that year a late return earns a penalty point, and a fixed ${h.m(h.P.mtd.penalties.submissionPenalty)} only once you hold ${h.P.mtd.penalties.pointThreshold} points. Earlier years keep the old rules: in MTD from ${h.date(h.P.mtd.stages[0].start)}, your ${h.E.saCalendar(2025).taxYear} return due ${h.date(h.E.saCalendar(2025).online)} is still covered by the ${h.m(S.initial)} regime.` },
    ];
  },
  body: (h) => {
    const P = h.P, S = P.selfAssessment.penalties, M = P.mtd.penalties;
    const tax = 2000;
    const delays: Array<[number, string]> = [[1, '1 day'], [45, '45 days'], [100, '100 days'], [200, '200 days'], [400, '400 days']];
    const rows = delays.map(([d, label]) => { const r = h.E.saPenalties(tax, d, d); return [label, h.m(r.filing), h.m(r.payment), h.m(r.total)]; });
    const big = h.E.saPenalties(15000, 200, 200);
    const old = h.E.saPenalties(3000, 0, 45), neu = h.E.mtdLatePayment(3000, 45, '2026/27', false), n20 = h.E.mtdLatePayment(3000, 20, '2026/27', false), n20First = h.E.mtdLatePayment(3000, 20, '2026/27', true);
    const c25 = h.E.saCalendar(2025), c27 = h.E.saCalendar(2027);
    return `
<h2>How the charges build up over a year</h2>
<p>The table follows one sole trader, a hairdresser with ${h.m(tax)} of tax to pay, who files the return and pays the bill on the same day, later and later after ${P.paymentsOnAccount.dueFirst}. Interest is left out because it depends on the base rate at the time.</p>
${h.table(['Return and payment late by', 'Filing penalties', 'Payment penalties', 'Total'], rows, `Tax due ${h.m(tax)}, current Self Assessment rules (outside Making Tax Digital).`, ['l', 'r', 'r', 'r'])}
<p>Two things stand out. The fixed charges dominate at this size of bill: the ${h.m(S.initial)}, the ${h.m(S.dailyMax)} of daily penalties and the minimum ${h.m(S.sixMonthMin)} amounts are the same for a bill of ${h.m(tax)} as for no bill at all. And the percentage charges overtake them once the tax is larger. With ${h.m(15000)} to pay and both the return and the money 200 days late, the total reaches ${h.m(big.total)}, because ${h.pc(S.sixMonthRate)} of ${h.m(15000)} is more than the ${h.m(S.sixMonthMin)} floor.</p>
<h2>The filing clock</h2>
<p>It starts the day after the deadline for the type of return you send: ${h.date(c25.paper)} for paper and ${h.date(c25.online)} online for the ${c25.taxYear} year. The ${h.m(S.initial)} is automatic. After ${S.dailyFromMonth} months the daily charge of ${h.m(S.daily)} applies for up to 90 days, which is where the ${h.m(S.dailyMax)} ceiling comes from. At six months HMRC adds the greater of ${h.m(S.sixMonthMin)} and ${h.pc(S.sixMonthRate)} of the tax due, and at twelve months it does the same again (${h.src('gov_sa_penalties', 'GOV.UK, Self Assessment penalties')}). In a partnership, a late partnership return means a penalty for each partner.</p>
<h2>The payment clock</h2>
<p>Unpaid tax is charged ${h.pc(S.latePaymentRate)} at 30 days, again at six months and again at twelve months, each time on the amount still unpaid. Separately, late payment interest runs from the first day at the Bank of England base rate plus ${h.pc(P.interest.latePaymentMarginOverBase)} (${h.src('gov_hmrc_interest', 'HMRC interest rates')}). Because the base rate moves, the rate on your debt can change while it is outstanding.</p>
${h.box('Registering late is a third risk', `<p>If you told HMRC after ${P.selfAssessment.registerBy} that you needed a return and did not pay the whole bill by ${P.paymentsOnAccount.dueFirst}, a failure to notify penalty may follow, based on the amount still unpaid. HMRC issues it within 12 months of receiving the return.</p>`, 'warning')}
<h2>When Making Tax Digital takes over</h2>
<p>From the tax year you join Making Tax Digital for Income Tax, a points system replaces the ${h.m(S.initial)} and daily penalties, and a new late payment penalty replaces the ${h.pc(S.latePaymentRate)} steps. Interest is unchanged. The switch is by tax year: a sole trader brought in on ${h.date(P.mtd.stages[0].start)} is still under the old rules for the ${c25.taxYear} return due ${h.date(c25.online)}. HMRC’s guidance also states that from April 2027 the new penalties will apply to everyone who sends a personal Self Assessment return, so the regime on this page is in its last years (${h.src('gov_mtd_penalties', 'HMRC, MTD penalties')}).</p>
<p>The two systems weigh differently. On ${h.m(3000)} paid 45 days late, the current rules charge ${h.m(old.payment)}. Under Making Tax Digital the same delay in ${P.taxYear} costs ${h.m(neu.total)}: ${h.pc(M.y2627.day15)} at day 15, ${h.pc(M.y2627.day30)} at day 30, then a yearly ${h.pc(M.annualRate)} charged daily. Shorter delays are where the new system bites harder, except in the first year. Paid 20 days late, the bill attracts nothing under the old rules, ${h.m(n20.total)} under the new ones in a normal year, and ${h.m(n20First.total)} in your first year, when the grace period is ${M.firstYearGraceDays} days rather than ${M.graceDays}. For ${c27.taxYear} the two fixed steps rise to ${h.pc(M.y2728.day15)} each. Late returns earn a point each, and a ${h.m(M.submissionPenalty)} penalty arrives only at ${M.pointThreshold} points. The ${h.a('mtd-penalties', 'MTD penalties page')} has a calculator for the new regime, and the ${h.a('making-tax-digital', 'MTD checker')} tells you which year you join.</p>`;
  },
});
