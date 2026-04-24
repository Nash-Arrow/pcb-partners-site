import { describe, it, expect, beforeEach } from 'vitest';
import { applyFilters, parseHashFilters, serializeFilters, type FilterState } from '../src/scripts/deal-filter';

describe('applyFilters', () => {
  let cards: HTMLElement[];

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="deal-grid">
        <article id="a" data-deal-type="sell-side"  data-deal-sector="technology-services" data-deal-cross-border="true"></article>
        <article id="b" data-deal-type="buy-side"   data-deal-sector="management-consulting" data-deal-cross-border="true"></article>
        <article id="c" data-deal-type="sell-side"  data-deal-sector="management-consulting" data-deal-cross-border="false"></article>
        <article id="d" data-deal-type="pe"         data-deal-sector="technology-services"   data-deal-cross-border="false"></article>
      </div>
    `;
    cards = Array.from(document.querySelectorAll('#deal-grid article')) as HTMLElement[];
  });

  it('shows all cards when filter state is empty', () => {
    applyFilters(cards, { types: [], sectors: [], crossBorderOnly: false });
    expect(cards.filter(c => !c.hidden).map(c => c.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('filters by a single type', () => {
    applyFilters(cards, { types: ['sell-side'], sectors: [], crossBorderOnly: false });
    expect(cards.filter(c => !c.hidden).map(c => c.id)).toEqual(['a', 'c']);
  });

  it('filters by a single sector', () => {
    applyFilters(cards, { types: [], sectors: ['technology-services'], crossBorderOnly: false });
    expect(cards.filter(c => !c.hidden).map(c => c.id)).toEqual(['a', 'd']);
  });

  it('intersects type and sector filters', () => {
    applyFilters(cards, { types: ['sell-side'], sectors: ['technology-services'], crossBorderOnly: false });
    expect(cards.filter(c => !c.hidden).map(c => c.id)).toEqual(['a']);
  });

  it('applies cross-border filter', () => {
    applyFilters(cards, { types: [], sectors: [], crossBorderOnly: true });
    expect(cards.filter(c => !c.hidden).map(c => c.id)).toEqual(['a', 'b']);
  });
});

describe('parseHashFilters', () => {
  it('returns empty state for empty hash', () => {
    expect(parseHashFilters('')).toEqual({ types: [], sectors: [], crossBorderOnly: false });
  });

  it('parses type list', () => {
    expect(parseHashFilters('#type=sell-side,pe')).toMatchObject({ types: ['sell-side', 'pe'] });
  });

  it('parses sector list', () => {
    expect(parseHashFilters('#sector=technology-services')).toMatchObject({ sectors: ['technology-services'] });
  });

  it('parses cross-border flag', () => {
    expect(parseHashFilters('#crossBorder=1')).toMatchObject({ crossBorderOnly: true });
  });

  it('parses combined params', () => {
    const s = parseHashFilters('#type=sell-side&sector=technology-services&crossBorder=1');
    expect(s).toEqual({ types: ['sell-side'], sectors: ['technology-services'], crossBorderOnly: true });
  });
});

describe('serializeFilters', () => {
  it('returns empty string for empty state', () => {
    expect(serializeFilters({ types: [], sectors: [], crossBorderOnly: false })).toBe('');
  });

  it('serialises non-empty state', () => {
    const s: FilterState = { types: ['sell-side', 'pe'], sectors: ['technology-services'], crossBorderOnly: true };
    expect(serializeFilters(s)).toBe('type=sell-side,pe&sector=technology-services&crossBorder=1');
  });

  it('round-trips through parse', () => {
    const s: FilterState = { types: ['buy-side'], sectors: ['digital-media-marketing'], crossBorderOnly: false };
    const str = serializeFilters(s);
    expect(parseHashFilters('#' + str)).toEqual(s);
  });
});
