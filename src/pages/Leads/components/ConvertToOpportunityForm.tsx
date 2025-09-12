import React, { useState } from 'react';
import type { Opportunity, OpportunityStage } from '../../../models/Opportunity';
import type { Lead } from '../../../models/Leads';
import { useDataContext } from '../../../hooks/useData/useData';


export interface NewOpportunityData {
  stage: OpportunityStage;
  amount: number | null;
}

interface ConvertToOpportunityFormProps {
  lead: Lead;
  onApply: () => void;
  onCancel: () => void;
}

const ConvertToOpportunityForm: React.FC<ConvertToOpportunityFormProps> = ({ lead, onApply, onCancel }) => {
  const [stage, setStage] = useState<OpportunityStage>('Qualification');
  const [amount, setAmount] = useState('');
  const {opportunities, updateOpportunities} = useDataContext();

  const handleApply = () => {
    const hasSameLead = opportunities.find(opportunity => opportunity.leadId === lead.id);
    if (!hasSameLead){
      const lastElementIndex = opportunities.length - 1;
      const newOpportunity: Opportunity = {
        id: opportunities[lastElementIndex].id  + 1,
        name: `${lead.company} - ${lead.name} `,
        accountName: lead.company,
        amount: parseFloat(amount),
        stage,
        leadId: lead.id,
        description: lead.description,
      }
      updateOpportunities([...opportunities, newOpportunity]);
    } else {
      alert('This lead has already been converted to an opportunity.');
    }
    onApply();
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md">
      <h3 className="font-bold text-lg mb-4">Convert "{lead.name}"</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Stage</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as OpportunityStage)}
            className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary"
          >
            <option value="Qualification">Qualification</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Amount (Optional)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 5000"
            className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      <div className="mt-6 flex space-x-2">
        <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-semibold">
          Return
        </button>
        <button onClick={handleApply} className="flex-1 bg-primary text-white font-bold py-2 px-4 rounded-md hover:opacity-90">
          Apply Conversion
        </button>
      </div>
    </div>
  );
};

export default ConvertToOpportunityForm;
