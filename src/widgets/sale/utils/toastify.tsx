import { ReactNode } from 'react';
import { toast } from 'react-toastify';

export const notify = (message?: string | ReactNode) => {
  toast.success(message || 'Successful');
};
