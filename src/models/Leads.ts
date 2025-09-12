export type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  source: 'Website' | 'Referral' | 'Event' | 'Cold Call';
  score: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Converted';
  description: string;
};