import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'mtd-qualifying-income',
  group: 'mtd',
  order: 33,
  tool: { kind: 'mini:qualifying', props: { se: 26000, prop: 9000, year: 1 } },
  related: ['making-tax-digital', 'employed-and-self-employed', 'cash-basis', 'making-tax-digital-software'],
  sources: ['gov_mtd_qualifying', 'gov_mtd_when', 'gov_mtd_exempt', 'gov_mtd_overview'],
  slug: 'mtd-qualifying-income',
  nav: 'Qualifying income',
  card: 'Gross takings plus your share of rents: what counts towards the MTD threshold and what is left out.',
  title: 'MTD Qualifying Income: Turnover, Rents and What Is Excluded',
  description: 'Qualifying income for Making Tax Digital: gross turnover plus your share of rents, why profit is ignored, what is excluded and how a short first year is scaled.',
  h1: 'Qualifying income for Making Tax Digital',
  intro: 'The figure that decides MTD is your takings before costs, not the profit you pay tax on.',
  resume: (h) => {
    const S = h.P.mtd.stages;
    const q = 26000 + 9000, r = h.E.mtdStart({ y2425: q, y2526: q, y2627: q });
    return `Qualifying income for Making Tax Digital is your self-employment turnover plus your share of gross rents, both taken before any expense, as shown on the previous year’s Self Assessment return. A van driver with ${h.m(26000)} of delivery fees and ${h.m(9000)} of rent from a buy-to-let has ${h.m(q)} of qualifying income: over the ${h.m(S[1].threshold)} test for ${S[1].basisYear}, so MTD applies from ${r ? h.date(r.start) : 'no date'}, even if fuel, insurance and mortgage interest leave a much smaller profit. Each business is counted, including one that closed during the year if another carries on. Employment income, dividends, State and private pensions and a share of partnership profit are not counted. HMRC scales a short first year of trading up to twelve months, and once you are in, ${h.P.mtd.optOutYears} years in a row under the threshold let you leave. Enter turnover and rents to compare them with each year’s threshold.`;
  },
  faqs: (h) => {
    const S = h.P.mtd.stages;
    return [
      { q: 'Is MTD qualifying income based on turnover or profit?', a: `Turnover. It is the total of your self-employment income and property income before expenses. A roofer with ${h.m(42000)} of sales and ${h.m(15000)} of materials makes ${h.m(42000 - 15000)} of profit but has ${h.m(42000)} of qualifying income, which is over the ${h.m(S[1].threshold)} threshold that applies to ${S[1].basisYear} returns.` },
      { q: 'Does my salary count towards the Making Tax Digital threshold?', a: `No. PAYE earnings are ignored, however large. A nurse earning ${h.m(45000)} with ${h.m(12000)} of weekend photography sales has qualifying income of ${h.m(12000)}, below even the ${h.m(S[2].threshold)} threshold. The salary still belongs on the tax return, and HMRC fills it in on the MTD return from its own PAYE records for you to check.` },
      { q: 'How do I count a jointly owned rental property for MTD?', a: `You count your own share of the gross rent. Two siblings who each take half of ${h.m(30000)} a year in rent each have ${h.m(15000)} of qualifying income from it. If you only learn your share after costs have been taken off, HMRC uses that net figure instead.` },
      { q: 'How is qualifying income worked out if I started trading mid-year?', a: `For a sole trader, HMRC annualises it when it has the information. Six months of trading with ${h.m(16000)} of takings becomes ${h.m(16000 * 2)} for the test, which is over ${h.m(S[1].threshold)}. Landlords with a short year must do that scaling themselves when checking whether they are in.` },
    ];
  },
  body: (h) => {
    const S = h.P.mtd.stages;
    const ex = [
      ['Hair salon owner', 61000, 38000, 0],
      ['Freelance copywriter', 29000, 2500, 0],
      ['Childminder with a let flat', 14000, 4000, 8400],
      ['Online reseller', 33000, 21000, 0],
    ].map(([who, t, e, rent]) => { const q = (t as number) + (rent as number); const r = h.E.mtdStart({ y2425: q, y2526: q, y2627: q });
      return [who as string, h.m(t as number), h.m((t as number) - (e as number)), h.m(rent as number), h.m(q), r ? h.date(r.start) : 'not required']; });
    return `
<h2>Gross takings, not the profit on your tax bill</h2>
<p>Most self-employed people think in terms of profit, because that is what Income Tax and Class 4 are charged on. MTD ignores it. HMRC adds the turnover of each self-employment to the gross rents of each property business and compares the total with the threshold for that year. Two traders with identical profit can therefore be treated very differently:</p>
${h.table(['Example', 'Turnover', 'Profit', 'Rent share', 'Qualifying income', 'MTD from'], ex, 'Same figures assumed in every basis year.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The reseller and the copywriter end up with similar profits, yet the reseller’s stock purchases do nothing to lower the figure MTD looks at. Businesses with heavy costs, such as builders, retailers and couriers, cross the line much sooner than their profit suggests.</p>
<h2>Income that is left out</h2>
<p>Only trading and property income counts. Wages taxed through PAYE, dividends (including those paid by your own company), the State Pension and private pensions are all outside the figure, and so is a share of profit from a partnership in which you are an individual partner. That partnership income still goes on your return, through the software, but you do not keep digital records or send updates for it. Several narrower items are also excluded: transition profits spread over five years after the basis period reform, qualifying care relief received by foster and kinship carers, distributions from UK REITs and property authorised investment funds, and a one-off profit from dealing in UK land that does not continue into another year.</p>
${h.box('A VAT detail on the cash basis', `<p>A VAT-registered trader on the ${h.a('cash-basis', 'cash basis')} may declare income with or without VAT. If the return includes VAT, that VAT is part of qualifying income too, which can be enough to tip someone just under a threshold over it.</p>`, 'warning')}
<h2>Closed businesses and corrected returns</h2>
<p>A source that stopped still counts if another one carries on. A self-employed physiotherapist who sold a rental flat in the basis year keeps that year’s rent in the total because the trade continues. If every self-employment and property source had ended before ${h.date(S[0].start)}, MTD does not apply; telling HMRC before it signs you up based on old figures saves a correction later. Amending a return also matters. A change made before the tax year begins can bring you in or take you out for that year. A change made after it begins can take you out, but cannot bring you in for that year.</p>
<h2>Living abroad, or with income abroad</h2>
<p>For someone who was UK resident in ${S[0].basisYear}, foreign rents count alongside UK turnover: a UK sole trader letting a flat in France adds both. For a non-resident, only UK property income and self-employment income declared on the UK return are counted. People who file the SA109 residence pages should also read the ${h.a('making-tax-digital', 'exemptions on the main MTD page')}, since filing those pages brought a temporary exemption for ${h.P.taxYear}.</p>
<h2>Falling back under the line</h2>
<p>Dropping below the threshold once does not take you out. You may opt out after ${h.P.mtd.optOutYears} consecutive tax years under the relevant figure, or keep using the service voluntarily. Someone who moves into a job and keeps a little freelance work alongside it can check the effect on the bill with the ${h.a('employed-and-self-employed', 'job plus self-employment calculator')}.</p>`;
  },
});
