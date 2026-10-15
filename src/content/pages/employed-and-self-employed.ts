import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'employed-and-self-employed',
  group: 'tax',
  order: 6,
  tool: { kind: 'mini:side' },
  related: ['self-assessment-tax-calculator', 'trading-allowance', 'register-as-self-employed', 'class-4-national-insurance'],
  sources: ['gov_set_up_sole_trader', 'gov_trading_allowance', 'gov_income_tax_rates', 'gov_se_nic', 'gov_sa_deadlines'],
  slug: 'employed-and-self-employed',
  nav: 'Job plus self-employed',
  card: 'A side business next to a salary: why the profit is taxed from the first pound and when Class 4 applies.',
  title: 'Employed and Self-Employed 2026/27: Tax on a Side Business',
  description: 'Employed and self-employed in 2026/27: why the salary uses the allowance first, the tax on side profit, Class 1 and Class 4, the £1,000 allowance, registering.',
  h1: 'Employed and self-employed: tax on a side business',
  intro: 'Run a business next to a job and the salary takes the cheap slices of the tax system first; the side profit starts where the salary stops.',
  resume: (h) => {
    const P = h.P;
    const r = h.E.selfEmployed({ profit: 8000, employment: 32000, region: 'ruk' });
    return `Someone earning a ${h.m(32000)} salary who makes ${h.m(8000)} of profit on the side owes HMRC ${h.m(r.saBill)} more for ${P.taxYear} in England, Wales or Northern Ireland, all of it Income Tax at the ${h.pc(P.incomeTax.ruk.bands[0].rate)} basic rate, and keeps ${h.m(8000 - r.saBill)} of the profit. The Personal Allowance of ${h.m(h.T.pa)} has already been used by the salary through the tax code, so the side profit is taxed from its first pound. Class 4 National Insurance, on the other hand, ignores the job: it is charged only on profit above ${h.m(h.T.lpl)}, so this profit pays none, even though total income is well past that figure. Class 1 on the salary is handled by payroll as usual. You must register for Self Assessment once gross takings from the side business pass ${h.m(P.tradingAllowance.amount)} in a tax year, and you can deduct that ${h.m(P.tradingAllowance.amount)} allowance instead of real expenses when it is the better choice.`;
  },
  faqs: (h) => {
    const P = h.P;
    const big = h.E.selfEmployed({ profit: 10000, employment: 45000, region: 'ruk' });
    const sc = h.E.selfEmployed({ profit: 8000, employment: 32000, region: 'scotland' });
    return [
      { q: 'Do I need to tell my employer about my side business?', a: `Not for tax. HMRC deals with the side profit through your own Self Assessment return, and the employer only runs PAYE on your salary. Your contract may have its own rules on outside work. If gross side takings pass ${h.m(P.tradingAllowance.amount)} in the tax year, the person who must hear about it is HMRC, by ${P.selfAssessment.registerBy} after the year ends.` },
      { q: 'What if my side profit pushes me into the higher rate?', a: `Only the part above ${h.m(h.T.basicTo)} of total income is taxed at ${h.pc(P.incomeTax.ruk.bands[1].rate)}. With a ${h.m(45000)} salary and ${h.m(10000)} of profit, Self Assessment adds ${h.m(big.saBill)}, all of it Income Tax charged partly at each rate, and no Class 4, because the profit itself is under ${h.m(h.T.lpl)}.` },
      { q: 'Can I use the £1,000 trading allowance if I have a job?', a: `Yes, a job does not stop you. The allowance covers the first ${h.m(P.tradingAllowance.amount)} of gross trading income; under it you need not register. HMRC excludes income from your own employer or your spouse’s employer, or from a company or partnership you are connected with. Above it, you choose between the allowance and real expenses.` },
      { q: 'Is a Scottish employee with a side business taxed differently?', a: `Yes on the Income Tax, no on Class 4. A Scot on ${h.m(32000)} with ${h.m(8000)} of side profit pays ${h.m(sc.saBill)} through Self Assessment, because the salary already reaches the ${h.pc(P.incomeTax.scotland.bands[2].rate)} intermediate band, which starts at ${h.m(h.T.scotIntermediateFrom)}, and the side profit is taxed there rather than at ${h.pc(P.incomeTax.ruk.bands[0].rate)}. Class 4 is still nil below ${h.m(h.T.lpl)} of profit.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const rows = [[20000, 6000], [32000, 8000], [32000, 15000], [48000, 6000], [60000, 12000]].map(([w, p]) => {
      const r = h.E.selfEmployed({ profit: p, employment: w, region: 'ruk' });
      return [h.m(w), h.m(p), h.m(r.itViaSA), h.m(r.class4.total), h.m(r.saBill), h.pc(Math.round((r.saBill / p) * 1000) / 1000)];
    });
    const tiny = h.E.tradingAllowance(1800, 300);
    const cal = h.E.saCalendar(P.year);
    const hi = h.E.selfEmployed({ profit: 12000, employment: 60000, region: 'ruk' });
    const poa = h.E.selfEmployed({ profit: 4000, employment: 32000, region: 'ruk' });
    return `
<h2>The salary goes first</h2>
<p>GOV.UK is explicit that you can be employed and self-employed at the same time (${h.src('gov_set_up_sole_trader', 'GOV.UK, set up as a sole trader')}). For Income Tax, the two incomes are simply added together. In practice the job is taxed first, because PAYE gives you the Personal Allowance through your tax code, month by month. By the time HMRC looks at the side profit on your return, the allowance has gone and part of the basic band has been used. The side profit therefore starts at whatever rate your salary reached: ${h.pc(P.incomeTax.ruk.bands[0].rate)} for most employees, ${h.pc(P.incomeTax.ruk.bands[1].rate)} once total income passes ${h.m(h.T.basicTo)} (${h.src('gov_income_tax_rates', 'GOV.UK, Income Tax rates')}).</p>
<p>This is the single biggest surprise for people starting a side business. A full-time sole trader with ${h.m(8000)} of profit would pay no tax at all; an employee with the same side profit pays tax on every pound of it.</p>

<h2>Two kinds of National Insurance, kept apart</h2>
<p>National Insurance works the other way. Class 1 is deducted from wages by payroll, and Class 4 is charged on trading profit through Self Assessment, each on its own income (${h.src('gov_se_nic', 'GOV.UK, self-employed National Insurance rates')}). Class 4 has its own lower limit of ${h.m(h.T.lpl)} that applies to the profit alone, so a side business making less than that pays no Class 4 whatever the salary. Above it, the rate is ${h.pc(P.class4.mainRate)}. Class 2 is no longer charged, and a job paying above the lower earnings limit already gives you the year on your record.</p>
${h.table(['Salary', 'Side profit', 'Income Tax on it', 'Class 4', 'Extra bill', 'Share of profit'], rows, `England, Wales or Northern Ireland, ${P.taxYear}, standard tax code, no student loan.`, ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>The last column is the share of each side pound to put aside. It is far higher than what the same profit would cost on its own, and it reaches ${h.pc(Math.round((hi.saBill / 12000) * 1000) / 1000)} when the salary is already in the higher-rate band.</p>

<h2>Small side income and the trading allowance</h2>
<p>The first ${h.m(P.tradingAllowance.amount)} of gross trading income in a tax year is covered by the trading allowance (${h.src('gov_trading_allowance', 'HMRC, tax-free allowances on trading income')}). If your takings stay at or under that figure, there is nothing to report and no need to register. Above it, you must register, and on the return you choose: deduct the allowance, or deduct real expenses, never both. A tutor taking ${h.m(1800)} a year with ${h.m(300)} of costs is taxed on ${h.m(tiny.profit)} by using the allowance, rather than ${h.m(tiny.withExpenses)} with real costs. The ${h.a('trading-allowance', 'trading allowance calculator')} makes the comparison for any figures.</p>
<p>One exception catches people out: you cannot use the allowance on income from your employer, your spouse’s or civil partner’s employer, or a company or partnership you or someone connected to you controls. Extra work billed to your own employer gets no allowance, whatever its size.</p>

<h2>Registering and filing</h2>
<p>Once gross side takings pass ${h.m(P.tradingAllowance.amount)}, register for Self Assessment by ${P.selfAssessment.registerBy} after the end of the tax year in which you started. For a business started in ${P.taxYear}, that means ${h.date(cal.registerBy)}, with the return and payment due by ${h.date(cal.online)}. The ${h.a('register-as-self-employed', 'registration page')} lists the steps.</p>
${h.box('Paying through your tax code', `<p>Employees have an extra option. If you file online by ${h.date(cal.codingOut)}, HMRC can collect the balance through your tax code instead of in one January payment (${h.src('gov_sa_deadlines', 'GOV.UK, Self Assessment deadlines')}).</p>`, 'tip')}
<p>Payments on account are less common for employees. They are not set if more than ${h.pc(P.paymentsOnAccount.atSourceShare)} of your tax was taken at source, or if the Self Assessment bill is under ${h.m(P.paymentsOnAccount.minBill)}. A ${h.m(32000)} salary plus ${h.m(4000)} of side profit produces a bill of ${h.m(poa.saBill)}, ${poa.poaDue ? 'enough to trigger them' : 'which triggers none'}. To see the whole calculation as HMRC lays it out, with dividends and PAYE, use the ${h.a('self-assessment-tax-calculator', 'Self Assessment calculator')}.</p>`;
  },
});
