import { SavedCounter } from '../models/saved-counter';
import { SignFilter, SortOrder } from '../models/history-options';

// The source array is never mutated by searching or sorting.
export function selectCounters(
  counters: readonly SavedCounter[],
  query: string,
  order: SortOrder,
  sign: SignFilter = 'all',
): SavedCounter[] {
  const normalize = (text: string): string =>
    text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLocaleLowerCase('cs-CZ');
  const search = normalize(query.trim());
  const result = counters.filter((counter) => {
    const matchesName = normalize(counter.name).includes(search);
    const matchesSign =
      sign === 'positive' ? counter.value > 0 : sign === 'negative' ? counter.value < 0 : true;
    return matchesName && matchesSign;
  });
  return result.sort((a, b) => {
    switch (order) {
      case 'oldest':
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
      case 'name-asc':
        return a.name.localeCompare(b.name, 'cs-CZ', { sensitivity: 'base', numeric: true });
      case 'name-desc':
        return b.name.localeCompare(a.name, 'cs-CZ', { sensitivity: 'base', numeric: true });
      case 'value-asc':
        return a.value - b.value;
      case 'value-desc':
        return b.value - a.value;
      default:
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }
  });
}

export interface CounterStatistics {
  count: number;
  total: number;
  average: number | null;
  min: number | null;
  max: number | null;
  positive: number;
  negative: number;
  zero: number;
}

export function summarizeCounters(counters: readonly SavedCounter[]): CounterStatistics {
  const result: CounterStatistics = {
    count: counters.length,
    total: 0,
    average: null,
    min: null,
    max: null,
    positive: 0,
    negative: 0,
    zero: 0,
  };
  for (const { value } of counters) {
    result.total += value;
    result.min = result.min === null ? value : Math.min(result.min, value);
    result.max = result.max === null ? value : Math.max(result.max, value);
    if (value > 0) result.positive++;
    else if (value < 0) result.negative++;
    else result.zero++;
  }
  result.average = result.count === 0 ? null : result.total / result.count;
  return result;
}
