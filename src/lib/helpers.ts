/** Writing helpers handed to every page: links, numbers from the engine, tables, sources. */
import { route, ROUTES } from '../i18n/routes';
import { P, type SourceKey } from './engine/params';
import * as E from './engine/tax';
import { formatMoney, formatNumber, formatPercent, displayDate } from './format';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption?: string, align: Array<'l' | 'r'> = []) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/** Income thresholds derived from the parameter file (income with the standard Personal Allowance). */
const PA = P.incomeTax.personalAllowance;
const SB = P.incomeTax.scotland.bands, RB = P.incomeTax.ruk.bands;
export const T = {
  pa: PA,
  taperStart: P.incomeTax.taperStart,
  /** Income at which the allowance is gone (£125,140). */
  paGone: P.incomeTax.taperStart + 2 * PA,
  /** First pound of the higher rate in England, Wales, NI (£50,271) and the last basic-rate pound (£50,270). */
  higherFrom: PA + (RB[0].upTo as number) + 1, basicTo: PA + (RB[0].upTo as number),
  additionalFrom: (RB[1].upTo as number) + 1,
  scotStarterTo: PA + (SB[0].upTo as number), scotBasicFrom: PA + (SB[0].upTo as number) + 1,
  scotIntermediateFrom: PA + (SB[1].upTo as number) + 1, scotHigherFrom: PA + (SB[2].upTo as number) + 1,
  scotAdvancedFrom: PA + (SB[3].upTo as number) + 1, scotTopFrom: (SB[4].upTo as number) + 1,
  lpl: P.class4.lowerProfitsLimit, upl: P.class4.upperProfitsLimit, spt: P.class2.smallProfitsThreshold,
};

export function helpers(strict = false) {
  return {
    P,
    E,
    T,
    /** Link to another page of the site by id. */
    a: (id: string, text: string) => {
      if (!ROUTES.some((r) => r.id === id)) { if (strict) throw new Error(`Unknown page id in a link: ${id}`); return text; }
      return `<a href="${route(id, 'en')}">${text}</a>`;
    },
    /** £12,570 (rounded to the pound). */
    m: (n: number) => formatMoney(Math.round(n), 0),
    /** £3.65 (pence kept, for official rates). */
    m2: (n: number) => formatMoney(n, 2),
    num: (n: number) => formatNumber(n, 0),
    /** 20 % (one decimal only when needed: 10.75 %). */
    pc: (x: number) => { const v = Math.round(x * 10000) / 100; return formatPercent(x, Number.isInteger(v) ? 0 : Number.isInteger(+(v * 10).toFixed(6)) ? 1 : 2); },
    /** “31 January 2028” from an ISO date. */
    date: (iso: string) => displayDate(iso, 'en-GB'),
    table,
    /** Link to an official source of the parameter file. */
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label.en}</a>`; },
    /** Boxed note in the style of a press sidebar. */
    box: (title: string, html: string, kind: 'info' | 'tip' | 'warning' | 'example' = 'info') => `<div class="callout callout-${kind}"><span class="callout-title">${title}</span>${html}</div>`,
  };
}
export type Helpers = ReturnType<typeof helpers>;
