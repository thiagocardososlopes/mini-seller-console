export type OpportunityStage = 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export type Opportunity = {
  id: number;
  name: string;
  accountName: string;
  amount: number;
  stage: OpportunityStage;
  leadId: number;
  description: string;
};