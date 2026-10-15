import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'payments-on-account',
  group: 'admin',
  order: 10,
  tool: { kind: 'mini:poa', props: { last: 6000, source: 0, now: 7000 } },
  related: ['home', 'self-assessment-deadlines', 'how-much-tax-to-save-self-employed', 'register-as-self-employed'],
  sources: ['gov_payments_on_account', 'gov_sa_deadlines', 'gov_hmrc_interest'],
  slug: 'payments-on-account',
  nav: 'Payments on account',
  card: 'The two advance payments of 31 January and 31 July, and the balancing payment.',
  title: 'Payments on Account 2026/27: Calculator, Dates and Rules',
  description: 'Payments on account for Self Assessment: when they are due, how HMRC works them out, the first-year double bill, how to reduce them and the balancing payment.',
  h1: 'Payments on account: calculator and dates',
  intro: 'Two advance payments towards next year’s bill, each half of this year’s, due on 31 January and 31 July.',
  resume: (h) => {
    const r = h.E.selfEmployed({ profit: 35000, region: 'ruk' });
    return `Payments on account are HMRC’s way of collecting next year’s Income Tax and Class 4 National Insurance in advance. Each one is half of the bill you just paid through Self Assessment, and they fall due on ${h.P.paymentsOnAccount.dueFirst} and ${h.P.paymentsOnAccount.dueSecond}. You do not make them if that bill was under ${h.m(h.P.paymentsOnAccount.minBill)}, or if more than ${h.pc(h.P.paymentsOnAccount.atSourceShare)} of your tax was already taken at source, through PAYE for example. Student loan repayments and Capital Gains Tax are never part of them. The first year is the hard one: a sole trader with ${h.m(35000)} of profit in ${h.P.taxYear} owes ${h.m(r.saBill)}, and on 31 January 2028 pays that plus a first payment on account of ${h.m(r.poaEach)}, then ${h.m(r.poaEach)} again on 31 July. Type last year’s figures below to see what is due and what the next January will look like.`;
  },
  faqs: (h) => [
    { q: 'Why is my first Self Assessment bill so high?', a: `Because the first 31 January carries two things: the whole bill for the year just ended, since nothing was paid in advance, and the first payment on account for the current year, which is half of that bill again. On ${h.m(30000)} of profit in England that is ${h.m(h.E.selfEmployed({ profit: 30000, region: 'ruk' }).saBill * 1.5)} in one go.` },
    { q: 'Can I reduce my payments on account?', a: 'Yes, if you expect this year’s bill to be lower. Do it in your HMRC online account under “reduce payments on account”, or on form SA303, with an estimate of your income. If the final bill turns out higher than the reduced payments, HMRC charges interest on the difference from the original due dates.' },
    { q: 'Are student loan repayments included in payments on account?', a: 'No. Payments on account cover Income Tax and Class 4 National Insurance only. Student and postgraduate loan repayments, like Capital Gains Tax, are paid in full with the balancing payment on 31 January, so a self-employed graduate should put them aside separately.' },
    { q: 'What happens if I pay a payment on account late?', a: 'HMRC charges late payment interest from the due date, at the Bank of England base rate plus 4 %. Under Making Tax Digital the new late payment penalties do not apply to payments on account, only to balancing payments and amounts due after an amendment; interest still runs.' },
  ],
  body: (h) => {
    const P = h.P;
    let from = 0; for (let x = 12000; x < 40000; x += 100) if (h.E.selfEmployed({ profit: x, region: 'ruk' }).poaDue) { from = x; break; }
    const ex = [20000, 35000, 60000].map((p) => { const r = h.E.selfEmployed({ profit: p, region: 'ruk' }); return [h.m(p), h.m(r.saBill), r.poaDue ? h.m(r.poaEach) : 'none', h.m(r.saBill + r.poaEach), h.m(r.poaEach)]; });
    return `
<h2>Who has to make them</h2>
<p>HMRC sets payments on account automatically when it processes your return. Two tests decide. The first is the size of the bill: Income Tax and Class 4 paid through Self Assessment of ${h.m(P.paymentsOnAccount.minBill)} or more. The second is how much was collected at source: if more than ${h.pc(P.paymentsOnAccount.atSourceShare)} of your tax for the year came through PAYE, on a salary or a pension, no payments on account are set, because most of next year’s tax will be collected the same way. A sole trader with no job in England, Wales or Northern Ireland passes the first test from about ${h.m(from)} of profit and never meets the second.</p>
<h2>The first two years, worked through</h2>
<p>Take three sole traders who start in ${P.taxYear} and whose profit stays the same the following year. The table shows what leaves their account on the two dates that follow the end of their first tax year.</p>
${h.table(['Profit', `${P.taxYear} bill`, 'Each payment on account', '31 January 2028', '31 July 2028'], ex, 'England, Wales or Northern Ireland, no other income.', ['r', 'r', 'r', 'r', 'r'])}
<p>In the second year the pattern settles: if the profit does not change, the two payments on account cover the whole bill, the balancing payment is nil, and each January you pay only the next first instalment. When profit rises, a balancing payment appears on 31 January and the payments on account for the next year rise with it.</p>
<h2>Reducing them, and the trap</h2>
<p>If trade has dropped, you can claim to reduce both payments, online or with form SA303. Do it before the July instalment if you can. The risk is in the other direction: reduce them too far and HMRC charges interest on the shortfall from the original due dates once the return is filed. HMRC’s late payment interest is set at the Bank of England base rate plus 4 % (${h.src('gov_hmrc_interest', 'HMRC interest rates')}).</p>
${h.box('In short', `<p>Bill under ${h.m(P.paymentsOnAccount.minBill)}: no payments on account. First year: bill plus half again on 31 January. Steady profit: two equal halves, nothing more in January. Rising profit: a balancing payment on top.</p>`, 'tip')}
<h2>Paying them</h2>
<p>The amounts appear on your Self Assessment statement and in your online account. You can pay by bank transfer, by debit card through GOV.UK or with a budget payment plan that spreads the next bill over weekly or monthly direct debits. Deadlines are at midnight on ${P.paymentsOnAccount.dueFirst} and ${P.paymentsOnAccount.dueSecond}; the ${h.a('self-assessment-deadlines', 'Self Assessment deadlines page')} lists the rest of the calendar, and the ${h.a('how-much-tax-to-save-self-employed', 'tax to put aside calculator')} turns the bill into a share of each invoice.</p>`;
  },
});
