import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'class-2-national-insurance',
  group: 'tax',
  order: 5,
  mini: { kind: 'mini:class2' },
  related: ['class-4-national-insurance', 'register-as-self-employed', 'trading-allowance', 'sole-trader-tax'],
  sources: ['gov_se_nic', 'gov_nic_rates', 'gov_trading_allowance', 'gov_register_se', 'gov_voluntary_nic', 'gov_state_pension'],
  slug: 'class-2-national-insurance',
  nav: 'Class 2 NI',
  card: 'Class 2 is no longer charged: when your year is credited for free and when paying it voluntarily makes sense.',
  title: 'Class 2 National Insurance 2026/27: Credited or Voluntary',
  description: 'Class 2 National Insurance in 2026/27: no longer charged, treated as paid from £7,105 of profit, and who may pay it voluntarily at £3.65 a week to fill a gap.',
  h1: 'Class 2 National Insurance: what is left of it',
  intro: 'Class 2 has stopped being a bill; it survives as a cheap way to protect your National Insurance record in a thin year.',
  resume: (h) => {
    const P = h.P;
    const c = h.E.class2(0);
    return `Self-employed people no longer pay Class 2 National Insurance as a charge. For ${P.taxYear}, if your profit is ${h.m(h.T.spt)} or more, the small profits threshold, Class 2 is treated as paid: the year counts towards your State Pension and you owe nothing for it. If your profit is below ${h.m(h.T.spt)}, or your gross trading income is ${h.m(P.tradingAllowance.amount)} or less, nothing is due either, but you can choose to pay Class 2 voluntarily at ${h.m2(P.class2.weeklyRate)} a week, which comes to ${h.m2(c.voluntaryYear)} for a full year of ${P.class2.weeks} weeks. That payment buys a qualifying year on your National Insurance record, the unit that decides how much new State Pension you receive, and it can help with some benefits such as Maternity Allowance. Voluntary Class 2 is paid through Self Assessment, so you need to be registered even when your income is small. Class 4, the contribution charged on profit above ${h.m(h.T.lpl)}, is unaffected by any of this.`;
  },
  faqs: (h) => {
    const P = h.P;
    const c = h.E.class2(0);
    return [
      { q: 'Do I still have to pay Class 2 National Insurance?', a: `No. Since the 2024/25 tax year Class 2 is not charged on self-employed profit. With profit of ${h.m(h.T.spt)} or more in ${P.taxYear} it is treated as paid, so you get the qualifying year for nothing. Below that, paying is optional, at ${h.m2(P.class2.weeklyRate)} a week, and only worth it if you want to fill the year on your record.` },
      { q: 'How much is voluntary Class 2 for a whole year?', a: `${h.m2(c.voluntaryYear)} for ${P.taxYear}: ${h.m2(P.class2.weeklyRate)} a week for ${P.class2.weeks} weeks. It is open to self-employed people whose profit is below ${h.m(h.T.spt)}, or whose gross income is ${h.m(P.tradingAllowance.amount)} or less. Class 3, the other voluntary class, gives the same State Pension year at a much higher weekly rate.` },
      { q: 'Can I pay voluntary Class 2 if my profit is below £1,000?', a: `Yes. GOV.UK lets you pay Class 2 or Class 3 voluntarily when gross self-employed income is ${h.m(P.tradingAllowance.amount)} or less, or when it is higher but profit stays under ${h.m(h.T.spt)}. You do need to register for Self Assessment to do it, even though income that small would not otherwise oblige you to file a return.` },
      { q: 'Is voluntary Class 2 worth paying for my State Pension?', a: `Often, but check first. A year of Class 2 costs ${h.m2(h.E.class2(0).voluntaryYear)} in ${P.taxYear} and can add a qualifying year to your record. GOV.UK warns it does not always raise your pension, for example if you were contracted out, or if you will reach a full record anyway. Your State Pension forecast or the Future Pension Centre will tell you.` },
      { q: 'Do landlords pay Class 2 National Insurance?', a: `Not as a charge. Class 2 is treated as paid only for self-employed traders with profit of ${h.m(h.T.spt)} or more. Landlords who are eligible to pay Class 2 do not get that automatic treatment, and GOV.UK lists them among those who may want to pay voluntarily at ${h.m2(P.class2.weeklyRate)} a week to protect their record.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const c = h.E.class2(0);
    const rows = [800, 4000, 7000, h.T.spt, 10000, 20000].map((p) => {
      const k = h.E.class2(p);
      return [h.m(p), k.credited ? 'treated as paid' : 'optional', k.credited ? h.m(0) : h.m2(k.voluntaryYear), h.m(h.E.class4(p).total)];
    });
    return `
<h2>From a weekly bill to a free credit</h2>
<p>Self-employed people above a small threshold used to pay a flat weekly Class 2 contribution, collected through Self Assessment, while Class 4 took a percentage of profit on top. That changed from the 2024/25 tax year. Class 2 is no longer charged on anyone’s profit. Instead, GOV.UK says that if your profits are ${h.m(h.T.spt)} or more a year, Class 2 contributions are treated as having been paid to protect your National Insurance record, so you do not have to pay them (${h.src('gov_se_nic', 'GOV.UK, self-employed National Insurance rates')}).</p>
<p>The weekly rate still exists, ${h.m2(P.class2.weeklyRate)} for ${P.taxYear} (${h.src('gov_nic_rates', 'HMRC, National Insurance rates and allowances')}), but it now applies only to people who choose to pay. In practice the change removed one line from almost every sole trader’s Self Assessment bill and left Class 4 as the only National Insurance most of them pay.</p>

<h2>Three situations, depending on profit</h2>
<h3>Profit of ${h.m(h.T.spt)} or more</h3>
<p>Nothing to pay and nothing to do. When your return shows profit at or above the small profits threshold, HMRC records the year as if Class 2 had been paid. A gardener with ${h.m(9000)} of profit pays no Income Tax, no Class 4 and no Class 2, yet still earns a qualifying year towards the State Pension. That is the main gain from the reform, and it is easy to miss because nothing appears on the bill.</p>
<h3>Profit below ${h.m(h.T.spt)}</h3>
<p>Nothing is due, but the year is not credited automatically. A part-time photographer who makes ${h.m(5000)} of profit could end up with a gap in the National Insurance record for that year unless another route fills it: a job paying enough, National Insurance credits, or a voluntary contribution. Voluntary Class 2 is the cheapest of the paid options, at ${h.m2(c.voluntaryYear)} for a full year.</p>
<h3>Gross income of ${h.m(P.tradingAllowance.amount)} or less</h3>
<p>Very small traders are covered by the trading allowance and usually do not need to register at all (${h.src('gov_trading_allowance', 'HMRC, tax-free allowances on trading income')}). HMRC makes an exception: you must register and file if you want to pay voluntary Class 2 to help qualify for some benefits, or if you want to claim Maternity Allowance based on your self-employment. GOV.UK confirms that someone with gross self-employed income at or below that level may pay Class 2 or Class 3 voluntarily.</p>

<h2>The figures for ${P.taxYear}</h2>
<p>The table runs the same calculation as the tool above for six profits. Class 4 is shown alongside because people often confuse the two: one is now optional below a threshold, the other is a real charge above a higher one.</p>
${h.table(['Profit', 'Class 2', 'Cost if you choose to pay', 'Class 4 due'], rows, `${P.taxYear}, one self-employed trade, no other earnings.`, ['r', 'l', 'r', 'r'])}
<p>The gap between the small profits threshold of ${h.m(h.T.spt)} and the Class 4 lower profits limit of ${h.m(h.T.lpl)} is a band where the year is credited and nothing at all is paid. Someone in that band is in a better position than an employee on similar earnings, who has to earn at least the lower earnings limit of ${h.m(P.class1.lowerEarningsLimit)} from a job for the year to count.</p>

<h2>Why anyone would pay voluntarily</h2>
<p>The new State Pension depends on your qualifying years. GOV.UK says you usually need at least 10 of them to get any new State Pension, and 35 for the full rate if your record started after April 2016. A qualifying year can come from paid contributions, from credits (for example while claiming certain benefits, or as a parent or carer) or from voluntary contributions.</p>
<p>GOV.UK gives a list of reasons to pay voluntarily, and one of them names this group directly: you are self-employed with annual profits under ${h.m(h.T.spt)}. The others apply as well: being close to State Pension age without enough years, or knowing your working life will not produce a full record. For a sole trader whose business had a slow start, a weak year after illness, or a deliberate part-time year while studying, ${h.m2(c.voluntaryYear)} is a small price for a year that would otherwise be lost.</p>
${h.box('Check before you pay', `<p>Voluntary contributions do not always raise the pension. GOV.UK points to people who were contracted out before 2016 as one example, and anyone who will reach a full record anyway gains nothing from an extra year. Your State Pension forecast shows your record and gaps; the Future Pension Centre can confirm whether a payment would help.</p>`, 'warning')}

<h3>Credits before payments</h3>
<p>Before paying anything, check whether a free credit already covers the year. GOV.UK says National Insurance credits can fill gaps when you are not paying contributions, for example while claiming benefits because you are ill or unemployed, or as a parent or carer. Credits from registering for Child Benefit can even be transferred to a spouse or partner living with you in some cases. A self-employed parent with a small profit may already have the year without paying a penny.</p>

<h2>Who cannot rely on the automatic credit</h2>
<p>Some self-employed people do not have Class 2 treated as paid even with healthy profits, and GOV.UK names them as possible voluntary payers: examiners, moderators, invigilators and people who set exam questions; landlords who are eligible to pay Class 2; ministers of religion with no salary or stipend; and people who make investments for themselves or others without doing so as a business or taking a fee. If you fall into one of these groups, assume the year is not protected until your record says otherwise.</p>

<h2>How to pay it</h2>
<p>GOV.UK says most people pay Class 2 through Self Assessment, with the rest of the bill, which is payable by ${P.paymentsOnAccount.dueFirst} after the end of the tax year. This is why registration matters even for tiny businesses: without a Unique Taxpayer Reference there is no return to add it to. The ${h.a('register-as-self-employed', 'registration guide')} explains the steps and the ${P.selfAssessment.registerBy} deadline after the end of the tax year (${h.src('gov_register_se', 'GOV.UK, register for Self Assessment')}).</p>
<p>Gaps can also be filled after the event, within limits. For a missed earlier year, GOV.UK says Class 2 for the previous tax year is charged at that year’s original rate, while older gaps are charged at the current rate.</p>

<h2>Class 2 and Class 3 compared</h2>
<p>Class 3 is the voluntary class open to people who are not self-employed, and some self-employed people can pay either. Both buy the same thing for State Pension purposes: a qualifying year. Class 3 costs several times more per week. Where you have a choice, Class 2 is the cheaper way to fill a self-employed year. HMRC’s trading allowance guidance also links voluntary Class 2 with qualifying for some benefits, which is a further reason a very small trader might register rather than stay outside the system. The ${h.a('class-4-national-insurance', 'Class 4 page')} covers the contribution charged on profit, which is unrelated to this choice.</p>`;
  },
});
