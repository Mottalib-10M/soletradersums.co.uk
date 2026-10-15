import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'mtd-penalties',
  group: 'mtd',
  order: 32,
  tool: { kind: 'mini:mtd-penalty', props: { tax: 5000, days: 45, year: 0, first: 1 } },
  related: ['making-tax-digital', 'mtd-quarterly-deadlines', 'self-assessment-penalties', 'payments-on-account'],
  sources: ['gov_mtd_penalties', 'gov_mtd_quarterly', 'gov_sa_penalties', 'gov_hmrc_interest'],
  slug: 'mtd-penalties',
  nav: 'MTD penalties',
  card: 'Late submission points, the fixed penalty at the threshold and the sliding late payment charge.',
  title: 'MTD Penalties for Income Tax: Points and Late Payment Rules',
  description: 'Penalties under Making Tax Digital for Income Tax: late submission points, the fixed charge at the threshold, late payment percentages and the first-year grace.',
  h1: 'Making Tax Digital penalties: points and late payment',
  intro: 'Late filing now costs points before it costs money; late payment costs more the longer it runs.',
  resume: (h) => {
    const M = h.P.mtd.penalties;
    const r = h.E.mtdLatePayment(5000, 45, '2026/27', true);
    return `A sole trader in Making Tax Digital who pays a ${h.m(5000)} ${h.P.taxYear} balancing payment 45 days late owes a late payment penalty of ${h.m(r.total)}: ${h.pc(M.y2627.day15)} at day ${M.graceDays}, ${h.pc(M.y2627.day30)} at day ${M.firstYearGraceDays} and a yearly ${h.pc(M.annualRate)} charged day by day from day ${M.firstYearGraceDays + 1}, with late payment interest on top. In the first MTD year nothing is charged if the tax is paid, or a payment plan agreed, within ${M.firstYearGraceDays} days; after that the grace shrinks to ${M.graceDays} days. For 2027/28 payments the two steps rise to ${h.pc(M.y2728.day15)} each. Late returns and, from the year after ${M.noQuarterlyPointsYear}, late quarterly updates earn one point per missed deadline; at ${M.pointThreshold} points a ${h.m(M.submissionPenalty)} penalty follows, and another for each further miss. Payments on account sit outside the late payment penalty. Enter the amount, the delay and the year to see the charge.`;
  },
  faqs: (h) => {
    const M = h.P.mtd.penalties;
    const a = h.E.mtdLatePayment(5000, 20, '2026/27', true), b = h.E.mtdLatePayment(5000, 20, '2026/27', false);
    return [
      { q: 'Will I get a penalty for a late MTD quarterly update in 2026/27?', a: `No. HMRC gives no penalty points for late quarterly updates in ${M.noQuarterlyPointsYear}. You still have to send all four before the software lets you file the return, and a late return does earn a point that year. From the next tax year each missed update deadline counts, one point per deadline even if you run two businesses.` },
      { q: 'How many penalty points before a fine under Making Tax Digital?', a: `${M.pointThreshold} points for someone who has to use MTD. Reaching that threshold triggers a ${h.m(M.submissionPenalty)} penalty, and every further missed deadline adds another ${h.m(M.submissionPenalty)} while you remain at the threshold. Volunteers, and people who become exempt from 2027/28, have a lower threshold of ${M.pointThresholdExempt} points.` },
      { q: 'Is there a grace period for paying tax late under MTD?', a: `Yes. In your first year under the new penalties you have ${M.firstYearGraceDays} days to pay in full or arrange a payment plan: ${h.m(5000)} paid 20 days late costs ${h.m(a.total)} in penalty. From the second year the window is ${M.graceDays} days, and the same delay costs ${h.m(b.total)}. Interest runs from the due date either way.` },
      { q: 'When do MTD penalty points expire?', a: `Below the threshold, each point drops off automatically ${M.pointExpiryMonths} months after the deadline that caused it. Once you hit ${M.pointThreshold} points they stop expiring one by one. To wipe them all you need a full year of updates and returns sent on time, plus anything outstanding from the previous two years caught up. Your HMRC online account shows the removal date.` },
    ];
  },
  body: (h) => {
    const M = h.P.mtd.penalties;
    const days = [10, 20, 31, 60, 120, 365];
    const rows = days.map((d) => [`${d} days`, h.m(h.E.mtdLatePayment(4000, d, '2026/27', true).total), h.m(h.E.mtdLatePayment(4000, d, '2026/27', false).total), h.m(h.E.mtdLatePayment(4000, d, '2027/28', false).total)]);
    const old = h.E.saPenalties(4000, 0, 60).payment, neu = h.E.mtdLatePayment(4000, 60, '2026/27', false).total;
    const first = h.P.mtd.stages[0];
    return `
<h2>Points for missed submissions</h2>
<p>The submission side works like a driving licence. Each missed deadline, whether a tax return or (after ${M.noQuarterlyPointsYear}) a quarterly update, adds a point, and nothing is payable until the total reaches ${M.pointThreshold}. A one-off slip by a busy decorator therefore costs nothing in cash. Two businesses with late updates for the same quarter still bring only one point, because points attach to the deadline, not to each submission. Points under MTD for VAT are kept on a separate tally.</p>
<p>At the threshold, a ${h.m(M.submissionPenalty)} penalty is charged, then the same again for each later miss. Points under the threshold disappear ${M.pointExpiryMonths} months after the missed date. Points at the threshold do not; you clear them by keeping every deadline for twelve months and filing anything still outstanding, after which the count goes back to zero.</p>
<h2>What a late payment costs</h2>
<p>The payment penalty covers balancing payments and tax due after an amendment or assessment. It does not cover ${h.a('payments-on-account', 'payments on account')}. The table shows the penalty alone, before interest, on ${h.m(4000)} of tax.</p>
${h.table(['Paid late by', '2026/27, first MTD year', '2026/27, later year', '2027/28'], rows, `Penalty on ${h.m(4000)}, late payment interest excluded.`, ['l', 'r', 'r', 'r'])}
<p>The annual element, ${h.pc(M.annualRate)} a year on what is still unpaid, starts on day ${M.firstYearGraceDays + 1} and stops when the tax is cleared, or after ${M.annualMaxYears} years. HMRC’s penalty guide, updated in March 2026, sets the two fixed steps at ${h.pc(M.y2728.day15)} for 2027/28 rather than ${h.pc(M.y2627.day15)}. Late payment interest is a separate charge, running from the first day late at ${h.src('gov_hmrc_interest', 'HMRC’s published rate')}.</p>
${h.box('Old penalties, new penalties', `<p>Outside MTD, ${h.m(4000)} paid 60 days late draws a ${h.m(old)} penalty under the ${h.a('self-assessment-penalties', 'Self Assessment rules')}. Inside MTD, after the first year, the same delay costs ${h.m(neu)}. That is ${h.m(Math.abs(neu - old))} ${neu > old ? 'more' : 'less'}: by then both percentage steps have applied and the daily charge has been running for a month.</p>`, 'example')}
<h2>Which year falls under which rules</h2>
<p>The new penalties start with your first MTD tax year. Someone who joined on ${h.date(first.start)} is still under the old regime for the 2025/26 return due on ${h.date(h.E.saCalendar(2025).online)}, with its ${h.m(h.P.selfAssessment.penalties.initial)} late filing charge. The ${M.firstYearGraceDays}-day grace is given only once: a volunteer who later becomes a required user keeps the ${M.graceDays}-day limit.</p>
<h2>Paying in instalments and appealing</h2>
<p>If you cannot pay, call HMRC early. Once a payment plan is agreed and kept, penalties are paused from the day you made contact; they come back if no plan can be agreed or the instalments stop. HMRC writes for each point, each ${h.m(M.submissionPenalty)} charge and each payment penalty, and the letter explains how to appeal. In exceptional cases such as insolvency, HMRC can cancel penalties or points.</p>
<h2>Exempt part-way, or volunteering</h2>
<p>Becoming exempt during ${M.noQuarterlyPointsYear} sends you back to the old Self Assessment penalties. From 2027/28 the new system applies to everyone filing a personal return, so an exemption that year keeps you in it with a lower threshold of ${M.pointThresholdExempt} points, and existing points are cut so that you are no nearer the limit than before. A volunteer is never penalised for a late quarterly update, but late returns count towards the same ${M.pointThresholdExempt}-point limit.</p>`;
  },
});
