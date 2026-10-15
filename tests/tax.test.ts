import { describe, it, expect } from 'vitest';
import { incomeTax, personalAllowance, class4, class2, class1Employee, class1Employer, studentLoan, selfEmployed, corporationTax, limitedCompany, bestSalary, compareStructures, crossover, ir35, mtdStart, firstYearDeadlines, saPenalties, mtdLatePayment, tradingAllowance, simplifiedExpenses, marginalOnProfit, maxSalary, taxYearOf } from '../src/lib/engine/tax';

describe('Income Tax 2026/27', () => {
  it('rUK: £30,000 of profit → £3,486 (20 % on £17,430)', () => {
    expect(incomeTax({ nonSavings: 30000, region: 'ruk' }).tax).toBeCloseTo(3486, 2);
  });
  it('Scotland: £30,000 → starter, basic and intermediate slices', () => {
    expect(incomeTax({ nonSavings: 30000, region: 'scotland' }).tax).toBeCloseTo(3967 * 0.19 + 12989 * 0.2 + 474 * 0.21, 2);
  });
  it('Personal Allowance taper (ITA 2007 s.35)', () => {
    expect(personalAllowance(100000)).toBe(12570);
    expect(personalAllowance(110000)).toBe(7570);
    expect(personalAllowance(125140)).toBe(0);
    expect(personalAllowance(200000)).toBe(0);
  });
  it('rUK: £60,000 → basic band full, rest at 40 %', () => {
    expect(incomeTax({ nonSavings: 60000, region: 'ruk' }).tax).toBeCloseTo(37700 * 0.2 + (60000 - 12570 - 37700) * 0.4, 2);
  });
  it('rUK: £150,000 → no allowance, 45 % above £125,140 taxable', () => {
    expect(incomeTax({ nonSavings: 150000, region: 'ruk' }).tax).toBeCloseTo(37700 * 0.2 + (125140 - 37700) * 0.4 + (150000 - 125140) * 0.45, 2);
  });
  it('GOV.UK dividend example: wages £29,570 + dividends £3,000 → £3,400 + £268.75', () => {
    const r = incomeTax({ nonSavings: 29570, dividends: 3000, region: 'ruk' });
    expect(r.nonSavingsTax).toBeCloseTo(3400, 2);
    expect(r.dividendTax).toBeCloseTo(268.75, 2);
  });
  it('dividends for a Scottish taxpayer use UK bands', () => {
    const r = incomeTax({ nonSavings: 12570, dividends: 60000, region: 'scotland' });
    // 500 allowance, basic up to 37,700 taxable, then upper rate
    expect(r.dividendTax).toBeCloseTo((37700 - 500) * 0.1075 + (60000 - 37700) * 0.3575, 2);
  });
  it('pension relief at source: extra relief on the 40 % slice (GOV.UK example shape)', () => {
    const r = incomeTax({ nonSavings: 60270, region: 'ruk', pensionGross: 12000 });
    // £10,000 taxed at 40 % gets 20 % more; the other £2,000 at 20 % gets nothing more
    expect(r.pensionExtraRelief).toBeCloseTo(10000 * 0.2, 2);
  });
  it('Scottish pension relief: 22 % on income taxed at 42 %, 1 % at 21 %', () => {
    const r = incomeTax({ nonSavings: 45000, region: 'scotland', pensionGross: 3000 });
    const taxable = 45000 - 12570; // 32,430 → 1,338 at 42 %, then 21 %
    const at42 = taxable - 31092;
    expect(r.pensionExtraRelief).toBeCloseTo(at42 * 0.22 + (3000 - at42) * 0.01, 2);
  });
});

describe('National Insurance', () => {
  it('Class 4 on £30,000 = 6 % of £17,430', () => expect(class4(30000).total).toBeCloseTo(1045.8, 2));
  it('Class 4 on £80,000 = £2,262 + 2 % above £50,270', () => expect(class4(80000).total).toBeCloseTo(37700 * 0.06 + 29730 * 0.02, 2));
  it('Class 2 treated as paid from £7,105; voluntary £3.65 × 52 below', () => {
    expect(class2(7105).credited).toBe(true);
    expect(class2(7104).credited).toBe(false);
    expect(class2(0).voluntaryYear).toBeCloseTo(189.8, 2);
  });
  it('Class 1 employee and employer', () => {
    expect(class1Employee(30000)).toBeCloseTo(1394.4, 2);
    expect(class1Employee(12570)).toBe(0);
    expect(class1Employer(12570)).toBeCloseTo(1135.5, 2);
    expect(class1Employer(5000)).toBe(0);
  });
});

