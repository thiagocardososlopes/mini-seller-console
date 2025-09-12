import { createContext } from "react";
import type { Lead } from "../../models/Leads";
import type { Opportunity } from "../../models/Opportunity";

export type DataContextType = {
  leads: Lead[];
  opportunities: Opportunity[];
  updateLeads: (leads: Lead[]) => void;
  updateOpportunities: (opps: Opportunity[]) => void;
};

export const DataContext = createContext<DataContextType | undefined>(undefined);
