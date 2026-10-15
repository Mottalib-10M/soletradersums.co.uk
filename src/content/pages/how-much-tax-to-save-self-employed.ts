import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'how-much-tax-to-save-self-employed',
  group: 'tax',
  order: 7,
  tool: { kind: 'mini:save' },
  related: ['payments-on-account', 'sole-trader-tax', 'student-loan-self-employed', 'self-assessment-deadlines'],
  sources: ['gov_income_tax_rates', 'gov_se_nic', 'gov_payments_on_account', 'gov_student_loan_repay', 'gov_sa_deadlines'],
  slug: 'how-much-tax-to-save-self-employed',
  nav: 'How much to put aside',
  card: 'The share of each invoice to set aside for tax, by profit, and the extra cash the first January needs.',
  title: 'Tax to Save When Self-Employed 2026/27: Share of Profit',
  description: 'How much tax to put aside when self-employed in 2026/27: the share of profit by income band, the cash needed for the first January and a simple saving routine.',
  h1: 'How much tax to put aside when self-employed',
  intro: 'Nobody deducts tax from your invoices, so the only safe habit is to move a fixed share of each payment into a separate account as it arrives.',
  resume: (h) => {
    const P = h.P;
    const a = h.E.selfEmployed({ profit: 30000, region: 'ruk' });
    const b = h.E.selfEmployed({ profit: 60000, region: 'ruk' });
    const pct = (x: number) => h.pc(Math.round(x * 1000) / 1000);
    return `A self-employed person in England, Wales or Northern Ireland with ${h.m(30000)} of profit in ${P.taxYear} should put aside ${pct(a.setAside)} of the profit, ${h.m(a.saBill)} for the year, to cover Income Tax and Class 4 National Insurance. At ${h.m(60000)} of profit the share rises to ${pct(b.setAside)}, because part of it falls in the ${h.pc(P.incomeTax.ruk.bands[1].rate)} band. The share depends on profit, not on turnover: apply it to what is left of an invoice after the costs of earning it, or to the whole invoice if your costs are small and you prefer to over-save. Student loan repayments, if you have one, come on top and are not covered by these figures. In your first year of trading the cash needed in January is larger than the bill itself, since HMRC usually adds a first payment on account of half the bill, due on ${P.paymentsOnAccount.dueFirst} together with the balance. Enter your expected profit, any salary and loan plan in the calculator for your own share.`;
  },
  faqs: (h) => {
    const P = h.P;
    const pct = (x: number) => h.pc(Math.round(x * 1000) / 1000);
    const c = h.E.selfEmployed({ profit: 25000, region: 'ruk' });
    const f = h.E.selfEmployed({ profit: 40000, region: 'ruk' });
    const l = h.E.selfEmployed({ profit: 40000, region: 'ruk', plan: 'plan2' });
    let q = 0; for (let p = 20000; p < 200000; p += 1000) if (h.E.selfEmployed({ profit: p, region: 'ruk' }).setAside > 0.25) { q = p - 1000; break; }
    return [
      { q: 'What percentage should a sole trader save for tax?', a: `It depends on profit. For ${P.taxYear} in England, Wales or Northern Ireland, about ${pct(c.setAside)} of profit at ${h.m(25000)}, ${pct(f.setAside)} at ${h.m(40000)} and more beyond the higher-rate threshold of ${h.m(h.T.higherFrom)}. A flat ${h.pc(0.25)} is a common rule of thumb: enough up to about ${h.m(q)} of profit, too little above it.` },
      { q: 'How much do I need for my first self-employed tax bill?', a: `Roughly one and a half times the bill. On ${h.m(40000)} of profit the ${P.taxYear} bill is ${h.m(f.saBill)}, and the first January also brings a payment on account of ${h.m(f.poaEach)}, so ${h.m(f.saBill + f.poaEach)} leaves your account in one go, with another ${h.m(f.poaEach)} due on ${P.paymentsOnAccount.dueSecond}.` },
      { q: 'Should I save more if I have a student loan?', a: `Yes. Self Assessment collects the repayment at ${h.pc(P.studentLoans.rate)} of income above your plan threshold, and payments on account do not cover it. With ${h.m(40000)} of profit on Plan 2, the share to set aside goes from ${pct(f.setAside)} to ${pct(l.setAside)}, an extra ${h.m(l.saBill - f.saBill)} for the year.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const pct = (x: number) => h.pc(Math.round(x * 1000) / 1000);
    const rows = [15000, 25000, 35000, 45000, 60000, 80000].map((p) => {
      const r = h.E.selfEmployed({ profit: p, region: 'ruk' }), s = h.E.selfEmployed({ profit: p, region: 'scotland' });
      return [h.m(p), pct(r.setAside), pct(s.setAside), h.m(r.saBill / 12), h.m(r.saBill + r.poaEach)];
    });
    const m1 = h.E.marginalOnProfit({ profit: 30000, region: 'ruk' }), m2 = h.E.marginalOnProfit({ profit: 60000, region: 'ruk' });
    const inv = h.E.selfEmployed({ profit: 35000, region: 'ruk' });
    return `
<h2>Shares of profit for ${P.taxYear}</h2>
<p>The table gives the share of profit to set aside at six levels, worked out by the same engine as the calculator, with no salary and no student loan. The last two columns turn the English figure into a monthly transfer and into the cash needed on the first January of a new business.</p>
${h.table(['Profit', 'Put aside, rUK', 'Put aside, Scotland', 'A month (rUK)', 'First January (rUK)'], rows, `Income Tax and Class 4, ${P.taxYear}, no other income.`, ['r', 'r', 'r', 'r', 'r'])}
<p>Two figures matter for planning. The average share above covers the whole year. The marginal share is what each new pound costs: ${pct(m1)} at ${h.m(30000)} of profit and ${pct(m2)} at ${h.m(60000)} in England, Wales or Northern Ireland. If a good month pushes your profit up, the extra money needs the marginal share set aside, not the average.</p>

<h2>Profit, not the invoice</h2>
<p>Tax is charged on profit, so the share applies to what is left once the costs of a job are paid. A decorator who invoices ${h.m(1000)} and spends ${h.m(250)} on paint and materials sets aside ${pct(inv.setAside)} of ${h.m(750)} if their yearly profit is around ${h.m(35000)}, not of the full thousand. Applying the share to the gross invoice is simpler and errs on the safe side; the surplus becomes a cushion for the following year. The calculator also shows the amount per ${h.m(1000)} of profit.</p>

<h2>Why the first year needs more</h2>
<p>A new sole trader pays nothing for up to twenty-two months after starting, then meets a double demand. For ${P.taxYear}, the bill and the first ${h.a('payments-on-account', 'payment on account')} are both due on ${h.date(h.E.saCalendar(P.year).online)}, and a second advance follows on ${h.date(h.E.saCalendar(P.year).secondPoa)} (${h.src('gov_payments_on_account', 'GOV.UK, payments on account')}). Payments on account are only set when the bill reaches ${h.m(P.paymentsOnAccount.minBill)}, so very small profits escape them. If your profit falls the next year, you can ask HMRC to reduce the advances; if it rises, a balancing payment appears the following January.</p>

<h2>Things that change the share</h2>
<p>A salary from a job raises the share on the side profit, because the job has already used the allowance and part of the basic band; the ${h.a('employed-and-self-employed', 'job plus self-employment page')} works it through. A student loan adds ${h.pc(P.studentLoans.rate)} of income above the plan threshold (${h.src('gov_student_loan_repay', 'GOV.UK, student loan repayments')}), and that sum is paid in full each January, outside the payments on account. Pension contributions and genuine business expenses bring the share down. Living in Scotland raises it from the mid-thirties of profit upwards, since the Scottish higher rate of ${h.pc(P.incomeTax.scotland.bands[3].rate)} starts at ${h.m(h.T.scotHigherFrom)}.</p>
${h.box('A routine that works', `<p>Open a separate savings account used only for tax. Each time a client pays, move the share shown by the calculator the same day. Check the total against the calculator each quarter with your actual profit so far, and top up or ease off. By the ${P.paymentsOnAccount.dueFirst} deadline (${h.src('gov_sa_deadlines', 'GOV.UK, deadlines')}) the money is already there.</p>`, 'tip')}`;
  },
});
