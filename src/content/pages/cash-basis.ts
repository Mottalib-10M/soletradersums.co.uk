import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cash-basis',
  group: 'tax',
  order: 14,
  mini: { kind: 'mini:cash', props: { received: 42000, unpaid: 6000, paid: 7500, owed: 900 } },
  related: ['self-employed-expenses', 'simplified-expenses', 'payments-on-account', 'self-assessment-tax-return'],
  sources: ['gov_cash_basis', 'gov_expenses', 'gov_simplified_vehicles', 'gov_payments_on_account', 'gov_income_tax_rates', 'gov_cash_who'],
  slug: 'cash-basis',
  nav: 'Cash basis',
  card: 'The default since April 2024: profit is money in minus money out, and unpaid invoices wait.',
  title: 'Cash Basis for Sole Traders 2026/27: Default Rules Guide',
  description: 'Cash basis for sole traders in 2026/27: the default since April 2024, how unpaid invoices shift profit, who cannot use it, equipment and VAT, and opting out.',
  h1: 'Cash basis accounting for sole traders',
  intro: 'Since 6 April 2024 a sole trader’s profit is, by default, the money that came in less the money that went out.',
  resume: (h) => {
    const cash = 42000 - 7500, trad = 42000 + 6000 - 7500 - 900;
    const a = h.E.selfEmployed({ profit: cash, region: 'ruk' }), b = h.E.selfEmployed({ profit: trad, region: 'ruk' });
    return `On the cash basis, a freelance developer who received ${h.m(42000)} and paid ${h.m(7500)} of costs in ${h.P.taxYear} is taxed on ${h.m(cash)} of profit and owes ${h.m(a.saBill)} of Income Tax and Class 4 in England, Wales or Northern Ireland, even if ${h.m(6000)} of invoices were still unpaid on 5 April. Under traditional accounting the same year, with ${h.m(900)} of bills not yet settled, would show ${h.m(trad)} and a bill of ${h.m(b.saBill)}. Cash basis has been the standard method for sole traders and for partnerships without corporate partners since 6 April 2024: you record income when the money arrives and expenses when you pay them, so you never pay Income Tax on money you have not received. It does not remove tax, it moves it to the year the cash lands. Limited companies, limited liability partnerships and a short list of specialist trades cannot use it. If you prefer traditional accounting, you can choose it but must say so on your return. The calculator below compares both methods on your own figures.`;
  },
  faqs: (h) => {
    const r = h.E.selfEmployed({ profit: 30000, region: 'ruk' }), r2 = h.E.selfEmployed({ profit: 34000, region: 'ruk' });
    return [
      { q: 'Do I pay tax on an invoice my client has not paid by 5 April?', a: `Not on the cash basis. The income belongs to the tax year in which the money reaches you, so a ${h.m(4000)} invoice sent in March and paid in May is taxed the following year. For a sole trader at ${h.m(30000)} in England that keeps ${h.m(r2.saBill - r.saBill)} off this year’s bill, though it will be due a year later instead.` },
      { q: 'How do I opt out of the cash basis on my Self Assessment return?', a: `You simply prepare your figures under traditional accounting, recording income and costs by invoice and bill dates, and state on the return that you have used traditional accounting. There is no separate application. If you move between the two methods, some adjustments may be needed so that no income or cost is counted twice or missed out.` },
      { q: 'Can a limited liability partnership use the cash basis?', a: `No. The cash basis is not available to limited companies, limited liability partnerships or partnerships with one or more corporate partners. It is also closed to Lloyd’s underwriters, farmers with a herd basis election, businesses with a profit averaging claim and a few others. All of those work out profit using traditional accounting.` },
      { q: 'Is a new van an allowable expense on the cash basis?', a: `Yes. On the cash basis equipment and vehicles you buy to keep and use in the business, vans included, are claimed as ordinary allowable expenses when you pay for them. Cars are the exception: their purchase goes through capital allowances, and not at all if you claim that car through the flat ${h.a('simplified-expenses', 'mileage rates')}.` },
      { q: 'Should VAT be included in my cash basis figures?', a: `Either way works if you are consistent. You can record income and expenses net of VAT or including it, but both must be treated the same. If you include VAT, the VAT you pay to HMRC is recorded as an expense and any VAT repayment from HMRC as income, so the profit comes out the same.` },
    ];
  },
  body: (h) => {
    // Traditional profit: invoices issued in the year (receipts less opening debtors plus closing debtors), same for bills.
    const yr = (rec: number, unp: number, paid: number, owed: number, openUnp = 0, openOwed = 0) => ({ cash: rec - paid, trad: rec - openUnp + unp - (paid - openOwed + owed) });
    const y1 = yr(52000, 8000, 11000, 1200), y2 = yr(58000, 3000, 12500, 600, 8000, 1200);
    const cashTot = y1.cash + y2.cash, tradTot = y1.trad + y2.trad;
    const t = (p: number) => h.m(h.E.selfEmployed({ profit: p, region: 'ruk' }).saBill);
    const rows = [
      ['Year 1', h.m(y1.cash), t(y1.cash), h.m(y1.trad), t(y1.trad)],
      ['Year 2', h.m(y2.cash), t(y2.cash), h.m(y2.trad), t(y2.trad)],
    ];
    const T = h.T;
    return `
<h2>From optional scheme to default</h2>
<p>For years the cash basis was something small businesses had to opt into, with a turnover ceiling. From 6 April 2024 it became the default way for sole traders and partnerships with no corporate partners to work out profit, and the turnover limit went with the old rules. In practice this means that if you do nothing special, keep a record of what was paid in and paid out, and fill in the return from those records, you are using it. Traditional accounting, where income and costs are dated by invoice and bill, is now the one you choose deliberately.</p>
<h2>When income counts</h2>
<p>Income goes in the year you receive it, in whatever form: bank transfer, card, cash, cheque or payment in kind. Money you are owed does not count until it arrives. You can choose which date you treat as the date of receipt, for example the day money reaches your account or the day a cheque is written, but you must stick to the same method from one return to the next. A photographer who invoices a wedding on 28 March and is paid on 12 April records that income in the new tax year, not the old one.</p>
<h2>When costs count</h2>
<p>Expenses follow the same logic: only what you have actually paid comes off. A bill received in March but settled in April belongs to the next year. The usual allowable costs apply, from fuel and stationery to interest on an overdraft, and you can still use the flat-rate ${h.a('simplified-expenses', 'simplified expenses')} for a vehicle, home working or living at your business premises. The ${h.a('self-employed-expenses', 'allowable expenses guide')} lists what counts.</p>
<h2>Two years compared</h2>
<p>Take an interior designer whose clients are slow to pay. In the first year she receives ${h.m(52000)}, has ${h.m(8000)} outstanding at the year end, pays ${h.m(11000)} of costs and owes suppliers ${h.m(1200)}. In the second year she receives ${h.m(58000)}, including the old ${h.m(8000)}, ends with ${h.m(3000)} unpaid, pays ${h.m(12500)}, which covers the ${h.m(1200)} left over from the first year, and owes ${h.m(600)} when the second year closes.</p>
${h.table(['', 'Cash basis profit', 'Bill', 'Traditional profit', 'Bill'], rows, `Income Tax and Class 4, England, Wales or Northern Ireland, ${h.P.taxYear} rates applied to both years for comparison.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The cash basis taxes less in year one and more in year two, because the late ${h.m(8000)} lands in the second year. Over the two years the cash basis counts ${h.m(cashTot)} of profit and traditional accounting ${h.m(tradTot)}; the remaining ${h.m(tradTot - cashTot)} is simply the money still outstanding at the end of year two, less the supplier bills not yet paid, and it will be taxed when it moves. What the method changes is when tax is paid, and it lines the bill up with the money actually in the bank, which is its main attraction for a small business without a finance team. Timing can still change the total when a shift of income moves profit across a threshold in one year but not the other, such as the higher rate at ${h.m(T.higherFrom)} or the ${h.a('personal-allowance-taper', '£100,000 taper')}.</p>
<h2>Keeping cash records day to day</h2>
<p>The method rewards a simple routine. A separate bank account for the business makes the bank statement do most of the work, because each payment in and out already carries a date. Choose your date convention once, note it, and use it every year. Keep the invoices you send even though they are not what triggers tax, since they show which payments relate to the business and help you chase late payers. On the cost side, keep the receipt or bill for each payment and note what it was for, especially where something is partly private. At the year end there is no stock count and no list of debtors to prepare unless you have chosen traditional accounting.</p>
<h2>Who cannot use it</h2>
<p>The cash basis is closed to limited companies, limited liability partnerships and partnerships that have a company as a partner. It is also unavailable to Lloyd’s underwriters, farming businesses with a current herd basis election, farming or creative businesses with a profit averaging claim, businesses that have claimed business premises renovation allowance in the previous seven years, mineral extraction trades and any business that has ever claimed research and development allowance. Those businesses use traditional accounting and say so on the return.</p>
<h2>Why some choose traditional accounting anyway</h2>
<p>GOV.UK gives two everyday reasons. A business holding a lot of stock may find the cash figures jump around depending on when it restocks, and a business seeking a loan may be asked by the lender for accounts that show what it owes and is owed. A handful of specialist rules also only work under traditional accounting, covering cases such as dealing in securities, mineral royalties, lease premiums, ministers of religion, pool betting duty, intermediaries treated as making employment payments, managed service companies, waste disposal, and cemeteries and crematoria. Traditional accounting means more record keeping, since you have to track debtors and creditors at the year end. Someone with several businesses can choose the method separately for each one.</p>
<h2>Equipment and cars</h2>
<p>One of the practical attractions of the cash basis is that most things you buy to keep, such as a laptop, tools, machinery or a van, are deducted as normal expenses in the year you pay for them, instead of through capital allowances. Cars keep their own rule: the purchase is claimed through capital allowances, unless you use the flat mileage rate for that car, in which case the rate covers buying and running it. If you are moving from capital allowances to the cash basis, GOV.UK points to adjustments you may have to make.</p>
${h.box('Unpaid invoices and bad debts', '<p>Under traditional accounting an invoice counts as income when issued, so a customer who never pays leads to a bad debt claim. On the cash basis that problem does not arise: the money was never recorded, so it was never taxed.</p>', 'tip')}
<h2>VAT, records and your tax payments</h2>
<p>A VAT-registered sole trader on the cash basis can keep figures including or excluding VAT, as long as income and costs are treated the same way. Records do not go to HMRC with the return, but they must be kept in case of a check. Because the bill is worked out on cash profit, the ${h.a('payments-on-account', 'payments on account')} that follow are based on it too: a year in which several large invoices slip past 5 April gives a smaller bill now and larger advance payments later. Source: ${h.src('gov_cash_basis')}.</p>`;
  },
});
