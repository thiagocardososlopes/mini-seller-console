import React, { type ReactNode } from 'react';

interface SideDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const SideDetails: React.FC<SideDetailsProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      <div
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ease-in-out duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div
        className={`fixed dark:bg-bg-dark bg-bg-light top-0 right-0 h-full w-full max-w-lg shadow-xl z-50 transform transition-transform ease-in-out duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-primary text-3xl leading-none"
              aria-label="Close details panel"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDetails;

