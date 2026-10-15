import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'simplified-expenses',
  group: 'tax',
  order: 12,
  tool: { kind: 'mini:simplified', props: { car: 12000, moto: 0, h1: 0, h2: 4, h3: 8 } },
  related: ['self-employed-expenses', 'cash-basis', 'trading-allowance', 'how-much-tax-to-save-self-employed'],
  sources: ['gov_simplified_vehicles', 'gov_simplified_home', 'gov_expenses', 'gov_cash_basis'],
  slug: 'simplified-expenses',
  nav: 'Simplified expenses',
  card: 'Mileage at 55p then 25p, 24p for motorbikes, and £10 to £26 a month for working at home.',
  title: 'Simplified Expenses 2026/27: 55p Mileage and Home Rates',
  description: 'Simplified expenses for sole traders in 2026/27: 55p a mile up to 10,000 miles (45p before 6 April 2026), 25p after, 24p for motorbikes, £10 to £26 at home.',
  h1: 'Simplified expenses: mileage and home flat rates',
  intro: 'Flat rates per mile and per month of home working that replace receipts for running a vehicle and heating a home office.',
  resume: (h) => {
    const S = h.P.simplified;
    const ex = h.E.simplifiedExpenses(12000, 0, [0, 0, 0]);
    return `Simplified expenses let a sole trader claim vehicle and home-working costs at flat rates instead of adding up real bills. For ${h.P.taxYear} a car or van earns ${Math.round(S.carFirst10k * 100)}p a mile for the first ${h.num(S.milesBand)} business miles and ${Math.round(S.carAfter10k * 100)}p for each mile after that, so a mobile hairdresser who drives ${h.num(12000)} business miles deducts ${h.m(ex.car)}. Before ${h.date(h.P.valid_from)} the first band paid ${Math.round(S.carFirst10kBefore * 100)}p, so the same mileage was worth ${h.m(ex.carOld)}. Motorcycles get ${Math.round(S.motorcycle * 100)}p a mile at any distance. For working at home the flat rate depends on hours, not floor space: ${h.m(S.home[0].perMonth)} a month for ${S.home[0].from} to ${S.home[0].to} hours, ${h.m(S.home[1].perMonth)} for ${S.home[1].from} to ${S.home[1].to} and ${h.m(S.home[2].perMonth)} from ${S.home[2].from} hours. Sole traders and partnerships with no company partners can use them; limited companies cannot. Enter your miles and months below to total the claim.`;
  },
  faqs: (h) => {
    const S = h.P.simplified;
    const n = 18000;
    const ex = h.E.simplifiedExpenses(n, 0, [0, 0, 0]);
    return [
      { q: 'What is the self-employed mileage rate for 2026/27?', a: `${Math.round(S.carFirst10k * 100)}p a mile for the first ${h.num(S.milesBand)} business miles in a car or van, then ${Math.round(S.carAfter10k * 100)}p, and ${Math.round(S.motorcycle * 100)}p for a motorcycle. A courier driving ${h.num(n)} business miles in a van claims ${h.m(ex.car)} for the year. The rate covers fuel, insurance, servicing and repairs, but parking and train fares are claimed separately on top.` },
      { q: 'Can I change from mileage to actual car costs next year?', a: `Not for the same vehicle. Once you use the flat rate for a car, van or motorcycle you must keep using it for as long as that vehicle is used in the business. You can only use a different method when you change vehicle, and you cannot start using mileage on a vehicle you have already claimed capital allowances for.` },
      { q: 'Does the working from home flat rate include my phone and broadband?', a: `No. The ${h.m(S.home[0].perMonth)} to ${h.m(S.home[2].perMonth)} monthly rate replaces the share of heating, lighting and other household running costs, but GOV.UK says telephone and internet are not included. You can add the business share of those bills on top, worked out from the actual amounts, for example from itemised business calls.` },
    ];
  },
  body: (h) => {
    const S = h.P.simplified;
    const rows = [5000, 10000, 12000, 15000, 20000].map((mi) => { const r = h.E.simplifiedExpenses(mi, 0, [0, 0, 0]); return [h.num(mi), h.m(r.car), h.m(r.carOld), h.m(r.car - r.carOld)]; });
    const base = 38000;
    const claim = h.E.simplifiedExpenses(9000, 0, [0, 0, 0]).car;
    const before = h.E.selfEmployed({ profit: base, region: 'ruk' }), after = h.E.selfEmployed({ profit: base - claim, region: 'ruk' });
    const homeEx = h.E.simplifiedExpenses(0, 0, [3, 6, 3]).home;
    return `
<h2>The new first-band rate and what it adds</h2>
<p>The ${h.P.taxYear} increase applies only to the first ${h.num(S.milesBand)} miles, so anyone who drives at least that far gains the same fixed amount from it. Beyond the band, the rate is unchanged. The table compares the two years for a car or van.</p>
${h.table(['Business miles', `Claim ${h.P.taxYear}`, 'Claim at the old rate', 'Extra deduction'], rows, 'Cars and goods vehicles, flat rate only. Parking and public transport are claimed on top.', ['r', 'r', 'r', 'r'])}
<p>A deduction is not cash in hand: it lowers profit, and what you save is the tax on that profit. A plumber with ${h.m(base)} of profit before motoring costs who drives ${h.num(9000)} business miles deducts ${h.m(claim)}, which takes ${h.m(before.saBill - after.saBill)} off the Income Tax and Class 4 bill in England, Wales or Northern Ireland.</p>
<h2>What the mileage rate replaces</h2>
<p>The flat rate stands in for the whole cost of buying and running the vehicle: fuel, insurance, servicing, repairs, breakdown cover and vehicle tax. You cannot add any of those as well, nor claim capital allowances on the purchase. Parking and other travel, such as train journeys, remain separate expenses. Cars designed for commercial use, such as black cabs, hackney carriages and dual-control cars used by driving instructors, are outside the scheme, and so is any vehicle already in your capital allowance claims or already deducted as an expense. You do not have to use it for every vehicle, but once you start on one you are tied to it while that vehicle stays in the business. Keep a mileage log with dates, destinations and purpose: the claim is only as good as the record behind it.</p>
<h2>Working from home, by the hour</h2>
<p>The home rate ignores the size of your house and the bills you actually pay. You count the hours of business work done at home in each month, and only months of ${S.home[0].from} hours or more qualify. A bookkeeper who works ${S.home[0].from + 15} hours at home for three months, ${S.home[1].from + 19} for six and ${S.home[2].from + 19} for three claims ${h.m(homeEx)} for the year. That is modest next to a careful apportionment of heating, electricity and Council Tax, which is why people with a dedicated office often work out the real figures instead; the ${h.a('self-employed-expenses', 'allowable expenses guide')} explains that method. Phone and internet stay outside the flat rate in either case.</p>
${h.box('Living above the shop', '<p>A third flat rate exists for people who live at their business premises, such as a small guesthouse or bed and breakfast. It works the other way round: you add up all the premises costs, then subtract a monthly amount for private use based on how many people live there.</p>', 'info')}
<h2>Using the rates on your return</h2>
<p>Simplified expenses are optional and can be mixed with real costs for everything else. At the end of the year you multiply the miles, hours and months by the flat rates and add the result to your total expenses on the Self Assessment return; nothing separate is sent. They work with the ${h.a('cash-basis', 'cash basis')} or traditional accounting, but not with the ${h.a('trading-allowance', 'trading allowance')}, which replaces all expenses. Sources: ${h.src('gov_simplified_vehicles')}; ${h.src('gov_simplified_home')}.</p>`;
  },
});
