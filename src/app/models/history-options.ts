export const SORT_ORDERS = ['newest', 'oldest', 'name-asc', 'name-desc', 'value-asc', 'value-desc'] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];
