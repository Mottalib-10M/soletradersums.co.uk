import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'mtd-quarterly-deadlines',
  group: 'mtd',
  order: 31,
  tool: { kind: 'mini:mtd-q', props: { start: 2026, cal: 0 } },
  related: ['making-tax-digital', 'mtd-penalties', 'making-tax-digital-software', 'self-assessment-deadlines'],
  sources: ['gov_mtd_quarterly', 'gov_mtd_overview', 'gov_mtd_penalties', 'gov_sa_deadlines'],
  slug: 'mtd-quarterly-deadlines',
  nav: 'Quarterly deadlines',
  card: 'The four MTD update dates, standard or calendar periods, and what each cumulative update contains.',
  title: 'MTD Quarterly Deadlines 2026/27: Update Periods and Dates',
  description: 'MTD quarterly update deadlines for 2026/27: the four dates, standard or calendar periods, cumulative totals, sending early and the final return in January.',
  h1: 'MTD quarterly update deadlines',
  intro: 'Four dates a year, each one the 7th of the month that follows a quarter, plus the return in January.',
  resume: (h) => {
    const Q = h.P.mtd.quarters, c = h.E.saCalendar(2026);
    return `Under Making Tax Digital for Income Tax, a sole trader or landlord sends four quarterly updates a year, due on ${Q[0].deadline}, ${Q[1].deadline}, ${Q[2].deadline} and ${Q[3].deadline}. For ${h.P.taxYear}, the first year of the scheme, that means ${Q[0].deadline} 2026, ${Q[1].deadline} 2026, ${Q[2].deadline} 2027 and ${Q[3].deadline} 2027, followed by the tax return and payment by ${h.date(c.online)}. Each update is cumulative: it runs from the start of the tax year to the end of the period, so the third one covers ${Q[2].standard} rather than three months alone. Standard periods end on the 5th and follow the tax year; calendar periods end on the last day of the month, from ${Q[0].calendar.split(' to ')[0]}. Whichever you pick, the deadline is the same. Updates are summaries of income and expenses by category, not tax returns, and in ${h.P.mtd.penalties.noQuarterlyPointsYear} a late one earns no penalty point. Choose your first year and period type to list your own dates.`;
  },
  faqs: (h) => {
    const Q = h.P.mtd.quarters;
    return [
      { q: 'When is the first MTD quarterly update due?', a: `For anyone who started on ${h.date(h.P.mtd.stages[0].start)}, the first update covered ${Q[0].standard} (or ${Q[0].calendar} on calendar periods) and was due by ${Q[0].deadline} 2026. Someone joining on ${h.date(h.P.mtd.stages[1].start)} sends their first one by ${Q[0].deadline} 2027. The deadline is the same whichever period type you use.` },
      { q: 'Can I send my MTD quarterly update before the quarter ends?', a: `Yes, up to ${h.P.mtd.earlySendDays} days before the end of the update period, but only if you do not expect to record anything else in it. A gardener closing down for a fortnight’s holiday at the end of June could send the first update early. Otherwise you send it any time between the end of the period and the deadline.` },
      { q: 'Do I need to send a quarterly update if I had no income?', a: `Yes. An empty quarter still needs an update, so that HMRC knows nothing happened. Because each update runs from the start of the tax year, a quiet winter quarter simply repeats the totals you already sent. After ${h.P.mtd.penalties.noQuarterlyPointsYear}, missing that update would count towards the ${h.P.mtd.penalties.pointThreshold}-point threshold.` },
      { q: 'Should I use standard or calendar update periods?', a: `Standard periods suit accounts drawn up to ${Q[3].standard.split(' to ')[1]}, the tax year end. Calendar periods suit accounts to ${Q[3].calendar.split(' to ')[1]} and make bookkeeping simpler for monthly statements. You must choose calendar periods in the software before your first update, and you cannot switch for a tax year once an update for that year has gone. The ${Q[0].deadline} deadline applies either way.` },
    ];
  },
  body: (h) => {
    const P = h.P, Q = P.mtd.quarters, c = h.E.saCalendar(2026);
    const yrs = [2026, 2026, 2027, 2027];
    const rows = Q.map((q, i) => [`Update ${i + 1}`, q.standard, q.calendar, `${q.deadline} ${yrs[i]}`]);
    return `
<h2>The 2026/27 timetable</h2>
<p>The table sets out the year for the first wave. A later joiner keeps the same days and months and adds a year for each wave.</p>
${h.table(['Update', 'Standard period', 'Calendar period', 'Deadline'], rows, `${P.taxYear}, first year of MTD for Income Tax.`, ['l', 'l', 'l', 'r'])}
<p>The year then closes with the return, filed through the software and paid by ${h.date(c.online)}. That date is unchanged from ordinary Self Assessment, and so are the ${h.a('self-assessment-deadlines', 'other Self Assessment dates')} such as the July payment on account.</p>
<h2>Why each update starts on 6 April</h2>
<p>An update is a running total. A plumber who sends ${h.m(9000)} of sales for the first period and ${h.m(19500)} for the second has told HMRC that ${h.m(19500 - 9000)} came in between July and October; the software does the subtraction. The benefit is practical: if a February invoice was keyed into the wrong category, you fix the record and the next update carries the corrected total, with no need to resend anything older. The flip side is that the fourth update must reflect the whole year, and if you correct records after sending it, HMRC expects you to resend that fourth update before making year-end tax adjustments.</p>
<h2>What goes in, and what does not</h2>
<p>The software adds up your digital records into the same income and expense categories as the Self Assessment pages. HMRC receives those totals for each business, not the receipts or invoices behind them, and you make no accounting or tax adjustments at this stage. Someone with a trade and a rented flat sends two sets of figures each quarter, one per business. For a jointly let property, the owner may report rent only during the year and add the expenses later by resending the fourth update. After each submission the software, or the HMRC online account, shows an estimate of the year’s tax, which picks up PAYE wages and any student loan plan HMRC already knows about.</p>
${h.box('Earlier, or more often', `<p>An update can go up to ${P.mtd.earlySendDays} days before the period ends if no more transactions are expected. You may also send updates more often than four times, every month for instance, as long as each one still runs from the first day of the tax year.</p>`, 'tip')}
<h2>Missing a date</h2>
<p>For ${P.mtd.penalties.noQuarterlyPointsYear}, HMRC does not give penalty points for late quarterly updates. They still matter: the software will not let you submit the return until all four have been sent. From the following year, each missed deadline earns a point, and reaching ${P.mtd.penalties.pointThreshold} points brings a ${h.m(P.mtd.penalties.submissionPenalty)} penalty; the rules on points and late payment are set out on the ${h.a('mtd-penalties', 'MTD penalties page')}. Volunteers who join before they have to are not penalised for late updates at all.</p>`;
  },
});