describe('Student loans', () => {
  it('GOV.UK example: Plan 1, £32,000 self-employed + £10,000 wages → £1,359', () => {
    expect(studentLoan(42000, 'plan1').total).toBeCloseTo(1359, 2);
  });
  it('Plan 2 threshold £29,385, postgraduate 6 % over £21,000', () => {
    expect(studentLoan(29385, 'plan2').total).toBe(0);
    expect(studentLoan(31000, 'none', true).total).toBeCloseTo(600, 2);
  });
});

describe('Self-employed bill', () => {
  it('£30,000 profit, rUK: tax £3,486 + Class 4 £1,045.80, take-home £25,468.20', () => {
    const r = selfEmployed({ profit: 30000, region: 'ruk' });
    expect(r.saBill).toBeCloseTo(4531.8, 2);
    expect(r.takeHome).toBeCloseTo(25468.2, 2);
    expect(r.poaDue).toBe(true);
    expect(r.poaEach).toBeCloseTo(2265.9, 2);
  });
  it('wages first: £25,000 job + £10,000 profit → profit taxed at 20 % + Class 4', () => {
    const r = selfEmployed({ profit: 10000, employment: 25000, region: 'ruk' });
    expect(r.itViaSA).toBeCloseTo(2000, 2);
    expect(r.class4.total).toBe(0);
  });
  it('no payments on account under £1,000', () => {
    expect(selfEmployed({ profit: 16000, region: 'ruk' }).poaDue).toBe(false);
  });
  it('marginal rate in the £100k trap is 62 % (40 % × 1.5 + 2 %)', () => {
    expect(marginalOnProfit({ profit: 110000, region: 'ruk' })).toBeCloseTo(0.62, 3);
  });
  it('marginal rate in Scotland between £100k and £125,140 is 69.5 %', () => {
    expect(marginalOnProfit({ profit: 110000, region: 'scotland' })).toBeCloseTo(0.695, 3);
  });
});

describe('Corporation Tax and companies', () => {
  it('19 % to £50,000, 25 % from £250,000, marginal relief 3/200 between', () => {
    expect(corporationTax(50000).tax).toBeCloseTo(9500, 2);
    expect(corporationTax(100000).tax).toBeCloseTo(22750, 2);
    expect(corporationTax(250000).tax).toBeCloseTo(62500, 2);
  });
  it('associated companies divide the limits (HMRC: 3 others → £12,500 and £62,500)', () => {
    const r = corporationTax(30000, 3);
    expect(r.lower).toBe(12500); expect(r.upper).toBe(62500);
  });
  it('salary never makes the company pay more than its profit', () => {
    expect(maxSalary(4000)).toBe(4000);
    const r = limitedCompany({ profit: 10000, salary: 20000, region: 'ruk' });
    expect(r.salary + r.employerNI).toBeCloseTo(10000, 2);
  });
  it('2026/27 dividend rates: drawn in full, a company leaves less cash than a sole trader at £50,000 (rUK)', () => {
    expect(bestSalary(50000, 'ruk')).toBe(12570);
    const c = compareStructures({ profit: 50000, region: 'ruk' });
    // sole: 50,000 − 7,486 − 2,245.80 ; company: hand-checked 38,862
    expect(c.soleTakeHome).toBeCloseTo(40268.2, 1);
    expect(c.ltdAll.takeHome).toBeCloseTo(38862, 0);
    expect(c.gapAllDrawn).toBeLessThan(0);
  });
  it('Scotland: the company wins between about £50,000 and £80,000 when everything is drawn', () => {
    expect(compareStructures({ profit: 60000, region: 'scotland' }).gapAllDrawn).toBeGreaterThan(0);
    expect(compareStructures({ profit: 40000, region: 'scotland' }).gapAllDrawn).toBeLessThan(0);
  });
  it('rUK crossover with everything drawn is a narrow window near £60,000', () => {
    const x = crossover('ruk');
    expect(x).toBe(60500);
  });
  it('leaving profit in the company changes the answer', () => {
    const c = compareStructures({ profit: 80000, region: 'ruk', drawShare: 0.5 });
    expect(c.ltd.takeHome + c.ltd.retained).toBeGreaterThan(c.soleTakeHome);
  });
});

