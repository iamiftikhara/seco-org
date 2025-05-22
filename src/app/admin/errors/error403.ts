import { showConfirmDialog } from '@/utils/alert';

export const handle403Response = async () => {

    sessionStorage.clear();
  
  const result = await showConfirmDialog({
    title: 'Account Inactive',
    text: 'Your account is currently inactive. Please contact the administrator for assistance.',
    icon: 'warning',
    confirmButtonText: 'OK',
    showCancelButton: false,
  });
  return result.isConfirmed;
};
