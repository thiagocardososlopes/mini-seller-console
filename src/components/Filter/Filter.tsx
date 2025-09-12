import React, { useState, useEffect } from 'react';
import { useFilters } from '../../hooks/useFilters/useFilters';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number';
  options?: { value: string; label: string }[];
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: FilterConfig[];
  filterType: 'leads' | 'opportunities';
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, config, filterType }) => {
  const { filters, updateFilters, clearFilters } = useFilters();
  const globalFilters = filters[filterType];
  
  const [localFilters, setLocalFilters] = useState(globalFilters);

  useEffect(() => {
    setLocalFilters(globalFilters);
  }, [isOpen, globalFilters]);

  const handleInputChange = (key: string, value: string | number) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    updateFilters(filterType, localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    clearFilters(filterType);
    onClose();
  };

  return (
    <>
      <div 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        className={`fixed inset-0 z-30 transition-opacity ease-in-out duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed bg-secondary text-text-light top-0 right-0 h-full w-80 shadow-xl z-40 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={onClose} className="hover:text-primary">&times;</button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {config.map(({ key, label, type, options }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                {type === 'text' && (
                  <input
                    type="text"
                    value={localFilters[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full border rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                  />
                )}
                {type === 'number' && (
                  <input
                    type="number"
                    value={localFilters[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full border rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                  />
                )}
                {type === 'select' && (
                  <div className="relative">
                    <select
                      value={localFilters[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full bg-secondary text-white border p-2 rounded-md focus:ring-primary focus:border-primary appearance-none"
                    >
                      <option value="">All</option>
                      {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex space-x-2">
            <button onClick={handleApply} className="flex-1 bg-primary py-2 px-4 rounded-md hover:opacity-90">
              Apply
            </button>
            <button onClick={handleClear} className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
