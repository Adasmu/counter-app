import { describe, expect, it } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { selectCounters, summarizeCounters } from './history';

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

describe('individual variants', () => {
  const data: SavedCounter[] = [
    { id: 'p', name: 'Plus', value: 8, createdAt: '2026-10-12T08:00:00Z' },
    { id: 'n', name: 'Minus', value: -2, createdAt: '2026-10-12T09:00:00Z' },
    { id: 'z', name: 'Nula', value: 0, createdAt: '2026-10-12T10:00:00Z' },
  ];
  it('A: calculates the average of all stored values', () => {
    expect(summarizeCounters(data).average).toBe(2);
  });
  it('B: calculates minimum and maximum', () => {
    expect(summarizeCounters(data)).toMatchObject({ min: -2, max: 8 });
  });
  it('C: counts positive, negative and zero values separately', () => {
    expect(summarizeCounters(data)).toMatchObject({ positive: 1, negative: 1, zero: 1 });
  });
  it('D: positive and negative filters exclude zero', () => {
    expect(selectCounters(data, '', 'newest', 'positive').map((c) => c.id)).toEqual(['p']);
    expect(selectCounters(data, '', 'newest', 'negative').map((c) => c.id)).toEqual(['n']);
    expect(selectCounters(data, '', 'newest', 'all')).toHaveLength(3);
  });
  it('combines sign filtering with search and sorting', () => {
    expect(selectCounters(data, 'minus', 'value-asc', 'negative').map((c) => c.id)).toEqual(['n']);
    expect(selectCounters(data, 'plus', 'value-asc', 'negative')).toEqual([]);
  });
  it('does not return Infinity, NaN or misleading averages for empty history', () => {
    expect(summarizeCounters([])).toEqual({
      count: 0,
      total: 0,
      average: null,
      min: null,
      max: null,
      positive: 0,
      negative: 0,
      zero: 0,
    });
  });
});
