import { SavedCounter } from '../models/saved-counter';
import { SortOrder } from '../models/history-options';

// The source array is never mutated by searching or sorting.
export function selectCounters(
  counters: readonly SavedCounter[],
  query: string,
  order: SortOrder,
): SavedCounter[] {
  const normalize = (text: string): string =>
    text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('cs-CZ');
  const search = normalize(query.trim());
  const result = counters.filter((counter) => normalize(counter.name).includes(search));
  return result.sort((a, b) => {
    switch (order) {
      case 'oldest': return Date.parse(a.createdAt) - Date.parse(b.createdAt);
      case 'name-asc': return a.name.localeCompare(b.name, 'cs-CZ', { sensitivity: 'base', numeric: true });
      case 'name-desc': return b.name.localeCompare(a.name, 'cs-CZ', { sensitivity: 'base', numeric: true });
      case 'value-asc': return a.value - b.value;
      case 'value-desc': return b.value - a.value;
      default: return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }
  });
}
