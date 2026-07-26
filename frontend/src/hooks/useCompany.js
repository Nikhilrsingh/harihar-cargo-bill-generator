import { useContext } from 'react';
import { CompanyContext } from '../context/CompanyContext';

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

// Add default export so both import styles work seamlessly
export default useCompany;