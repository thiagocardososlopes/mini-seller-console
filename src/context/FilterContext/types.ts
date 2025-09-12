export type FilterValues = { [key: string]: string | number };

export interface FilterState {
  leads: FilterValues;
  opportunities: FilterValues;
}

export interface FilterContextType {
  filters: FilterState;
  updateFilters: (type: 'leads' | 'opportunities', newFilters: FilterValues) => void;
  clearFilters: (type: 'leads' | 'opportunities') => void;
}