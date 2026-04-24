export interface FilterState {
  types: string[];
  sectors: string[];
  crossBorderOnly: boolean;
}

export const EMPTY_STATE: FilterState = { types: [], sectors: [], crossBorderOnly: false };

export function applyFilters(cards: HTMLElement[], state: FilterState): void {
  for (const card of cards) {
    const type = card.getAttribute('data-deal-type') ?? '';
    const sector = card.getAttribute('data-deal-sector') ?? '';
    const crossBorder = card.getAttribute('data-deal-cross-border') === 'true';

    const typeOk   = state.types.length   === 0 || state.types.includes(type);
    const sectorOk = state.sectors.length === 0 || state.sectors.includes(sector);
    const xbOk     = !state.crossBorderOnly || crossBorder;

    card.hidden = !(typeOk && sectorOk && xbOk);
  }
}

export function parseHashFilters(hash: string): FilterState {
  const s: FilterState = { types: [], sectors: [], crossBorderOnly: false };
  const clean = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!clean) return s;
  const parts = clean.split('&');
  for (const part of parts) {
    const [key, value] = part.split('=');
    if (!value) continue;
    if (key === 'type')        s.types   = value.split(',').filter(Boolean);
    else if (key === 'sector') s.sectors = value.split(',').filter(Boolean);
    else if (key === 'crossBorder' && value === '1') s.crossBorderOnly = true;
  }
  return s;
}

export function serializeFilters(state: FilterState): string {
  const parts: string[] = [];
  if (state.types.length)   parts.push('type='   + state.types.join(','));
  if (state.sectors.length) parts.push('sector=' + state.sectors.join(','));
  if (state.crossBorderOnly) parts.push('crossBorder=1');
  return parts.join('&');
}
