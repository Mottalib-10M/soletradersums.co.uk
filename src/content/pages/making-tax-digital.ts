import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'making-tax-digital',
  group: 'mtd',
  order: 30,
  tool: { kind: 'mtd', props: { se: 38000 } },
  related: ['mtd-qualifying-income', 'mtd-quarterly-deadlines', 'mtd-penalties', 'making-tax-digital-software'],
  sources: ['gov_mtd_when', 'gov_mtd_overview', 'gov_mtd_qualifying', 'gov_mtd_exempt', 'gov_mtd_quarterly'],
  slug: 'making-tax-digital',
  nav: 'Making Tax Digital checker',
  card: 'Your MTD for Income Tax start date from turnover and rents, year by year, with exemptions and letters.',
  title: 'Making Tax Digital for Income Tax: Self-Employed Checker',
  description: 'Making Tax Digital for Income Tax: check your start date from turnover and rents, see what changes for sole traders, what stays the same and who is exempt.',
  h1: 'Making Tax Digital for Income Tax: when it starts for you',
  intro: 'Type your turnover and rents for each year and the checker gives the April you join, if you join at all.',
  resume: (h) => {
    const S = h.P.mtd.stages;
    const ex = h.E.mtdStart({ y2425: 34000, y2526: 34000, y2627: 34000 });
    return `Making Tax Digital for Income Tax (MTD) reaches sole traders and landlords in three waves, decided by qualifying income: turnover from self-employment plus gross rents, before any expense. Over ${h.m(S[0].threshold)} in ${S[0].basisYear} and you started on ${h.date(S[0].start)}; over ${h.m(S[1].threshold)} in ${S[1].basisYear} and you start on ${h.date(S[1].start)}; over ${h.m(S[2].threshold)} in ${S[2].basisYear} and the date is ${h.date(S[2].start)}. A mobile hairdresser taking ${h.m(34000)} a year therefore joins on ${ex ? h.date(ex.start) : 'no date'}, whatever her profit. Wages, dividends, pensions and a partner’s share of partnership profit are left out of the test. Once in, you keep digital records in compatible software, send a cumulative update every quarter and file the year’s return through the same software by ${h.P.paymentsOnAccount.dueFirst}. The tax itself, the payment dates and payments on account do not change. Enter your figures for each year and the checker shows the first April that applies.`;
  },
  faqs: (h) => {
    const S = h.P.mtd.stages;
    return [
      { q: 'When does Making Tax Digital start for sole traders?', a: `It depends on the turnover in an earlier return. Over ${h.m(S[0].threshold)} in ${S[0].basisYear} means ${h.date(S[0].start)}; over ${h.m(S[1].threshold)} in ${S[1].basisYear} means ${h.date(S[1].start)}; over ${h.m(S[2].threshold)} in ${S[2].basisYear} means ${h.date(S[2].start)}. Each test uses the return filed in the year before the start, so you know roughly a year ahead.` },
      { q: 'Do I still file a Self Assessment tax return under MTD?', a: `Yes, one a year, by ${h.date(h.E.saCalendar(2026).online)} for ${h.P.taxYear}, but it goes through your compatible software rather than the old online form. You add other income such as savings interest or dividends, confirm the figures and submit. The return for the year before you join is filed the usual way.` },
      { q: 'I have not had a letter from HMRC about MTD, do I still need to sign up?', a: `Yes. HMRC writes after checking each return, but its guidance says the duty to check and sign up stays with you even without a letter. If your turnover plus rents was above ${h.m(S[1].threshold)} in ${S[1].basisYear}, plan to start on ${h.date(S[1].start)} and sign up beforehand. If you think a letter is wrong, contact HMRC.` },
      { q: 'Can I be exempt from Making Tax Digital because of my age?', a: `Only if age, health or disability makes it unreasonable for you to use a computer, tablet or phone for your records. That is the digitally excluded exemption, and you have to apply for it. Being used to paper, having few records or facing extra cost are not accepted on their own. Qualifying income of ${h.m(S[2].threshold)} or less is exempt automatically.` },
    ];
  },
  body: (h) => {
    const P = h.P, S = P.mtd.stages;
    const rows = S.map((s) => [s.basisYear, `over ${h.m(s.threshold)}`, h.date(s.start)]);
    const cases = [
      { who: 'Courier, turnover only', q: 52000 },
      { who: 'Tutor with a rented flat', q: 19000 + 13000 },
      { who: 'Designer, part-time', q: 24000 },
      { who: 'Weekend market trader', q: 15000 },
    ].map((c) => { const r = h.E.mtdStart({ y2425: c.q, y2526: c.q, y2627: c.q }); return [c.who, h.m(c.q), r ? h.date(r.start) : 'not required']; });
    const first = P.mtd.quarters[0];
    return `
<h2>Who is brought in</h2>
<p>MTD for Income Tax is a new way of doing Self Assessment, not a new tax. It applies to individuals who are registered for Self Assessment, have filed a return, and receive income as a sole trader, as a landlord or as both. Partnerships are outside it for now; HMRC has said it will give their timetable later.</p>
<p>The trigger is qualifying income, which HMRC reads from the return you sent the year before the start. Three thresholds apply in turn:</p>
${h.table(['Return for', 'Qualifying income', 'Start date'], rows, 'Thresholds and start dates published by HMRC.', ['l', 'r', 'r'])}
<p>The word “over” matters: someone at exactly ${h.m(S[0].threshold)} in ${S[0].basisYear} was not caught by the first wave. Turnover is the gross figure, so two businesses with the same profit can land in different waves. Here is how the checker places four typical cases, assuming the same takings every year:</p>
${h.table(['Example', 'Turnover plus rents', 'First MTD year from'], cases, 'Same figures in each basis year, no exemption.', ['l', 'r', 'r'])}
<p>The details of what counts, from jointly owned lets to a first year of trading that HMRC scales up to twelve months, are on the ${h.a('mtd-qualifying-income', 'qualifying income page')}.</p>
<h2>The letter from HMRC</h2>
<p>After each Self Assessment return is processed, HMRC compares your turnover and rents with the threshold that follows. If you are over it, a letter arrives saying you must use MTD from the start of the next tax year. Silence is not a pass, though. The guidance puts the responsibility on you to check, sign up and have software ready, whether or not the letter comes. To sign up you need to be registered for Self Assessment and to have sent a return in the last two years. If you believe HMRC has got it wrong, for example because a business has closed, you contact them; when all self-employment and property income has stopped, telling HMRC early prevents an automatic sign-up.</p>
<h2>Getting ready before the start date</h2>
<p>HMRC suggests an order. Confirm that you are in and not exempt, pick software that covers every business you run, then sign up and authorise that product (or let your agent do it). Records begin on the first day of the MTD year: ${P.mtd.quarters[0].standard.split(' to ')[0]} for most people, ${P.mtd.quarters[0].calendar.split(' to ')[0]} if your accounts run to ${P.mtd.quarters[3].calendar.split(' to ')[1]}. Take a self-employed electrician due to start on ${h.date(S[1].start)}: the return for ${S[1].basisYear}, and for ${P.taxYear} after it, is still filed the old way, while every invoice and receipt from that April onwards goes into the new software.</p>
<h2>What changes once you join</h2>
<p>Three habits are new. First, every sale and every cost of the business is recorded digitally, with its date, amount and Self Assessment category, in software that can talk to HMRC (spreadsheets linked through bridging software count). The ${h.a('making-tax-digital-software', 'software guide')} explains what the product must do. Second, four times a year the software adds up those records and sends a cumulative summary from the start of the tax year: the first one, for ${first.standard}, is due by ${first.deadline}, and the full calendar sits on the ${h.a('mtd-quarterly-deadlines', 'quarterly deadlines page')}. Third, the year-end return is finished and submitted in the same software, with any other income added.</p>
<p>Penalties change too. Late filing becomes a points system and late payment a sliding percentage. For ${P.mtd.penalties.noQuarterlyPointsYear}, a late quarterly update earns no point at all. The figures are worked through on the ${h.a('mtd-penalties', 'MTD penalties page')}.</p>
${h.box('What does not move', `<p>You still pay Income Tax and Class 4 on the year’s profit, and the bill is still due by ${P.paymentsOnAccount.dueFirst} after the year ends, with ${h.a('payments-on-account', 'payments on account')} on the usual dates. The quarterly figures are summaries, not tax returns, and they do not create a bill of their own. You do not have to make accounting adjustments before sending one.</p>`, 'info')}
<h2>Exemptions</h2>
<p>Some people are left out automatically, without applying. Qualifying income of ${h.m(S[2].threshold)} or less is the obvious case. Having no National Insurance number before the tax year begins is another. Trusts, non-resident companies and personal representatives acting for someone who has died are exempt in that role. Ministers of religion filing the SA102M page, Lloyd’s members and people claiming Married Couple’s or Blind Person’s Allowance are exempt beyond ${h.date(S[1].start)}. A shorter, automatic exemption covered ${P.taxYear} for returns showing averaging relief, qualifying care relief (foster and kinship carers), trust income on SA107 or the residence pages SA109.</p>
<p>Others must apply. The main route is digital exclusion: age, health, disability, a religious belief incompatible with digital records, or a location with no internet access at home, at work or anywhere suitable. HMRC rejects applications whose only reason is a preference for paper, unfamiliarity with accounting software, a small number of records or the time and cost involved. A VAT trader already excused from MTD for VAT on these grounds can ask Self Assessment enquiries to confirm the same for Income Tax.</p>
<h2>Leaving again</h2>
<p>Joining is not for life. If your qualifying income stays below the relevant threshold for ${P.mtd.optOutYears} tax years in a row, you can choose to opt out. Closing every self-employment and property source before the year you were due to start also takes you out, provided HMRC knows about it; if you amend an earlier return and the corrected figure falls below the line, you can stop or carry on voluntarily.</p>`;
  },
});
