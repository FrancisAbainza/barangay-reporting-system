// FormDraftContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { ComplaintFormData } from '../schemas/complaints';

type ComplaintDraft = Partial<ComplaintFormData>;

type FormDraftContextType = {
  draft: ComplaintDraft | null;
  setDraft: (data: ComplaintDraft) => void;
  clearDraft: () => void;
};

const FormDraftContext = createContext<FormDraftContextType | null>(null);

export function FormDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<ComplaintDraft | null>(null);

  return (
    <FormDraftContext.Provider
      value={{
        draft,
        setDraft,
        clearDraft: () => setDraft(null),
      }}
    >
      {children}
    </FormDraftContext.Provider>
  );
}

export const useFormDraft = () => {
  const ctx = useContext(FormDraftContext);
  if (!ctx) throw new Error('useFormDraft must be used inside FormDraftProvider');
  return ctx;
};
