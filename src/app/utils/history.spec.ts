import { describe, expect, it } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { selectCounters } from './history';

const counters: SavedCounter[] = [
  { id: '1', name: 'Žáci', value: 3, createdAt: '2026-10-12T09:00:00Z' },
  { id: '2', name: 'Auta', value: 0, createdAt: '2026-10-12T08:00:00Z' },
  { id: '3', name: 'Knihy', value: 9, createdAt: '2026-10-12T10:00:00Z' },
];
describe('history selection', () => {
  it('searches names without case or accent sensitivity', () => {
    expect(selectCounters(counters, ' ZACI ', 'newest').map((c) => c.id)).toEqual(['1']);
  });
  it('sorts by date in both directions', () => {
    expect(selectCounters(counters, '', 'newest').map((c) => c.id)).toEqual(['3', '1', '2']);
    expect(selectCounters(counters, '', 'oldest').map((c) => c.id)).toEqual(['2', '1', '3']);
  });
  it('sorts by name in both directions', () => {
    expect(selectCounters(counters, '', 'name-asc').map((c) => c.id)).toEqual(['2', '3', '1']);
    expect(selectCounters(counters, '', 'name-desc').map((c) => c.id)).toEqual(['1', '3', '2']);
  });
  it('sorts by value in both directions', () => {
    expect(selectCounters(counters, '', 'value-asc').map((c) => c.value)).toEqual([0, 3, 9]);
    expect(selectCounters(counters, '', 'value-desc').map((c) => c.value)).toEqual([9, 3, 0]);
  });
  it('does not reorder or change the original array', () => {
    const before = JSON.stringify(counters);
    selectCounters(counters, '', 'value-desc');
    expect(JSON.stringify(counters)).toBe(before);
  });
  it('returns an empty array for no matches', () => {
    expect(selectCounters(counters, 'nenalezeno', 'newest')).toEqual([]);
  });
});
