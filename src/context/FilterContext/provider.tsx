import React, {  useState, useEffect, type ReactNode } from 'react';
import type { FilterState, FilterValues } from './types';
import { FilterContext } from './context';

const loadFromStorage = (key: string, defaultValue: unknown) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return defaultValue;
  }
};

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    leads: loadFromStorage('leadFilters', {}),
    opportunities: loadFromStorage('opportunityFilters', {}),
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('leadFilters', JSON.stringify(filters.leads));
      window.localStorage.setItem('opportunityFilters', JSON.stringify(filters.opportunities));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [filters]);

  const updateFilters = (type: 'leads' | 'opportunities', newFilters: FilterValues) => {
    setFilters(prev => ({
      ...prev,
      [type]: newFilters,
    }));
  };

  const clearFilters = (type: 'leads' | 'opportunities') => {
    setFilters(prev => ({
      ...prev,
      [type]: {},
    }));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};
