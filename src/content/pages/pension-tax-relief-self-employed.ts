import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'pension-tax-relief-self-employed',
  group: 'tax',
  order: 9,
  tool: { kind: 'mini:pension' },
  related: ['personal-allowance-taper', 'self-employed-tax-scotland', 'child-benefit-charge-self-employed', 'self-employed-tax-on-75000'],
  sources: ['gov_pension_relief', 'gov_income_tax_rates', 'gov_scottish_income_tax', 'leg_ita_35'],
  slug: 'pension-tax-relief-self-employed',
  nav: 'Pension tax relief',
  card: 'What a pension contribution really costs a sole trader: relief at source, the extra claimed on the return.',
  title: 'Pension Tax Relief for the Self-Employed 2026/27: Real Cost',
  description: 'Pension tax relief for sole traders in 2026/27: basic relief added by the provider, extra relief claimed on the return in rUK and Scotland, the £100,000 taper.',
  h1: 'Pension tax relief when self-employed',
  intro: 'A sole trader has no employer pension, so relief comes in two pieces: one added by the provider, the other claimed back on the tax return.',
  resume: (h) => {
    const P = h.P;
    const gross = 10000, profit = 70000;
    const base = h.E.incomeTax({ nonSavings: profit, region: 'ruk' }), w = h.E.incomeTax({ nonSavings: profit, region: 'ruk', pensionGross: gross });
    const src = gross * P.pension.basicRelief, sa = base.tax - w.tax;
    return `A sole trader in England, Wales or Northern Ireland with ${h.m(profit)} of profit who wants ${h.m(gross)} in a personal pension for ${P.taxYear} pays the provider ${h.m(gross - src)}; the provider claims ${h.m(src)} of basic-rate relief from HMRC and adds it to the pot. Because the top ${h.m(gross)} of that profit is taxed at ${h.pc(P.incomeTax.ruk.bands[1].rate)}, the Self Assessment return then cuts the tax bill by a further ${h.m(sa)}, so the contribution really costs ${h.m(gross - src - sa)}. This is relief at source, the method used by every personal and stakeholder pension. The extra relief is not automatic: you claim it by entering the contributions on your return. It is limited to the slice of income taxed above the basic rate, and the total of contributions that get relief cannot exceed your earnings for the year. Class 4 National Insurance is not reduced by a pension contribution. Scottish taxpayers claim extra relief in line with their own bands.`;
  },
  faqs: (h) => {
    const P = h.P;
    const S = P.incomeTax.scotland.bands;
    const t0 = h.E.incomeTax({ nonSavings: 110000, region: 'ruk' }), t1 = h.E.incomeTax({ nonSavings: 110000, region: 'ruk', pensionGross: 10000 });
    return [
      { q: 'Can a basic rate sole trader get pension tax relief?', a: `Yes, at ${h.pc(P.pension.basicRelief)}, without claiming anything. You pay ${h.m(800)} and the provider adds ${h.m(200)}, making ${h.m(1000)} in the pension. There is nothing more to claim on the return while your income stays under ${h.m(h.T.higherFrom)}. A Scottish starter-rate taxpayer still gets the full ${h.pc(P.pension.basicRelief)} and owes nothing back.` },
      { q: 'What extra pension relief can a Scottish self-employed person claim?', a: `On the return, ${h.pc(S[2].rate - P.pension.basicRelief)} on contributions up to the income taxed at ${h.pc(S[2].rate)}, ${h.pc(S[3].rate - P.pension.basicRelief)} up to the income taxed at ${h.pc(S[3].rate)}, ${h.pc(S[4].rate - P.pension.basicRelief)} at ${h.pc(S[4].rate)} and ${h.pc(S[5].rate - P.pension.basicRelief)} at ${h.pc(S[5].rate)}, on top of the ${h.pc(P.pension.basicRelief)} the provider adds. Each rate applies only up to the amount of income you actually paid at that rate, and you claim it on your Self Assessment return.` },
      { q: 'What does a £10,000 pension contribution save on £110,000 of profit?', a: `A lot, because of the taper. Gross contributions reduce adjusted net income, which decides the Personal Allowance taper. A sole trader on ${h.m(110000)} who pays ${h.m(10000)} gross gets the full allowance of ${h.m(h.T.pa)} back, and Income Tax falls from ${h.m(t0.tax)} to ${h.m(t1.tax)}, on top of the ${h.m(2000)} added by the provider.` },
      { q: 'Does paying into a pension reduce my Class 4 National Insurance?', a: `No. Class 4 is worked out on trading profit before any personal pension contribution, so ${h.m(60000)} of profit pays ${h.m(h.E.class4(60000).total)} of Class 4 whether you contribute nothing or ${h.m(20000)}. The relief applies only to Income Tax, which is why its value depends on your Income Tax band.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const R = P.incomeTax.ruk.bands, S = P.incomeTax.scotland.bands;
    const cost = (profit: number, gross: number, region: 'ruk' | 'scotland') => {
      const b = h.E.incomeTax({ nonSavings: profit, region }), w = h.E.incomeTax({ nonSavings: profit, region, pensionGross: gross });
      const src = gross * P.pension.basicRelief, sa = b.tax - w.tax;
      return { src, sa, net: gross - src - sa };
    };
    const rows = ([[30000, 'ruk'], [45000, 'scotland'], [60000, 'ruk'], [60000, 'scotland'], [110000, 'ruk'], [140000, 'scotland']] as Array<[number, 'ruk' | 'scotland']>).map(([p, r]) => {
      const c = cost(p, 5000, r);
      return [h.m(p), r === 'ruk' ? 'England, Wales, NI' : 'Scotland', h.m(c.src), h.m(c.sa), h.m(c.net)];
    });
    const tap = cost(110000, 10000, 'ruk');
    return `
<h2>Relief at source, step by step</h2>
<p>Personal and stakeholder pensions all use relief at source (${h.src('gov_pension_relief', 'GOV.UK, pension tax relief')}). You pay from money already taxed, the provider claims ${h.pc(P.pension.basicRelief)} from the government and tops up the pot, and that is the end of it for a basic-rate taxpayer. A self-employed electrician who transfers ${h.m(4000)} ends up with ${h.m(5000)} invested. Contributions that get relief are capped at your annual earnings, which for a sole trader means profit; someone with no earnings at all can still pay up to ${h.m(P.pension.noEarningsMax)} gross and receive basic relief on it.</p>
<p>Higher earners claim the rest on their Self Assessment return. In England, Wales and Northern Ireland the extra is ${h.pc(R[1].rate - P.pension.basicRelief)} on contributions up to the amount of income taxed at ${h.pc(R[1].rate)}, and ${h.pc(R[2].rate - P.pension.basicRelief)} up to the amount taxed at ${h.pc(R[2].rate)}. GOV.UK’s own example: someone with ${h.m(10000)} of income taxed at the higher rate who puts ${h.m(12000)} into a relief-at-source pension claims the extra on ${h.m(10000)} only, and nothing more on the other ${h.m(2000)}.</p>

<h2>What ${h.m(5000)} of contributions costs at different profits</h2>
${h.table(['Profit', 'Where you live', 'Added by provider', 'Cut in tax on return', 'Real cost'], rows, `Gross contribution of ${h.m(5000)}, sole trader with no other income, ${P.taxYear}.`, ['r', 'l', 'r', 'r', 'r'])}
<p>The pattern is clear: relief is worth most where your top slice of income is taxed hardest. The two Scottish rows show why Scottish higher earners pay closer attention to pensions. At ${h.m(45000)} a Scottish sole trader already has income in the ${h.pc(S[3].rate)} band (${h.src('gov_scottish_income_tax', 'GOV.UK, Income Tax in Scotland')}), so the return gives back ${h.pc(S[3].rate - P.pension.basicRelief)} on that slice, where an English trader on the same profit would claim nothing extra.</p>

<h2>Scottish taxpayers</h2>
<p>The provider adds ${h.pc(P.pension.basicRelief)} for everyone, including starter-rate taxpayers who pay only ${h.pc(S[0].rate)}; HMRC does not ask for the difference back. Above that, the extra claimed on the return follows the Scottish bands: ${h.pc(S[2].rate - P.pension.basicRelief)} for income taxed at the intermediate rate, ${h.pc(S[3].rate - P.pension.basicRelief)} at the higher rate, ${h.pc(S[4].rate - P.pension.basicRelief)} at the advanced rate and ${h.pc(S[5].rate - P.pension.basicRelief)} at the top rate. The ${h.a('self-employed-tax-scotland', 'Scotland page')} sets out where each band starts.</p>

<h2>Getting the Personal Allowance back</h2>
<p>From ${h.m(h.T.taperStart)} of adjusted net income the Personal Allowance falls by ${h.m(1)} for every ${h.m(2)} of income above it, under section 35 of the Income Tax Act 2007 (${h.src('leg_ita_35', 'legislation.gov.uk')}). Gross pension contributions are deducted in working out adjusted net income. A sole trader on ${h.m(110000)} who contributes ${h.m(10000)} gross recovers the full allowance: the provider adds ${h.m(tap.src)}, the return gives back ${h.m(tap.sa)}, and the contribution costs ${h.m(tap.net)}. The ${h.a('personal-allowance-taper', 'taper page')} explains the marginal rate in that band, and the same contribution also lowers the ${h.a('child-benefit-charge-self-employed', 'Child Benefit charge')} for incomes above ${h.m(P.hicbc.start)}.</p>
${h.box('What the relief does not touch', `<p>Class 4 National Insurance is charged on profit before pension contributions, so it does not change. Relief is also given only on contributions to a scheme registered with HMRC, and only up to your earnings for the year, which matters in a year with a low profit.</p>`, 'warning')}`;
  },
});
