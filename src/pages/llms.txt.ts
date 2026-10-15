/** llms.txt (RECETTE §21): what the site is, where its figures come from, its main pages. Built from the data. */
import type { APIRoute } from 'astro';
import { PAGES } from '../lib/guides';
import { route } from '../i18n/routes';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
export const GET: APIRoute = () => {
  const lines = [
    '# Sole Trader Sums',
    '',
    `> UK self-employed tax for the 2026/27 tax year, worked out in the browser: Income Tax for England, Wales, Northern Ireland and Scotland, Class 4 National Insurance, student loans, payments on account, Making Tax Digital for Income Tax dates, sole trader versus limited company, dividend and Corporation Tax, IR35 and umbrella take-home. Every rate read on GOV.UK, HMRC manuals or legislation.gov.uk (last ${LAST_UPDATED}). Published by Radif Partners, an independent publisher; not HMRC, not tax advice.`,
    '',
    '## Calculators and guides',
    `- [Self-employed tax calculator 2026/27](${SITE_URL}${route('home', 'en')}): the full Self Assessment bill, what to put aside, payments on account and MTD status.`,
    ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`),
    '',
    '## Method',
    `- [How the figures are calculated](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
