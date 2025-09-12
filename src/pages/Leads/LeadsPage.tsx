/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import Table from "../../components/Table/Table";
import { leadColumns } from "./columns";

import type { Lead } from '../../models/Leads';
import FilterPanel from '../../components/Filter/Filter';
import { leadFiltersConfig } from './filters';
import { FilterAlt } from '@mui/icons-material';
import { useFilters } from '../../hooks/useFilters/useFilters';
import { useDataContext } from '../../hooks/useData/useData';
import SideDetails from '../../components/SideDetails/SideDetails';
import LeadDetailView from './components/LeadDetails';

const LeadsPage: React.FC = () => {
  const columns = leadColumns;
  
  const { filters } = useFilters();
  const leadFilters = filters.leads;
  const filtersConfig = leadFiltersConfig;
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  
  const { leads, updateLeads } = useDataContext();
  const [allLeads, setAllLeads] = useState<Lead[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (allLeads.length === 0) {
      const timer = setTimeout(() => {
        const sortedLeads: Lead[] = [...leads as Lead[]].sort((a, b) => b.score - a.score);
        setAllLeads(sortedLeads);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [allLeads.length, leads]);

  useEffect(() => {
    if (allLeads.length > 0) {
      updateLeads(allLeads);
    }
  }, [allLeads, updateLeads]);

  const filteredLeads = useMemo(() => {
    const { minScore, maxScore, ...otherFilters } = leadFilters;
    let leadsToFilter = [...allLeads];
    const min = minScore ? parseInt(String(minScore), 10) : -Infinity;
    const max = maxScore ? parseInt(String(maxScore), 10) : Infinity;
    const validMin = isNaN(min) ? -Infinity : min;
    const validMax = isNaN(max) ? Infinity : max;

    if (validMin > -Infinity || validMax < Infinity) {
      leadsToFilter = leadsToFilter.filter(lead => 
        lead.score >= validMin && lead.score <= validMax
      );
    }
    const activeOtherFilterKeys = Object.keys(otherFilters).filter(key => otherFilters[key]);
    if (activeOtherFilterKeys.length > 0) {
      leadsToFilter = leadsToFilter.filter(lead => {
        return activeOtherFilterKeys.every(key => {
          const filterValue = otherFilters[key].toString().toLowerCase();
          const leadValue = (lead as any)[key]?.toString().toLowerCase() || '';
          return leadValue.includes(filterValue);
        });
      });
    }
    return leadsToFilter;
  }, [allLeads, leadFilters]);

  const handleSaveLead = (updatedLead: Lead) => {
    setAllLeads(prevLeads => 
      prevLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead))
    );
    setSelectedLead(null);
  };

  const handleConvertLead = (leadToConvert: Lead) => {
    const updatedLead = { ...leadToConvert, status: 'Converted' as const };

    setAllLeads(prevLeads => 
      prevLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead))
    );

    setSelectedLead(null);
  };
  
  const handleCloseDetail = () => {
    setSelectedLead(null);
  }

  if (isLoading && allLeads.length === 0) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <p className="text-xl">Loading leads...</p>
      </div>
    );
  }

  const handleOpenDetail = (lead: Lead) => {
    setSelectedLead(lead);
  }

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <div>
          <h1 className="text-3xl font-bold mb-2">Leads</h1>
          <p>A list of potential customers ranked by their interest score.</p>
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
          filterType={'leads'}
        />
        <Table
          columns={columns}
          data={filteredLeads}
          onRowDoubleClick={(lead: Lead) => handleOpenDetail(lead)}
          onView={(lead: Lead) => handleOpenDetail(lead)} 
        />
      </div>
      
      {selectedLead && (
        <SideDetails
          isOpen={!!selectedLead} 
          onClose={handleCloseDetail} 
          title={selectedLead.name} 
        >
          <LeadDetailView
            lead={selectedLead}
            onSave={handleSaveLead}
            onConvert={handleConvertLead}
          />
        </SideDetails>
      )}
    </div>
  );
};

export default LeadsPage;


