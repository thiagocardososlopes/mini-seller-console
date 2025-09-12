import type { FilterConfig } from "../../components/Filter/Filter";

const stagesOptions = [
  { value: 'Qualification', label: 'Qualification' },
  { value: 'Proposal', label: 'Proposal' },
  { value: 'Negotiation', label: 'Negotiation' },
  { value: 'Closed Won', label: 'Closed Won' },
  { value: 'Closed Lost', label: 'Closed Lost' },
];

export const opportunitiesFiltersConfig: FilterConfig[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'accountName', label: 'Account Name', type: 'text' },
  { key: 'stage', label: 'Stage', type: 'select', options: stagesOptions},
  { key: 'maxAmount', label: 'Max Amount', type: 'number' },
  { key: 'minAmount', label: 'Minimum Amount', type: 'number' },
];
