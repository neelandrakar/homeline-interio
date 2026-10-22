import React, { createContext, useContext, useState } from 'react';
import { LeadFormData } from '../types';

interface LeadModalContextType {
  isOpen: boolean;
  prefillData: Partial<LeadFormData>;
  openModal: (initialData?: Partial<LeadFormData>) => void;
  closeModal: () => void;
}

const LeadModalContext = createContext<LeadModalContextType | undefined>(undefined);

export const LeadModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<Partial<LeadFormData>>({});

  const openModal = (initialData: Partial<LeadFormData> = {}) => {
    setPrefillData(initialData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPrefillData({});
  };

  return (
    <LeadModalContext.Provider value={{ isOpen, prefillData, openModal, closeModal }}>
      {children}
    </LeadModalContext.Provider>
  );
};

export const useLeadModal = (): LeadModalContextType => {
  const context = useContext(LeadModalContext);
  if (!context) {
    throw new Error('useLeadModal must be used within a LeadModalProvider');
  }
  return context;
};
