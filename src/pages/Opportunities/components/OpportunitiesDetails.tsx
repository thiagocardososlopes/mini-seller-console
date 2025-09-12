import React, { useState } from 'react';
import { CheckCircle, RadioButtonUnchecked, Note, Person, Paid, Cancel, Warning } from '@mui/icons-material';
import type { Opportunity } from '../../../models/Opportunity';
import { useDataContext } from '../../../hooks/useData/useData';
import type { Lead } from '../../../models/Leads';

interface OportunityDetaisProps {
  opportunity: Opportunity;
  onClose: () => void;
}

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="flex items-center space-x-3 mb-4">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const OportunityDetais: React.FC<OportunityDetaisProps> = ({ opportunity, onClose }) => {
  const [editedOpportunity, setEditedOpportunity] = useState<Opportunity>(opportunity);
  const [openConfirmRollback, setOpenConfirmRollback] = useState(false);
  const {opportunities, leads, updateOpportunities, updateLeads } = useDataContext();
  
  const handleChange = (field: keyof Opportunity, value: string) => {
    setEditedOpportunity(prev => ({ ...prev, [field]: value as unknown }));
  };

  const handleSave = () => {
    const index = opportunities.findIndex(op => op.id === editedOpportunity.id);
    if (index !== -1) {
      const updatedOpportunities = [...opportunities];
      updatedOpportunities[index] = editedOpportunity;
      updateOpportunities(updatedOpportunities);
      onClose();
    }
  };

  const handleRollback = () => {
    const updatedOpportunities = opportunities.filter(op => op.id !== opportunity.id);
    updateOpportunities(updatedOpportunities);

    const edditedLead = leads.find(lead => lead.id === opportunity.leadId);
    if (edditedLead) {
      edditedLead.status = 'New';
    }
    updateLeads([...leads.filter(lead => lead.id !== edditedLead?.id), edditedLead] as Lead[]);
    onClose();
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <DetailItem icon={<Person />} label="Account Name" value={opportunity.accountName} />
        <DetailItem icon={<Paid />} label="Amount" value={
          new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(opportunity.amount) || 0)
          } />

        <hr className="my-4 dark:border-gray-700"/>

        <div className="mb-4">
          <label className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
            {
              editedOpportunity.stage === 'Closed Won' ? <CheckCircle className="text-green-500" /> :
              editedOpportunity.stage === 'Closed Lost' ? <Cancel className="text-red-500" /> :
              <RadioButtonUnchecked className="text-primary" />
            }
            <span>Status</span>
          </label>
          <select
            value={editedOpportunity.stage}
            onChange={(e) => handleChange('stage', e.target.value)}
            className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary appearance-none"
          >
            <option value="Qualification">Qualification</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
        </div>
        <div className="flex items-center space-x-3 mb-4">
          <div>
            <div className='flex items-center gap-2'>
              <div className="text-primary">{<Note />}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
            </div>
            <p className="font-semibold">{editedOpportunity.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t dark:border-gray-700 flex flex-col space-y-3">
        {openConfirmRollback ? (
          <div className='flex flex-col gap-2'>
          <p className="mb-4"><Warning/> Are you sure you want to rollback this opportunity? This action cannot be undone.</p>
          <div className='flex justify-between gap-4'>
            <button
            onClick={() => setOpenConfirmRollback(false)}
            className="w-1/2 bg-secondary text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRollback}
              className="w-1/2 bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Confirm Rollback
            </button>
          </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setOpenConfirmRollback(true)}
              className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Rollback to Lead
            </button>
            <button 
              onClick={handleSave}
              className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OportunityDetais;