describe('IR35, umbrella', () => {
  it('umbrella is below inside (employer costs come out of the rate); the fee is fully accounted for', () => {
    const r = ir35({ dayRate: 500, days: 220, region: 'ruk', umbrellaMarginWeekly: 20, weeks: 46, levy: true });
    expect(r.outside.takeHome).toBeGreaterThan(r.umbrella.takeHome);
    expect(r.umbrella.takeHome).toBeLessThan(r.inside.takeHome);
    expect(r.umbrella.gross + r.umbrella.employerNI + r.umbrella.levy + r.umbrella.margin).toBeCloseTo(r.fee, 2);
  });
});

describe('Dates and penalties', () => {
  it('Making Tax Digital start from qualifying income', () => {
    expect(mtdStart({ y2425: 55000, y2526: 0, y2627: 0 })?.start).toBe('2026-04-06');
    expect(mtdStart({ y2425: 50000, y2526: 31000, y2627: 0 })?.start).toBe('2027-04-06');
    expect(mtdStart({ y2425: 0, y2526: 30000, y2627: 20001 })?.start).toBe('2028-04-06');
    expect(mtdStart({ y2425: 0, y2526: 0, y2627: 20000 })).toBeNull();
  });
  it('tax year boundaries and first-year deadlines', () => {
    expect(taxYearOf('2026-04-05')).toBe(2025);
    expect(taxYearOf('2026-04-06')).toBe(2026);
    const d = firstYearDeadlines('2026-05-10');
    expect(d.registerBy).toBe('2027-10-05'); expect(d.onlineReturn).toBe('2028-01-31'); expect(d.secondPoa).toBe('2028-07-31');
  });
  it('Self Assessment penalties: 200 days late on £10,000 → £100 + £900 + £500', () => {
    expect(saPenalties(10000, 200, 0).filing).toBeCloseTo(1500, 2);
    expect(saPenalties(1000, 200, 0).six).toBe(300);
    expect(saPenalties(10000, 0, 40).payment).toBeCloseTo(500, 2);
  });
  it('MTD late payment, 2026/27: 3 % + 3 % + 10 % a year from day 31', () => {
    expect(mtdLatePayment(10000, 40, '2026/27', false).total).toBeCloseTo(300 + 300 + 10000 * 0.1 * 10 / 365, 2);
    expect(mtdLatePayment(10000, 20, '2026/27', true).total).toBe(0);
    expect(mtdLatePayment(10000, 20, '2027/28', false).total).toBeCloseTo(400, 2);
  });
});

describe('Allowances and simplified expenses', () => {
  it('trading allowance wins over small expenses', () => {
    expect(tradingAllowance(3000, 400).best).toBe('allowance');
    expect(tradingAllowance(3000, 1500).best).toBe('expenses');
    expect(tradingAllowance(900, 0).exempt).toBe(true);
  });
  it('GOV.UK mileage example: 11,000 miles → £5,750; home 10 × £10 + 2 × £18 = £136', () => {
    expect(simplifiedExpenses(11000, 0, [0, 0, 0]).car).toBeCloseTo(5750, 2);
    expect(simplifiedExpenses(0, 0, [10, 2, 0]).home).toBe(136);
  });
});

import { childBenefitCharge, saCalendar } from '../src/lib/engine/tax';
describe('Child Benefit charge and calendar', () => {
  it('1 % per £200 over £60,000, all of it from £80,000 (two children: £27.05 + £17.90 a week)', () => {
    const b = (27.05 + 17.9) * 52;
    expect(childBenefitCharge(70000, 2).charge).toBeCloseTo(b * 0.5, 2);
    expect(childBenefitCharge(80000, 2).charge).toBeCloseTo(b, 2);
    expect(childBenefitCharge(60199, 1).charge).toBe(0);
  });
  it('2026/27 calendar matches GOV.UK deadlines', () => {
    const c = saCalendar(2025);
    expect(c.paper).toBe('2026-10-31'); expect(c.online).toBe('2027-01-31'); expect(c.codingOut).toBe('2026-12-30'); expect(c.registerBy).toBe('2026-10-05');
  });
});
