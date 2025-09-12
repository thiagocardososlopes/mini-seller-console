import type { FilterConfig } from "../../components/Filter/Filter";

const statusOptions = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Unqualified', label: 'Unqualified' },
  { value: 'Converted', label: 'Converted' },
];

const sourceOptions = [
  { value: 'Website', label: 'Website' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Event', label: 'Event' },
  { value: 'Cold Call', label: 'Cold Call' },
];

export const leadFiltersConfig: FilterConfig[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: statusOptions },
  { key: 'source', label: 'Source', type: 'select', options: sourceOptions },
  { key: 'maxScore', label: 'Maximum Source', type: 'number' },
  { key: 'minScore', label: 'Minimum Source', type: 'number' },
];
