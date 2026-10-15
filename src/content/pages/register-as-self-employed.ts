import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'register-as-self-employed',
  group: 'admin',
  order: 11,
  tool: { kind: 'mini:register', props: { month: 6, year: 2026 } },
  related: ['self-assessment-deadlines', 'trading-allowance', 'payments-on-account', 'employed-and-self-employed'],
  sources: ['gov_register_se', 'gov_set_up_sole_trader', 'gov_trading_allowance', 'gov_sa_penalties', 'gov_sa_deadlines', 'gov_find_utr'],
  slug: 'register-as-self-employed',
  nav: 'Register as self-employed',
  card: 'When a new sole trader must tell HMRC, the 5 October cut-off, the UTR and the first dates to diary.',
  title: 'Register as Self-Employed Sole Trader: UK Rules and Dates',
  description: 'Register as self-employed with HMRC: when gross income over £1,000 makes it compulsory, the 5 October cut-off, your UTR and the first return and tax deadlines.',
  h1: 'Registering as a self-employed sole trader',
  intro: 'You can trade from day one; the duty is to tell HMRC in time, and the date depends on when your tax year ends.',
  resume: (h) => {
    const P = h.P;
    const f = h.E.firstYearDeadlines('2026-06-15');
    const r = h.E.selfEmployed({ profit: 18000, region: 'ruk' });
    return `A sole trader who starts in June 2026 has until ${h.date(f.registerBy)} to register for Self Assessment, and on ${h.date(f.firstPayment)} pays the first bill: on ${h.m(18000)} of profit in England, Wales or Northern Ireland that is ${h.m(r.saBill)}, plus a first payment on account of ${h.m(r.poaEach)}. Registration becomes compulsory once your gross self-employed income in a tax year is more than ${h.m(P.tradingAllowance.amount)}, counted before any expenses, and the cut-off is ${P.selfAssessment.registerBy} after the end of that tax year (which runs from 6 April to 5 April). Nothing stops you trading before you register, and you can register early. HMRC then sends a ten-digit Unique Taxpayer Reference, the UTR, which you need to file online. Pick the month you started below to see your own register-by date, the first return and the two payment dates that follow.`;
  },
  faqs: (h) => {
    const P = h.P;
    const r = h.E.selfEmployed({ profit: 40000, region: 'ruk' });
    return [
      { q: 'Do I need to register as self-employed if I only earn a few hundred pounds?', a: `Not usually. If your gross trading income for the tax year is ${h.m(P.tradingAllowance.amount)} or less, the trading allowance covers it and you need not tell HMRC. You still register if you want to claim a loss, pay voluntary Class 2 contributions, or prove self-employment for Tax-Free Childcare or Maternity Allowance. Keep a record of the income either way.` },
      { q: 'What is the deadline to register for self assessment as a new sole trader?', a: `${P.selfAssessment.registerBy} after the end of the tax year in which your gross income first went over ${h.m(P.tradingAllowance.amount)}. Start in August 2026 and the tax year is ${P.taxYear}, so the date is ${h.date(h.E.saCalendar(2026).registerBy)}. Registering on time does not create a bill by itself: tax is worked out from the return you file later.` },
      { q: 'How long does it take to get a UTR number?', a: `HMRC says the Unique Taxpayer Reference usually arrives by post around 15 days after you register, and later if you live abroad. Once issued it also shows in your personal tax account and the HMRC app. Without it you cannot sign in to file online, so register well before ${h.date(h.E.saCalendar(2025).online)} if that is your first return.` },
      { q: 'Is there a fine for registering as self-employed late?', a: `Only if tax is left unpaid. Register after ${P.selfAssessment.registerBy} and fail to pay everything by ${P.paymentsOnAccount.dueFirst} and HMRC can charge a failure to notify penalty, based on the amount still owed. A sole trader with ${h.m(40000)} of profit in England owes ${h.m(r.saBill)} for the year, so the sum the penalty is worked from can be large.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const c25 = h.E.saCalendar(2025), c26 = h.E.saCalendar(2026);
    const starts: Array<[string, string]> = [['2026-02-10', 'February 2026'], ['2026-04-20', 'April 2026 (after the 5th)'], ['2026-09-01', 'September 2026'], ['2027-03-15', 'March 2027']];
    const rows = starts.map(([iso, label]) => { const f = h.E.firstYearDeadlines(iso); return [label, f.taxYear, h.date(f.registerBy), h.date(f.onlineReturn), h.date(f.secondPoa)]; });
    const tutor = h.E.selfEmployed({ profit: 9000, employment: 26000, region: 'ruk' });
    return `
<h2>The trigger: gross income, not profit</h2>
<p>The test HMRC applies is simple and catches people out because it ignores costs. A dog walker who invoices ${h.m(1400)} in a year and spends ${h.m(600)} on leads, insurance and fuel has made a profit of ${h.m(800)}, yet the gross figure is over ${h.m(P.tradingAllowance.amount)}, so registration is required. Below that line the trading allowance makes the income tax-free and there is nothing to tell HMRC (${h.src('gov_trading_allowance', 'HMRC guidance on the trading allowance')}). Above it, you register and then choose on the return between deducting the allowance or your real expenses.</p>
<p>Several small trades count together. A tutor who also sells prints online adds both gross amounts before comparing with the limit. Wages from a job sit outside this test, but if you already file a return for another reason, the business simply goes on that return.</p>
<h2>When the date falls</h2>
<p>The cut-off belongs to the tax year, not to the day you started. HMRC must hear from you by ${P.selfAssessment.registerBy} after the 5 April that closes your first trading year. For the year that ended on ${h.date(c25.yearEnd)}, that was ${h.date(c25.registerBy)}; for ${P.taxYear} it is ${h.date(c26.registerBy)}. Starting in March rather than April makes a whole year of difference:</p>
${h.table(['Started trading', 'First tax year', 'Register by', 'First return and payment', 'Second payment on account'], rows, 'Dates that follow from the start date, if gross income passes the limit in the first tax year.', ['l', 'l', 'r', 'r', 'r'])}
<p>The same cut-off applies to someone who registered years ago but did not have to send a return for 2024/25: their account needs reactivating rather than a fresh registration, and the online service tells you which applies (${h.src('gov_register_se', 'GOV.UK, how to register')}).</p>
<h2>Missing the cut-off</h2>
<p>A late registration does not stop you filing. HMRC writes with a personal filing deadline set three months from the date of its letter, but the tax itself is still due by ${h.date(c25.payment)} for the ${c25.taxYear} year (${h.src('gov_sa_deadlines', 'GOV.UK, Self Assessment deadlines')}). The risk is the failure to notify penalty: it applies when you registered after ${P.selfAssessment.registerBy} and have not paid the whole bill by ${P.paymentsOnAccount.dueFirst}, and it is based on what remains unpaid (${h.src('gov_sa_penalties', 'GOV.UK, Self Assessment penalties')}). Paying in full on time is the practical defence. The ${h.a('self-assessment-penalties', 'late filing and payment penalties')} are a separate set of charges.</p>
${h.box('Registering early is allowed', `<p>GOV.UK states that you can register before you reach ${h.m(P.tradingAllowance.amount)}. A photographer who expects to pass the limit in the autumn can register in the spring and have the UTR in hand long before the first return is due.</p>`, 'tip')}
<h2>What you get back, and what you need</h2>
<p>Registration produces a Unique Taxpayer Reference, a ten-digit number that HMRC also calls a tax reference. It normally arrives by post around 15 days later. It is printed on later letters, on notices to file and payment reminders, and appears in your personal tax account and the HMRC app. To file online you need it, plus sign-in details, and HMRC may ask you to prove your identity with photo ID such as a passport or driving licence. Add your bank details to the return so that any refund can be paid straight back.</p>
<p>Before any of that, start keeping records: every sale and every business expense, from the first invoice. Since 2024/25 the cash basis is the default way to count them, recording money when it actually comes in or goes out. You do not send the records to HMRC, but you need them to work out the profit and must be able to show them if asked.</p>
<h2>If you also have a job</h2>
<p>Being employed does not exempt you. A tutor earning ${h.m(26000)} on PAYE who makes ${h.m(9000)} of profit from evening lessons registers like anyone else; the wages have already used the Personal Allowance, so the whole profit is taxed at the basic rate. The return for that tutor shows ${h.m(tutor.itViaSA)} of Income Tax to pay through Self Assessment, and ${tutor.class4.total > 0 ? `${h.m(tutor.class4.total)} of Class 4` : `no Class 4, since the profit is under the ${h.m(h.T.lpl)} lower profits limit`}. The ${h.a('employed-and-self-employed', 'job plus self-employment page')} works through these cases.</p>
<h2>Beyond income tax</h2>
<p>Registering for Self Assessment covers Income Tax and National Insurance on your profits. VAT is a separate registration with its own test on sales, explained on the ${h.a('vat-threshold-sole-trader', 'VAT threshold page')}. Depending on the trade you may also need a licence (street trading, food, music), insurance, or a criminal record check for work with children or vulnerable adults, all listed on ${h.src('gov_set_up_sole_trader', 'GOV.UK, set up as a sole trader')}. Once registered, the next dates to watch are on the ${h.a('self-assessment-deadlines', 'Self Assessment calendar')}.</p>`;
  },
});
