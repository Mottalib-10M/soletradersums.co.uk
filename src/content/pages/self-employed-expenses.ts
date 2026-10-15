import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'self-employed-expenses',
  group: 'tax',
  order: 13,
  mini: { kind: 'mini:expenses', props: { turnover: 52000, exp: 6000, region: 0 } },
  related: ['simplified-expenses', 'cash-basis', 'trading-allowance', 'sole-trader-tax'],
  sources: ['gov_expenses', 'gov_simplified_vehicles', 'gov_simplified_home', 'gov_cash_basis', 'gov_trading_allowance', 'gov_se_nic'],
  slug: 'self-employed-expenses',
  nav: 'Allowable expenses',
  card: 'What a sole trader can deduct, what HMRC refuses, and how much tax each £100 of cost really saves.',
  title: 'Allowable Expenses for the Self-Employed: 2026/27 Guide',
  description: 'Allowable expenses for sole traders in 2026/27: what you can claim, what HMRC refuses, equipment on the cash basis, home working and the tax each expense saves.',
  h1: 'Allowable expenses when you are self-employed',
  intro: 'Every genuine business cost comes off your takings before tax, and knowing where the line sits is worth more than any rate change.',
  resume: (h) => {
    const sav = (p: number, region: 'ruk' | 'scotland') => h.E.selfEmployed({ profit: p, region }).saBill - h.E.selfEmployed({ profit: p - 1000, region }).saBill;
    return `Each ${h.m(1000)} of allowable expense saves a sole trader with ${h.m(35000)} of profit ${h.m(sav(35000, 'ruk'))} of Income Tax and Class 4 in ${h.P.taxYear} in England, Wales or Northern Ireland, ${h.m(sav(60000, 'ruk'))} at ${h.m(60000)} and ${h.m(sav(110000, 'ruk'))} at ${h.m(110000)}, where the Personal Allowance taper bites. An allowable expense is a cost incurred for the business: stationery and phone bills, fuel and train fares, protective clothing, staff and subcontractors, stock and raw materials, insurance and bank charges, premises costs, advertising, trade subscriptions and training linked to the work. Money you take out for yourself is not an expense, and neither are everyday clothes, fines, client entertaining or the trip between home and your usual place of work. Where something has both private and business use, only the business share counts. If you use the ${h.m(h.P.tradingAllowance.amount)} trading allowance instead, no expense can be deducted at all. The calculator below shows what your own costs take off the bill.`;
  },
  faqs: (h) => {
    const s1 = h.E.selfEmployed({ profit: 45000, region: 'scotland' }).saBill - h.E.selfEmployed({ profit: 44500, region: 'scotland' }).saBill;
    const r1 = h.E.selfEmployed({ profit: 45000, region: 'ruk' }).saBill - h.E.selfEmployed({ profit: 44500, region: 'ruk' }).saBill;
    return [
      { q: 'Can I claim the suits and shoes I wear to meet clients?', a: `No. Everyday clothing such as suits, shirts, dresses and ordinary shoes is never allowable, even if you only wear it for work. What you can claim is protective kit like safety boots and hard hats, overalls or aprons used only for work, uniforms and specialist clothing, and costumes for performing or advertising, plus the cost of cleaning and repairing them.` },
      { q: 'Is taking a client out for lunch a business expense?', a: `Usually not. Entertaining clients, suppliers or customers, including meals during a meeting about work, tickets to events and hospitality, is not allowable. Food and drink can be claimed when it is part of what you sell, when it is your own product given away as a promotion, or when it is provided to your employees, such as an annual staff dinner.` },
      { q: 'Can I claim the accountant who prepares my tax return?', a: `Partly. Accountancy, legal and other professional fees paid for business reasons are allowable, as are professional indemnity premiums. GOV.UK lists the cost of preparing and submitting your Self Assessment tax return among the items you cannot claim, so a bill that mixes bookkeeping and the personal return needs splitting. Fines for breaking the law are never allowable.` },
      { q: 'Do I need to send receipts to HMRC with my Self Assessment return?', a: `No. You enter total expenses on the return, by category, and send nothing else. You must still keep accurate records and proof, such as receipts, invoices and bank statements, and show them if HMRC asks to check. Inaccurate or missing records can lead to a penalty, and HMRC can refuse costs you cannot support.` },
      { q: 'Can I claim fuel for driving from home to my own workshop?', a: `No. Travel between home and your regular place of work counts as private, whatever the distance. Fuel, parking and fares for genuine business journeys from there, such as visits to customers or suppliers, are allowable, either at actual cost or through the flat ${h.a('simplified-expenses', 'mileage rates')}. Parking fines and speeding penalties are never deductible.` },
      { q: 'How much does a £500 expense save at £45,000 profit in Scotland?', a: `${h.m(s1)} in ${h.P.taxYear}, because a Scottish sole trader at that profit is in the ${h.pc(h.P.incomeTax.scotland.bands[3].rate)} higher rate band and still pays the main Class 4 rate. The same ${h.m(500)} saves ${h.m(r1)} in England, Wales or Northern Ireland, where the profit is still taxed at the basic rate. The cash cost of the purchase itself does not change.` },
    ];
  },
  body: (h) => {
    const C4 = h.P.class4;
    const rows = [20000, 35000, 55000, 80000, 110000].map((p) => {
      const a = h.E.selfEmployed({ profit: p, region: 'ruk' }).saBill - h.E.selfEmployed({ profit: p - 1000, region: 'ruk' }).saBill;
      const s = h.E.selfEmployed({ profit: p, region: 'scotland' }).saBill - h.E.selfEmployed({ profit: p - 1000, region: 'scotland' }).saBill;
      return [h.m(p), h.m(a), h.m(s)];
    });
    const turnover = 48000, costs = 9500;
    const full = h.E.selfEmployed({ profit: turnover, region: 'ruk' }), net = h.E.selfEmployed({ profit: turnover - costs, region: 'ruk' });
    const bill = 1260, rooms = 5, days = 2;
    const homeRate = h.E.simplifiedExpenses(0, 0, [0, 12, 0]).home;
    return `
<h2>The test behind every claim</h2>
<p>HMRC asks one question of any cost: was it spent for the business? If the answer is wholly yes, the full amount comes off. If the item serves both the business and your private life, only the business part counts, and you need a reasonable way to split it. A sole trader whose mobile contract costs ${h.m(360)} a year, with itemised bills showing about a third of calls are to clients, claims ${h.m(120)}. What you draw from the business account to live on is not an expense at all: profit is taxed whether you spend it, save it or leave it in the bank.</p>
<p>The effect on the bill is direct. A landscape gardener who invoices ${h.m(turnover)} in ${h.P.taxYear} and has ${h.m(costs)} of genuine costs pays tax on ${h.m(turnover - costs)}. Without those claims the Income Tax and Class 4 bill in England would be ${h.m(full.saBill)}; with them it is ${h.m(net.saBill)}, a difference of ${h.m(full.saBill - net.saBill)}.</p>
<h2>Running costs GOV.UK accepts</h2>
<h3>Office, premises and equipment</h3>
<p>Items you would normally use for less than two years go straight in: stationery, postage, printing, ink, phone and internet bills, and software either bought for short use or paid for by a recurring licence. Rent for business premises, business and water rates, utilities, property insurance, security, and repairs and maintenance of premises and equipment are all allowable.</p>
<h3>Vehicles and travel</h3>
<p>For business driving you can claim insurance, servicing and repairs, fuel, parking, hire charges, vehicle tax and breakdown cover, or use mileage rates instead. Public transport, taxis and flights for business trips count, as do hotel rooms and meals on overnight business trips.</p>
<h3>People</h3>
<p>Wages, bonuses, pensions and benefits for staff, agency fees, subcontractors and employer’s National Insurance are deductible. Childcare and domestic help, such as a nanny, are not, even if they free you up to work.</p>
<h3>Stock, money and marketing</h3>
<p>Goods bought to resell, raw materials and direct production costs are expenses. So are bank and credit card charges, overdraft and loan interest, hire purchase interest, leasing payments and business insurance such as public liability. Advertising, mailshots and website costs are allowable, and so are small promotional gifts carrying your name or logo, within a per-person yearly cap and never food, drink or tobacco. Subscriptions to trade bodies and professional journals and training that keeps your current skills up to date complete the list.</p>
<h2>Three trades, three lists</h2>
<p>The categories make more sense in a real business. A mobile hairdresser claims the products used on clients and those sold on, scissors and small tools, public liability insurance, booking software paid monthly, and the business share of car costs between appointments. An electrician claims cable and fittings bought for jobs, hand tools, test equipment, trade association fees, workwear that protects everyday clothes, and the van, which on the cash basis is deducted in the year it is paid for. A freelance designer claims software subscriptions, a laptop and monitor, a portfolio website, stock image licences, professional body membership and a share of home running costs. None of them can claim lunch with a prospective client, a gym membership or the jacket worn to a pitch.</p>
<h2>Costs that are refused</h2>
<p>The refusals are just as clear. Everyday clothes, even a suit worn only for meetings. Commuting between home and your usual workplace. Entertaining clients. Fines and penalties of any kind. Repayments of loans and overdrafts, as opposed to the interest on them. Depreciation of equipment, which is replaced by capital allowances. Goods taken for your own use. Training to start a new business or move into an unrelated field. Anything that is really a personal cost passed through the business account remains a personal cost.</p>
<h2>Equipment: expense or capital allowance</h2>
<p>Things you buy to keep and use, such as a laptop, a printer, a van or machinery, are treated differently depending on how you keep your books. Under the ${h.a('cash-basis', 'cash basis')}, now the default for sole traders, they are simply allowable expenses in the year you pay. Cars are the exception and go through capital allowances, unless you use the flat mileage rate for that car. Under traditional accounting, equipment and vehicles of every kind are claimed through capital allowances rather than as expenses. Either way, a cost claimed once cannot be claimed again by the other route.</p>
<h2>Working from home: two methods</h2>
<p>You can claim a share of heating, electricity, Council Tax, mortgage interest or rent, and internet and phone use. The share must be reasonable, typically based on rooms used for work and time spent working. A translator in a ${rooms}-room flat who uses one room only as an office, two days a week, with an electricity bill of ${h.m(bill)}, would take one room’s share, ${h.m(bill / rooms)}, then the working days out of seven, about ${h.m((bill / rooms) * days / 7)}. The alternative is the ${h.a('simplified-expenses', 'flat rate by hours worked')}: someone who works between ${h.P.simplified.home[1].from} and ${h.P.simplified.home[1].to} hours a month at home all year claims ${h.m(homeRate)}, with no bills to apportion. The flat rate leaves out phone and broadband, so with that method those bills are added separately at their business share.</p>
<h2>What a ${h.m(1000)} expense saves at each profit</h2>
<p>A deduction saves your marginal rate, not the full cost. Class 4 at ${h.pc(C4.mainRate)} up to ${h.m(C4.upperProfitsLimit)}, then ${h.pc(C4.upperRate)}, adds to whatever Income Tax rate the top slice of profit pays.</p>
${h.table(['Profit before the expense', 'Saved, rUK', 'Saved, Scotland'], rows, `Income Tax and Class 4 saved by ${h.m(1000)} of extra allowable expense, ${h.P.taxYear}, no other income.`, ['r', 'r', 'r'])}
<p>The table shows why the timing of a large purchase can matter more than its size. A cost paid in a year when profit sits in the higher rate, or inside the ${h.a('personal-allowance-taper', '£100,000 taper')}, takes far more off the bill than the same cost in a quiet year.</p>
<h2>Customers who never pay</h2>
<p>An unpaid invoice is handled differently by the two accounting methods. Under traditional accounting the invoice was counted as income when you issued it, so a debt you are sure will never be recovered can be written off as a bad debt; a blanket estimate, such as a fixed share of turnover, is not accepted. Under the cash basis the money was never recorded as income in the first place, so there is nothing to write off and no bad debt claim to make.</p>
<h2>Expenses or the trading allowance</h2>
<p>A very small business may prefer the ${h.a('trading-allowance', `${h.m(h.P.tradingAllowance.amount)} trading allowance`)}, a flat deduction that replaces every expense and capital allowance. It only helps when real costs are below ${h.m(h.P.tradingAllowance.amount)}. Once you have more than that to claim, or a loss, itemised expenses leave less profit.</p>
<h2>Proof and records</h2>
<p>Nothing is sent with the return, but every figure should be backed by a receipt, invoice, bank statement or log. If you are unsure whether a cost qualifies, HMRC’s helpline can confirm it before you file. Source: ${h.src('gov_expenses')}.</p>`;
  },
});
