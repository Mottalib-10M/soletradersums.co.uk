import { definePage } from '../../lib/guide-types';

/** ISO date helpers for the worked examples (UTC, no time zone drift). */
const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
const monthEnd = (iso: string) => { const [y, m] = iso.split('-').map(Number); return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); };
const secondMonthStart = (iso: string) => { const [y, m] = iso.split('-').map(Number); return new Date(Date.UTC(y, m + 1, 1)).toISOString().slice(0, 10); };

export default definePage({
  id: 'vat-threshold-sole-trader',
  group: 'admin',
  order: 15,
  tool: { kind: 'mini:vat', props: { last12: 84000, next30: 9000 } },
  related: ['self-employed-tax-on-90000', 'register-as-self-employed', 'mtd-qualifying-income', 'self-employed-expenses'],
  sources: ['gov_vat_registration', 'gov_set_up_sole_trader', 'gov_mtd_penalties', 'gov_mtd_qualifying'],
  slug: 'vat-threshold-sole-trader',
  nav: 'VAT threshold',
  card: 'The £90,000 rolling test, the 30-day forward test, when to register and what voluntary registration means.',
  title: 'VAT Threshold for Sole Traders 2026/27: UK £90,000 Rule',
  description: 'VAT threshold for sole traders: £90,000 of taxable turnover over any rolling 12 months or the next 30 days alone, the 30-day deadline, voluntary registration.',
  h1: 'The VAT registration threshold for sole traders',
  intro: 'VAT looks at what you sell, not what you keep, and it counts any twelve months in a row rather than the tax year.',
  resume: (h) => {
    const V = h.P.vat;
    const monthly = 7600;
    return `A sole trader who invoices ${h.m(monthly)} a month reaches ${h.m(monthly * 12)} over twelve months, which is above the ${h.m(V.threshold)} VAT registration threshold, so registration becomes compulsory. Two tests apply, and either is enough. The backward test adds up taxable turnover for the last twelve months, on a rolling basis, at the end of every month: not the tax year, not your accounting year. The forward test asks whether sales in the next 30 days alone will go over ${h.m(V.threshold)}, which mostly matters when a single large contract lands. Pass the backward test and you have ${V.daysToRegister} days from the end of that month to register. Turnover means sales before expenses, so a profitable plumber and a busy one with thin margins are judged on the same figure. Below the threshold, registering is optional. Type your figures below to see where you stand.`;
  },
  faqs: (h) => {
    const V = h.P.vat;
    return [
      { q: 'Is the VAT threshold based on the tax year?', a: `No. The ${h.m(V.threshold)} test is applied to the last twelve months at the end of each month, so it rolls forward all year. A carpenter whose turnover from May to April comes to ${h.m(91000)} must register even if the April to April figure for the tax return is only ${h.m(88000)}. Checking the running total monthly is the only reliable way to catch it.` },
      { q: 'Do zero-rated sales count towards the £90,000 VAT threshold?', a: `Yes. Taxable turnover includes zero-rated and reduced-rated sales as well as standard-rated ones. Only VAT exempt and out of scope supplies are left out. A business selling mostly zero-rated goods and going over ${h.m(V.threshold)} must still register, unless HMRC grants an exemption from registration, which you have to ask for.` },
      { q: 'When do I start charging VAT after going over the threshold?', a: `From your effective date of registration. On the backward test this is the first day of the second month after the month you went over: cross ${h.m(V.threshold)} in March and it is 1 May. GOV.UK states that you owe VAT from the date HMRC registers you, so prices or invoices need to account for it from then.` },
      { q: 'Can a sole trader register for VAT below the threshold?', a: `Yes, voluntary registration is open to anyone whose taxable turnover is under ${h.m(V.threshold)}. The usual reason is to reclaim VAT on business purchases. The obligations are the same as for compulsory registration: you charge VAT from the effective date, file VAT returns and pay what you owe.` },
    ];
  },
  body: (h) => {
    const V = h.P.vat;
    const crossed = '2027-03-20';
    const regBy = addDays(monthEnd(crossed), V.daysToRegister), eff = secondMonthStart(crossed);
    const signed = '2026-06-03', fwdBy = addDays(signed, V.daysToRegister - 1);
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const sales = [6200, 6800, 7900, 8400, 5100, 7300, 7700, 8100, 9600, 6000, 7400, 9900];
    let run = 0;
    const rows = months.map((m, i) => { run += sales[i]; return [m, h.m(sales[i]), h.m(run), run > V.threshold ? 'over' : h.m(V.threshold - run)]; }).slice(8);
    const total = sales.reduce((a, b) => a + b, 0);
    const p = h.E.selfEmployed({ profit: total - 30000, region: 'ruk' });
    return `
<h2>Counting taxable turnover</h2>
<p>Taxable turnover is everything you sell that is not VAT exempt or outside the scope of VAT. Zero-rated items count, reduced-rated items count, and so do some less obvious things: goods you hire out, business goods taken for personal use, goods bartered, part-exchanged or given away, and services bought from abroad under the reverse charge (${h.src('gov_vat_registration', 'GOV.UK, when to register for VAT')}). What does not count is income that is exempt, so a trader whose sales are wholly exempt never has to register on this test.</p>
<p>The figure is sales, before any costs. That is the trap for trades with heavy materials. A kitchen fitter turning over ${h.m(total)} with ${h.m(30000)} of materials and van costs has ${h.m(total - 30000)} of profit, on which the income tax and Class 4 bill is ${h.m(p.saBill)}, yet VAT is judged on the ${h.m(total)}.</p>
<h2>A rolling total, month by month</h2>
<p>Here is that kitchen fitter in a first trading year. The total is checked at the end of each month; the last four months tell the story.</p>
${h.table(['Month', 'Sales in the month', 'Running 12-month total', 'Room under the threshold'], rows, `Taxable turnover from the start of trading, threshold ${h.m(V.threshold)}.`, ['l', 'r', 'r', 'r'])}
<p>${run > V.threshold ? `The running total goes over in the last month shown, and from then on the obligation to register applies.` : `The fitter stays under for now, but in the second year each new month replaces an old one, and a busy spring can tip the total over in any month, not only at the year end.`} Once trading has gone on for more than a year, the oldest month drops out as each new month comes in, which is why a seasonal business can cross in summer and fall back below by winter.</p>
<h2>Deadlines once you are over</h2>
<h3>The backward test</h3>
<p>Register within ${V.daysToRegister} days of the end of the month in which the twelve-month total went over. Your effective date, from which you charge and owe VAT, is the first day of the second month after. A designer whose total goes over on ${h.date(crossed)} must register by ${h.date(regBy)} and is VAT registered from ${h.date(eff)}.</p>
<h3>The forward test</h3>
<p>If you realise that sales in the next 30 days on their own will exceed ${h.m(V.threshold)}, you register by the end of that 30-day period, and the effective date is the day you realised, not the day the money arrives. A builder who signs a large contract on ${h.date(signed)} that will be paid within the month registers by ${h.date(fwdBy)}, VAT registered from ${h.date(signed)}.</p>
${h.box('Registering late', `<p>Late registration does not cancel the VAT: you owe it on the sales made since the date you should have been registered, even if you did not charge it to customers, and a penalty may be added depending on the amount and the delay. If turnover went over only briefly, HMRC can grant an exception, but you have to apply and wait for its answer.</p>`, 'warning')}
<h2>Voluntary registration</h2>
<p>You can register with turnover under ${h.m(V.threshold)}. GOV.UK mentions reclaiming VAT on business expenses as the reason to register early (${h.src('gov_set_up_sole_trader', 'GOV.UK, set up as a sole trader')}). The trade-off depends on who buys from you. A graphic designer working for VAT-registered companies adds VAT to invoices that clients are themselves accounting for; a dog groomer selling to the public has to choose between higher prices and a thinner margin. Once registered, the rules on returns and payment are the same as for compulsory registration.</p>
<h2>VAT and Making Tax Digital for Income Tax</h2>
<p>These are two separate systems. Making Tax Digital for Income Tax is triggered by qualifying income, also measured on turnover but over a tax year and with lower thresholds; the ${h.a('mtd-qualifying-income', 'qualifying income page')} explains the count. If you are in both, the penalty points for late Income Tax submissions are kept separate from your VAT points (${h.src('gov_mtd_penalties', 'HMRC, MTD penalties')}). The ${h.a('self-employed-tax-on-90000', '£90,000 profit page')} shows the income tax side for a business near this size.</p>`;
  },
});
