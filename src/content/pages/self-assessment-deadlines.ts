import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'self-assessment-deadlines',
  group: 'admin',
  order: 12,
  tool: { kind: 'mini:sa-dates', props: { year: 2025 } },
  related: ['payments-on-account', 'self-assessment-penalties', 'mtd-quarterly-deadlines', 'register-as-self-employed'],
  sources: ['gov_sa_deadlines', 'gov_payments_on_account', 'gov_mtd_quarterly', 'gov_mtd_penalties', 'gov_register_se'],
  slug: 'self-assessment-deadlines',
  nav: 'Self Assessment deadlines',
  card: 'Every Self Assessment date for 2025/26 and 2026/27, from 5 October to 31 July, and what MTD adds.',
  title: 'Self Assessment Deadlines 2026/27: UK Return and Tax Dates',
  description: 'Self Assessment deadlines for 2025/26 and 2026/27: register by 5 October, paper 31 October, coding out 30 December, online and payment 31 January, then 31 July.',
  h1: 'Self Assessment deadlines for 2025/26 and 2026/27',
  intro: 'Two tax years are in play at once: the one you are filing for and the one you are trading in now.',
  resume: (h) => {
    const a = h.E.saCalendar(2025), b = h.E.saCalendar(2026);
    return `The ${a.taxYear} return, for the year that ended on ${h.date(a.yearEnd)}, must reach HMRC online by 11:59pm on ${h.date(a.online)}, and the tax for that year is due the same night; the ${b.taxYear} return follows a year later, on ${h.date(b.online)}. Around that central date sit four others. Newcomers must register by ${h.date(a.registerBy)}. Paper returns are due earlier, by ${h.date(a.paper)}. Anyone who wants a balance paid through their tax code has to file online by ${h.date(a.codingOut)}. And sole traders who make payments on account pay the second one on ${h.date(a.secondPoa)}. Sole traders already in Making Tax Digital keep the January dates and add quarterly updates. Choose a tax year below to see its full set of dates.`;
  },
  faqs: (h) => {
    const P = h.P;
    const a = h.E.saCalendar(2025), b = h.E.saCalendar(2026);
    const r = h.E.selfEmployed({ profit: 22000, region: 'ruk' });
    return [
      { q: 'Can I file my 2026/27 tax return before 31 January 2028?', a: `Yes. The online return for ${b.taxYear} can go in on any day once the year has ended on ${h.date(b.yearEnd)}, up to ${h.date(b.online)}. Filing early does not move the payment date: the bill is still due on ${h.date(b.payment)}. It simply tells you the figure sooner, which helps if you want to budget or ask for a payment plan.` },
      { q: 'What time on 31 January is the self assessment deadline?', a: `11:59pm. HMRC must receive both the online return and the money by then. For ${a.taxYear} that is ${h.date(a.online)}. A sole trader with ${h.m(22000)} of profit who files in time but pays a day later has missed the payment deadline on a bill of ${h.m(r.saBill)}, and interest starts at once.` },
      { q: 'Is 31 October the deadline for online returns too?', a: `No, ${h.date(a.paper)} applies only to paper returns for ${a.taxYear}. Online returns run to ${h.date(a.online)}. If you have missed the paper date you can still file online without a penalty. The one online date before January is ${h.date(a.codingOut)}, for people who want a balance collected through their tax code.` },
      { q: 'What deadline applies if I register for self assessment after 5 October?', a: `HMRC sends a letter or email giving a filing deadline three months from its date, so a late registrant is not automatically late with the return. Payment is different: the tax for ${a.taxYear} is still due by ${h.date(a.payment)}, and a failure to notify penalty can follow if part of it is unpaid then. The usual cut-off is ${P.selfAssessment.registerBy}.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const years = [2025, 2026, 2027].map((y) => h.E.saCalendar(y));
    const rows = years.map((c) => [c.taxYear, h.date(c.registerBy), h.date(c.paper), h.date(c.codingOut), h.date(c.online), h.date(c.secondPoa)]);
    const r = h.E.selfEmployed({ profit: 32000, region: 'ruk' });
    const Q = P.mtd.quarters;
    const M = P.mtd.penalties;
    return `
<h2>The full calendar, year by year</h2>
${h.table(['Tax year', 'Register if new', 'Paper return', 'Online, for coding out', 'Online return and payment', 'Second payment on account'], rows, 'Each date is the last day; HMRC must receive the return or the money by 11:59pm.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Read across a row and the pattern is always the same: the tax year closes on 5 April, registration is due six months later, the paper return three and a half weeks after that, and the online return with the money at the end of the following January. The only date that belongs to a different year is 31 July, which is a payment towards the year after.</p>
<h2>What each date means for a sole trader</h2>
<h3>${P.selfAssessment.registerBy}: telling HMRC</h3>
<p>This one concerns you only in your first year, or if you return to Self Assessment after a year without a return. Miss it and HMRC gives you three months from its letter to file, but the January payment date does not move. The ${h.a('register-as-self-employed', 'registration guide')} covers who has to register.</p>
<h3>31 October: paper returns</h3>
<p>A paper return has to be in HMRC’s hands, not just in the post, by ${h.date(years[0].paper)} for ${years[0].taxYear}. A paper return sent later is late even though an online one would not be.</p>
<h3>30 December: coding out</h3>
<p>HMRC can collect a Self Assessment balance through your tax code in the following year instead of asking for a lump sum, which only works if you also have wages or a pension taxed under PAYE. The condition is filing online by ${h.date(years[0].codingOut)}. Miss it and you pay the usual way in January.</p>
<h3>31 January: the return and the bill</h3>
<p>Two obligations share this date. The online return must be submitted, and everything owed for the year must be paid: the balancing payment, plus the first payment on account for the current year if you make them. Take a picture framer with ${h.m(32000)} of profit in ${P.taxYear} and no payments on account yet: on ${h.date(years[1].payment)} the framer pays ${h.m(r.saBill)} for the year and ${h.m(r.poaEach)} towards the next one (${h.src('gov_sa_deadlines', 'GOV.UK, Self Assessment deadlines')}).</p>
<h3>31 July: the second instalment</h3>
<p>Payments on account are due on ${P.paymentsOnAccount.dueFirst} and ${P.paymentsOnAccount.dueSecond}. The July payment is the second half of the advance towards the current year’s bill, worked out from last year’s figure. It does not exist for anyone whose last bill was under ${h.m(P.paymentsOnAccount.minBill)}. The ${h.a('payments-on-account', 'payments on account calculator')} shows how the two halves are set.</p>
${h.box('Short of money in January?', `<p>GOV.UK lists a payment plan as the option for anyone who does not think they can pay on time. Filing early gives you the figure months ahead, and so leaves room to set one up.</p>`, 'warning')}
<h2>When figures are not ready</h2>
<p>A business whose accounts end on a date other than 5 April, or which is waiting for a valuation, may not know its final profit by 31 January. GOV.UK says to file anyway with provisional figures, tell HMRC that you have done so, and amend the return when the real numbers arrive. Amendments can be made for twelve months after the filing deadline. If more tax turns out to be due, interest runs from the original payment date.</p>
<h2>What Making Tax Digital adds</h2>
<p>Sole traders whose qualifying income brought them into Making Tax Digital from ${h.date(P.mtd.stages[0].start)} keep the January dates for the return and the payment, and add four quarterly updates. These are due on ${Q.map((q) => q.deadline).join(', ')}. For ${M.noQuarterlyPointsYear} no penalty point is given for a late quarterly update, though the updates still have to be sent before the return can be filed (${h.src('gov_mtd_penalties', 'HMRC, MTD penalties')}). Penalties change too, from the first year you are in the scheme; the ${h.a('mtd-quarterly-deadlines', 'quarterly deadlines page')} sets out the update periods, and the ${h.a('self-assessment-penalties', 'penalties page')} explains which regime applies to which return.</p>`;
  },
});
