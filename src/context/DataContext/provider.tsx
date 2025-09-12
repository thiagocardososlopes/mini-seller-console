import React, {  useState, useEffect, type ReactNode } from 'react';
import { DataContext } from './context';
import type { Lead } from "../../models/Leads";
import type { Opportunity } from "../../models/Opportunity";
import leadsData from '../../data/leads.json';
import opportunitiesData from '../../data/opportunities.json';



export const LEADS_STORAGE_KEY = "mini-seller-console-leads";
export const OPORTUNITY_STORAGE_KEY = "mini-seller-console-opportunities";

interface DataProviederProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviederProps> = ({
  children,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const updateLeads = (newLeads: Lead[]) => {
    setLeads(newLeads);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(newLeads));
  }

  const updateOpportunities = (newOpportunities: Opportunity[]) => {
    setOpportunities(newOpportunities);
    localStorage.setItem(OPORTUNITY_STORAGE_KEY, JSON.stringify(newOpportunities));
  }

  useEffect(() => {
    const storedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    } else {
      setLeads(leadsData as Lead[]);
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leadsData as Lead[]));
    };
    

    const storedOpps = localStorage.getItem(OPORTUNITY_STORAGE_KEY);
    if (storedOpps) {
      setOpportunities(JSON.parse(storedOpps));
    } else {
      setOpportunities(opportunitiesData as Opportunity[]);
      localStorage.setItem(OPORTUNITY_STORAGE_KEY, JSON.stringify(opportunitiesData as Opportunity[]));
    };
    
  }, []);

  return (
    <DataContext.Provider value={{ leads, opportunities, updateLeads, updateOpportunities }}>
      {children}
    </DataContext.Provider>
  );
};



