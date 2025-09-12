import React, { useState, useEffect } from 'react';
import { Mail, Business, BarChart, TrackChanges, CheckCircle, RadioButtonUnchecked, Note } from '@mui/icons-material';
import type { Lead, } from '../../../models/Leads';
import ConvertToOpportunityForm from './ConvertToOpportunityForm';

interface LeadDetaisProps {
  lead: Lead;
  onSave: (updatedLead: Lead) => void;
  onConvert: (lead: Lead) => void;
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

const LeadDetais: React.FC<LeadDetaisProps> = ({ lead, onSave, onConvert }) => {
  const [editedLead, setEditedLead] = useState<Lead>(lead);
  const [hasChanges, setHasChanges] = useState(false);
  const [openConvertForm, setOpenConvertForm] = useState(false);
  
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    setEditedLead(lead);
    setHasChanges(false);
    setEmailError(null); 
  }, [lead]);

  
  const handleChange = (field: keyof Lead, value: string) => {
    if (field === 'email') {
      
      const isValidEmail = /^\S+@\S+\.\S+$/.test(value);
      if (!isValidEmail) {
        setEmailError('Invalid email format');
      } else {
        setEmailError(null);
      }
    }
    setEditedLead(prev => ({ ...prev, [field]: value as unknown }));
    setHasChanges(true);
  };

  const handleSave = () => {
    
    if (emailError) {
      alert('Please fix the errors before saving.');
      return;
    }
    onSave(editedLead);
    setHasChanges(false);
  };
  
  const handleConvert = () => {
    setOpenConvertForm(true);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <DetailItem icon={<BarChart />} label="Score" value={editedLead.score} />
        <DetailItem icon={<Business />} label="Company" value={editedLead.company} />
        <DetailItem icon={<TrackChanges />} label="Source" value={editedLead.source} />

        <hr className="my-4 dark:border-gray-700"/>

        <div className="mb-4">
          <label className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
            <Mail className="text-primary" />
            <span>Email</span>
          </label>
          <input
            type="email"
            value={editedLead.email}
            onChange={(e) => handleChange('email', e.target.value)}
            
            className={`mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-primary focus:border-primary ${emailError ? 'border-red-500' : 'dark:border-gray-600'}`}
          />

          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
            {editedLead.status === 'Converted' ? <CheckCircle className="text-green-500" /> : <RadioButtonUnchecked className="text-primary" />}
            <span>Status</span>
          </label>
          <select
            value={editedLead.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary appearance-none"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Unqualified">Unqualified</option>
            <option value="Converted">Converted</option>
          </select>
        </div>
        <div className="flex items-center space-x-3 mb-4">
          <div>
            <div className='flex items-center gap-2'>
              <div className="text-primary">{<Note />}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
            </div>
            <p className="font-semibold">{editedLead.description}</p>
          </div>
        </div>
      </div>
      
      {openConvertForm ? (
        <ConvertToOpportunityForm
          lead={lead}
          onApply={() => {
            setOpenConvertForm(false);
            onConvert(editedLead);
          }}
          onCancel={() => setOpenConvertForm(false)}
        />
      ) : (
        <div className="mt-6 pt-4 border-t dark:border-gray-700 flex flex-col space-y-3">
          <button
            onClick={handleConvert}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={editedLead.status === 'Converted'}
          >
            Convert to Opportunity
          </button>
          <button 
            onClick={handleSave}
            
            disabled={!hasChanges || !!emailError}
            className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      )}
      </div>
  );
};

export default LeadDetais;

