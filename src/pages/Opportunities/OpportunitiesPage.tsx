/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import Table from "../../components/Table/Table";

import { opportunitiesColumns } from './columns';
import type { Opportunity } from '../../models/Opportunity';
import { useDataContext } from '../../hooks/useData/useData';
import { useFilters } from '../../hooks/useFilters/useFilters';
import FilterPanel from '../../components/Filter/Filter';
import { opportunitiesFiltersConfig } from './filters';
import { FilterAlt } from '@mui/icons-material';
import SideDetails from '../../components/SideDetails/SideDetails';
import OportunityDetais from './components/OpportunitiesDetails';

const OpportunitiesPage: React.FC = () => {
  const columns = opportunitiesColumns;

  const { opportunities } = useDataContext();
  const [displayOpportunities, setDisplayOpportunities] = useState<Opportunity[]>([]);
  const [selectedopportunity, setSelectedopportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { filters } = useFilters();
  const opportunitiyFilters = filters.opportunities;
  const filtersConfig = opportunitiesFiltersConfig;
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayOpportunities(opportunities);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
      const { minAmount, maxAmount, ...otherFilters } = opportunitiyFilters;
      let opportunitiesToFilter = [...displayOpportunities];
      const min = minAmount ? parseInt(String(minAmount), 10) : -Infinity;
      const max = maxAmount ? parseInt(String(maxAmount), 10) : Infinity;
      const validMin = isNaN(min) ? -Infinity : min;
      const validMax = isNaN(max) ? Infinity : max;
  
      if (validMin > -Infinity || validMax < Infinity) {
        opportunitiesToFilter = opportunitiesToFilter.filter((opportunity: Opportunity) => 
          opportunity.amount >= validMin && opportunity.amount <= validMax
        );
      }
      const activeOtherFilterKeys = Object.keys(otherFilters).filter(key => otherFilters[key]);
      if (activeOtherFilterKeys.length > 0) {
        opportunitiesToFilter = opportunitiesToFilter.filter(lead => {
          return activeOtherFilterKeys.every(key => {
            const filterValue = otherFilters[key].toString().toLowerCase();
            const leadValue = (lead as any)[key]?.toString().toLowerCase() || '';
            return leadValue.includes(filterValue);
          });
        });
      }
      return opportunitiesToFilter;
    }, [displayOpportunities, opportunitiyFilters]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <p className="text-xl">Loading Opportunities...</p>
      </div>
    );
  }

  const handleOpenDetail = (opportunity: Opportunity) => {
    setSelectedopportunity(opportunity);
  }

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <div>
          <h1 className="text-3xl font-bold mb-2">Opportunities</h1>
          <p>A list of sales opportunities linked to leads.</p>
          <p>Use <strong>View</strong> Action or <strong>double click</strong> any row to see details.</p>
        </div>
        <div>
          <button 
            onClick={() => setIsFilterPanelOpen(true)} 
            className="bg-secondary text-white py-2 px-4 rounded-md hover:opacity-90 flex items-center space-x-2"
          >
            <FilterAlt />
            <span>Filters</span>
          </button>
        </div>
      </div>
            
      <div>
        <FilterPanel
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          config={filtersConfig}
          filterType={'opportunities'}
        />
        <Table
          columns={columns}
          data={filteredOpportunities}
          onRowDoubleClick={(opportunity: Opportunity) => handleOpenDetail(opportunity)}
          onView={(opportunity: Opportunity) => handleOpenDetail(opportunity)}          
        />
        {selectedopportunity && (
          <SideDetails
            isOpen={!!selectedopportunity}
            onClose={() => setSelectedopportunity(null)}
            title={selectedopportunity?.name || ''}
          >
            <OportunityDetais
              opportunity={selectedopportunity}
              onClose={() => setSelectedopportunity(null)}
            />
          </SideDetails>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesPage;

