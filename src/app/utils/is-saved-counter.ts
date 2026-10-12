import { SavedCounter } from '../models/saved-counter';

export function isSavedCounter(value: unknown): value is SavedCounter {
  if (typeof value !== 'object' || value === null) return false;
  const counter = value as Record<string, unknown>;
  return (
    typeof counter['id'] === 'string' && counter['id'].trim().length > 0 &&
    typeof counter['name'] === 'string' && counter['name'].trim().length > 0 &&
    typeof counter['value'] === 'number' && Number.isSafeInteger(counter['value']) &&
    typeof counter['createdAt'] === 'string' && Number.isFinite(Date.parse(counter['createdAt']))
  );
}
