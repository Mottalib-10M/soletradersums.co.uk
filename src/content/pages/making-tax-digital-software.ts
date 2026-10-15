import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'making-tax-digital-software',
  group: 'mtd',
  order: 34,
  mini: { kind: 'mini:software', props: { se: 1, prop: 0 } },
  related: ['making-tax-digital', 'mtd-quarterly-deadlines', 'self-assessment-tax-return', 'self-employed-expenses'],
  sources: ['gov_mtd_software', 'gov_mtd_overview', 'gov_mtd_quarterly', 'gov_mtd_when'],
  slug: 'making-tax-digital-software',
  nav: 'MTD software',
  card: 'What compatible software has to do, bridging for spreadsheets, and how to use HMRC’s own finder.',
  title: 'Making Tax Digital Software: Requirements for Sole Traders',
  description: 'Making Tax Digital software explained: what a compatible product must do, bridging software for spreadsheets, using HMRC’s finder and features to check.',
  h1: 'Making Tax Digital software: what it must do',
  intro: 'HMRC does not supply MTD software and neither do we recommend any; here is what a product has to handle.',
  resume: (h) => {
    const S = h.P.mtd.stages;
    return `Making Tax Digital for Income Tax needs commercial software that HMRC recognises, used by you or your agent to do three jobs: keep digital records of self-employment and property income and expenses, send a quarterly update for each business, and file the year’s return by ${h.P.paymentsOnAccount.dueFirst} after adding any other income. A sole trader with one trade therefore makes ${4 * 1} quarterly submissions and one return a year; a sole trader who also lets a property makes ${4 * 2} updates. Anyone who joined on ${h.date(S[0].start)}, or joins on ${h.date(S[1].start)} with qualifying income over ${h.m(S[1].threshold)}, needs it in place before signing up. Spreadsheets remain allowed if they are linked to bridging software that makes the submissions. HMRC runs a software finder listing products that passed its recognition process, and states plainly that it recommends none of them. This guide sets out the requirements and the checks worth making; it names no product.`;
  },
  faqs: (h) => [
    { q: 'Does HMRC provide free MTD software?', a: `No, HMRC does not supply its own software. Products listed in its finder come from commercial developers, and HMRC notes that some are free for people with simple tax affairs, usually with limits such as a cap on the number of transactions. Compare any such limit with your own volume of sales and costs, and with the ${4 * 2} updates a year that a trade plus a letting requires.` },
    { q: 'Can I keep using spreadsheets under Making Tax Digital?', a: `Yes. HMRC accepts records kept in a spreadsheet as long as bridging software connects to them and sends the quarterly updates and the return. The spreadsheet must hold each transaction with its amount, date and category. Check that the bridging product also handles the final return, since HMRC says only some of them do.` },
    { q: 'Can I use two different software products for MTD?', a: `Yes, as long as each separate submission goes through one product. A builder who is also a landlord could run one product for the trade and another for the lettings, or one product for records and updates and a second for the return. Two products cannot share the updates of the same property business.` },
    { q: 'Does my VAT software work for MTD for Income Tax?', a: `Not automatically. A VAT-registered trader already uses software for VAT returns, but HMRC asks you to check that the same product supports Income Tax updates and the yearly return, or that a new product also covers VAT. The ${h.m(h.P.vat.threshold)} VAT threshold and MTD for Income Tax are separate tests.` },
    { q: 'Can I claim a tax refund through MTD software?', a: `Not through the MTD return itself. HMRC’s guidance says a refund cannot be claimed in a tax return submitted through Making Tax Digital for Income Tax; it points to a separate route in its help pages. The return still shows the calculation, so a plumber who overpaid through CIS deductions will see the figure before submitting.` },
  ],
  body: (h) => {
    const P = h.P, Q = P.mtd.quarters;
    const rows = [
      ['One trade', '1', String(4 * 1), '1'],
      ['One trade and one property business', '2', String(4 * 2), '1'],
      ['Two trades and one property business', '3', String(4 * 3), '1'],
    ];
    return `
<h2>Three jobs the software has to do</h2>
<p>HMRC frames the requirement around tasks rather than brands. Whatever you use, alone or through an accountant, has to cover all of these:</p>
<ol>
<li>create, store and correct digital records of income and expenses for each self-employment and property business;</li>
<li>send the quarterly updates, the cumulative summaries due on ${Q[0].deadline}, ${Q[1].deadline}, ${Q[2].deadline} and ${Q[3].deadline};</li>
<li>bring in your other income and submit the tax return after the year ends.</li>
</ol>
<p>A digital record is a single entry for a sale or a cost, holding three things: the amount, the date it was received or incurred, and the Self Assessment category it belongs to (HMRC uses the same categories as on the Self Assessment pages). Only the business and property side needs these records. Savings interest, dividends, pensions and a share of partnership profit do not, though they still have to reach the return through the software.</p>
<h2>Two kinds of product</h2>
<p>HMRC sorts compatible software into two families. The first creates the records itself. Entries are typed in by hand, read from a photographed receipt or imported from a business bank account feed, and such products usually send the updates and the return as well. The second family connects to records you already keep elsewhere, most often a spreadsheet; HMRC calls this bridging software. It reads the figures, builds the quarterly totals and transmits them. Some bridging products can also file the final return; some cannot, and then a second product is needed for the year end.</p>
<p>There is no rule that a bank feed or a phone app is required. A window cleaner who has kept a tidy spreadsheet for years can keep doing so, provided something recognised by HMRC sits between that spreadsheet and HMRC’s systems. What is no longer enough is a shoebox of receipts typed up once a year, because the quarterly totals have to be built from digital records held in, or linked to, compatible software.</p>
<h2>How many submissions you will make</h2>
<p>The count depends on how many businesses you report, not on how much you earn. Each self-employment and each property business gets its own four updates, while the return stays single.</p>
${h.table(['Situation', 'Businesses', 'Quarterly updates a year', 'Returns'], rows, 'Before any extra voluntary updates.', ['l', 'r', 'r', 'r'])}
<p>You may send updates more often if your product allows it, for example monthly to see how a big contract changes the estimate; each one still runs from the start of the tax year. Late updates carry no point in ${P.mtd.penalties.noQuarterlyPointsYear}, but count afterwards, as explained on the ${h.a('mtd-quarterly-deadlines', 'quarterly deadlines page')}.</p>
<h2>Using more than one product</h2>
<p>Mixing products is allowed, with one limit: each separate submission must go through a single product. A landlord cannot split the updates for one property business across two. Within that rule, a hairdresser who also lets a flat could keep the salon in one product and the letting in another, or someone could create records and send updates in one tool and file the return in a second. The burden of making the pieces fit falls on you, so check before the year starts that nothing falls between them, particularly the year-end return.</p>
<h2>Features to check before you sign up</h2>
<p>HMRC asks you to choose the software before signing up, and the sign-up steps include authorising it. Its checklist comes down to a few questions. Does the product support every income source you have: each trade, UK property, foreign property? Can it send both the updates and the return, or only one of them? Can it take in other income such as interest, dividends, pensions and employment, so the return is complete? Does it handle your accounting period, whether you follow the tax year to ${Q[3].standard.split(' to ')[1]}, use calendar periods to ${Q[3].calendar.split(' to ')[1]}, or neither?</p>
<p>A few further points depend on your situation. A VAT-registered trader should confirm that the product covers both regimes, or that one product can be used for each. Someone with more than one agent needs a product that allows that. HMRC also mentions a feature called HMRC Assist, which compares your figures with the data HMRC holds and flags likely errors before the return is filed. And if your affairs are about to change, say a sole trader thinking of letting a property, check that the product will cover the new income too.</p>
<p>Two settings deserve attention on day one. Calendar update periods are switched on inside the product, source by source, before the first update of the year is sent; after that, the setting is fixed until the next tax year. And once an update has gone, the product (or your HMRC online account) shows an estimated bill for the year, which is only as complete as the income it knows about, so adding savings or employment details early makes that estimate more useful.</p>
${h.box('Our position', `<p>Sole Trader Sums does not recommend, rank or link to any software product. The calculators on this site estimate tax; they do not file anything with HMRC.</p>`, 'info')}
<h2>HMRC’s software finder</h2>
<p>The official starting point is HMRC’s own guidance, ${h.src('gov_mtd_software', 'choose the right software for Making Tax Digital for Income Tax')}, which links to a finder tool. It asks a few questions about your income and the features you want, then produces a list. You can also search it for a product you already use to see whether it has been recognised for Income Tax. Every product on the list has been through HMRC’s recognition process; HMRC is explicit that it recommends no product or provider, and inclusion is not an endorsement.</p>
<h2>The year end inside the software</h2>
<p>After the fourth update, you make any accounting adjustments, claim allowances and reliefs (capital allowances or Rent-a-Room relief, for instance), and complete the return in the same software. HMRC pre-fills what it already knows: PAYE wages, the student or postgraduate loan plan, State, private and workplace pensions, taxable benefits, CIS deductions, residential property gains and Marriage Allowance. You check those and add the rest yourself, such as savings interest, dividends and a partnership share. The last step is a declaration that the figures are correct and complete, after which the software confirms submission. The deadline is ${h.date(h.E.saCalendar(2026).online)} for ${P.taxYear}, and later corrections are also made in the software, within twelve months of that deadline.</p>
<h2>When the software lets you down</h2>
<p>If the product will not show a calculation you can agree with, or refuses to submit, HMRC’s guidance says to go to the software provider first. If they cannot fix it and you still cannot confirm the calculation or file, tell HMRC as soon as possible. For a client represented by an agent, only the main agent can file the return, and the client must confirm the figures in writing first. The bill itself is worked out exactly as before; the ${h.a('self-assessment-tax-return', 'tax return guide')} and the list of ${h.a('self-employed-expenses', 'allowable expenses')} still apply in full.</p>`;
  },
});
