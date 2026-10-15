import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'class-4-national-insurance',
  group: 'tax',
  order: 4,
  tool: { kind: 'mini:class4' },
  related: ['class-2-national-insurance', 'sole-trader-tax', 'employed-and-self-employed', 'payments-on-account'],
  sources: ['gov_se_nic', 'gov_nic_rates', 'gov_employers_2627', 'leg_sscba_15'],
  slug: 'class-4-national-insurance',
  nav: 'Class 4 NI',
  card: 'Class 4 National Insurance on profit: the two rates, the two limits and how it compares with Class 1.',
  title: 'Class 4 National Insurance 2026/27: Rates and Profit Limits',
  description: 'Class 4 National Insurance for 2026/27: the main and upper rates, the lower and upper profits limits, how it compares with Class 1 for staff, and the NI record.',
  h1: 'Class 4 National Insurance calculator',
  intro: 'The National Insurance a sole trader actually pays, charged on profit through Self Assessment and nowhere else.',
  resume: (h) => {
    const P = h.P;
    const c = h.E.class4(40000);
    return `On ${h.m(40000)} of trading profit in ${P.taxYear}, Class 4 National Insurance is ${h.m(c.total)}: ${h.pc(P.class4.mainRate)} of the profit between the lower profits limit of ${h.m(h.T.lpl)} and the upper profits limit of ${h.m(h.T.upl)}, and ${h.pc(P.class4.upperRate)} of anything above that. Profit up to ${h.m(h.T.lpl)} pays nothing. The charge applies to self-employed profit only, after allowable expenses, so wages from a job, rental income, pensions and dividends never enter it. It is worked out on your Self Assessment return and paid with Income Tax by ${P.paymentsOnAccount.dueFirst}, including through payments on account. The rates and limits are the same in England, Scotland, Wales and Northern Ireland. Class 4 does not itself build your State Pension record: that role belongs to Class 2, which since the 2024/25 tax year is treated as paid, at no cost, when profit reaches ${h.m(h.T.spt)}. Type a profit below to see both.`;
  },
  faqs: (h) => {
    const P = h.P;
    const c60 = h.E.class4(60000);
    const c20 = h.E.class4(20000), e20 = h.E.class1Employee(20000);
    return [
      { q: 'How much Class 4 do I pay on £60,000 of profit?', a: `${h.m(c60.total)} for ${P.taxYear}. The slice from ${h.m(h.T.lpl)} to ${h.m(h.T.upl)} costs ${h.m(c60.main)} at ${h.pc(P.class4.mainRate)}, and the ${h.m(60000 - h.T.upl)} above the upper limit costs ${h.m(c60.upper)} at ${h.pc(P.class4.upperRate)}. The rates are the same in Scotland. Income Tax is charged separately on the same profit, and both are paid together through Self Assessment, so the figure belongs in what you set aside from invoices.` },
      { q: 'Is Class 4 cheaper than the National Insurance an employee pays?', a: `Yes, on the same figure. Class 4 is ${h.pc(P.class4.mainRate)} in the main band; an employee pays Class 1 at ${h.pc(P.class1.employeeMain)} between ${h.m(P.class1.primaryThreshold)} and ${h.m(P.class1.upperEarningsLimit)}. On ${h.m(20000)} that is ${h.m(c20.total)} against ${h.m(e20)}. The employee’s employer also pays ${h.pc(P.class1.employerRate)} on top, which has no self-employed equivalent.` },
      { q: 'Do I pay Class 4 on my salary as well as my profit?', a: `No. Class 4 looks only at trading profit. If you earn ${h.m(30000)} in a job and make ${h.m(15000)} on the side, Class 1 is taken from the salary through payroll and Class 4 is ${h.m(h.E.class4(15000).total)}, worked out on the ${h.m(15000)} alone, as if the job did not exist.` },
      { q: 'Does Class 4 count towards my State Pension?', a: `Not directly. Qualifying years for self-employed people come from Class 2, which is treated as paid when profit is ${h.m(h.T.spt)} or more, so in practice anyone paying Class 4 (profit above ${h.m(h.T.lpl)}) already gets the year credited. Below ${h.m(h.T.spt)}, voluntary Class 2 costs ${h.m2(P.class2.weeklyRate)} a week.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const rows = [12000, 20000, 35000, h.T.upl, 75000, 120000].map((p) => {
      const c = h.E.class4(p);
      return [h.m(p), h.m(c.main), h.m(c.upper), h.m(c.total), h.pc(p > 0 ? Math.round((c.total / p) * 1000) / 1000 : 0)];
    });
    const cmp = [20000, 40000, 70000].map((p) => [h.m(p), h.m(h.E.class4(p).total), h.m(h.E.class1Employee(p)), h.m(h.E.class1Employer(p))]);
    return `
<h2>Two rates, two limits</h2>
<p>For ${P.taxYear} the lower profits limit is ${h.m(h.T.lpl)} and the upper profits limit is ${h.m(h.T.upl)} (${h.src('gov_nic_rates', 'HMRC, National Insurance rates and allowances')}). Profit up to the lower limit is free of Class 4. Between the limits, every pound pays ${h.pc(P.class4.mainRate)}. Above the upper limit, the rate drops to ${h.pc(P.class4.upperRate)} and there is no ceiling. The structure is set by section 15 of the Social Security Contributions and Benefits Act 1992 (${h.src('leg_sscba_15', 'legislation.gov.uk')}).</p>
${h.table(['Profit', `At ${h.pc(P.class4.mainRate)}`, `At ${h.pc(P.class4.upperRate)}`, 'Class 4', 'Share of profit'], rows, `Class 4 National Insurance, ${P.taxYear}, any part of the UK.`, ['r', 'r', 'r', 'r', 'r'])}
<p>Because the rate falls above ${h.m(h.T.upl)}, Class 4 is regressive at the top: someone on ${h.m(120000)} pays a smaller share of profit than someone on ${h.m(h.T.upl)}. It is the opposite of Income Tax, and it explains why the combined marginal rate in England jumps from ${h.pc(P.incomeTax.ruk.bands[0].rate + P.class4.mainRate)} to ${h.pc(P.incomeTax.ruk.bands[1].rate + P.class4.upperRate)} at the same point, rather than doubling.</p>

<h2>What profit means here</h2>
<p>Class 4 uses the same taxable profit as Income Tax: turnover less allowable expenses and capital allowances. Pension contributions, the Personal Allowance and Gift Aid lower Income Tax but do nothing to Class 4. A self-employed electrician who pays ${h.m(5000)} into a personal pension gets relief against Income Tax, while Class 4 is still charged on the full profit. An allowable expense, by contrast, cuts both.</p>

<h2>Class 4 set against Class 1</h2>
<p>Employees pay Class 1 at ${h.pc(P.class1.employeeMain)} between ${h.m(P.class1.primaryThreshold)} and ${h.m(P.class1.upperEarningsLimit)} and ${h.pc(P.class1.employeeUpper)} above, and their employer adds ${h.pc(P.class1.employerRate)} on pay above ${h.m(P.class1.secondaryThreshold)} (${h.src('gov_employers_2627', 'HMRC, rates for employers')}). The self-employed rate is lower and there is no employer share, which is one reason the same work often costs less in contributions when done on a self-employed basis.</p>
${h.table(['Annual figure', 'Class 4 (on profit)', 'Employee Class 1', 'Employer Class 1'], cmp, `${P.taxYear}, annual basis, no salary sacrifice.`, ['r', 'r', 'r', 'r'])}
<p>The comparison works both ways when someone has a job and a business: each class is worked out on its own income. The ${h.a('employed-and-self-employed', 'job plus self-employment page')} runs the full bill for that case.</p>

<h2>How and when it is paid</h2>
<p>There is no separate Class 4 return. You enter profit on your Self Assessment return, HMRC calculates Class 4 alongside Income Tax, and both are paid together by ${P.paymentsOnAccount.dueFirst} after the tax year ends (${h.src('gov_se_nic', 'GOV.UK, self-employed National Insurance rates')}). Class 4 counts towards the bill used for ${h.a('payments-on-account', 'payments on account')}, so in the first year January carries half of it again as an advance.</p>
${h.box('Special cases', `<p>Examiners, moderators, invigilators and people who set exam questions pay a separate Special Class 4 and cannot pay it through Self Assessment; they arrange it with the National Insurance office. Ministers of religion with no salary or stipend pay none.</p>`, 'info')}
<h3>Your National Insurance record</h3>
<p>Class 4 earns no benefit entitlement of its own. Your record for the State Pension depends on Class 2, which is treated as paid when profit is ${h.m(h.T.spt)} or more: anyone liable to Class 4 is already past that point. The ${h.a('class-2-national-insurance', 'Class 2 guide')} covers years with lower profits.</p>`;
  },
});
