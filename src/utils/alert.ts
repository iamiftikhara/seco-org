import Swal from 'sweetalert2';
import { theme } from '@/config/theme';

interface AlertOptions {
  title?: string;
  text: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  timer?: number;
  showConfirmButton?: boolean;
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const showAlert = async (options: AlertOptions) => {
  const { title, text, icon = 'info', timer = 3000, showConfirmButton = false } = options;

  return Toast.fire({
    icon,
    title: text,
    background: theme.colors.background.primary,
    color: theme.colors.text.primary,
    timer,
    showConfirmButton,
    customClass: {
      popup: 'swal2-modern',
      title: 'swal2-title-modern',
      content: 'swal2-content-modern'
    }
  });
};

export const showConfirmDialog = async (options: {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}) => {
  const {
    title,
    text,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel'
  } = options;

  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    background: theme.colors.background.primary,
    color: theme.colors.text.primary,
    confirmButtonColor: theme.colors.status.success,
    cancelButtonColor: theme.colors.status.error,
    reverseButtons: true,
    customClass: {
      popup: 'swal2-modern',
      title: 'swal2-title-modern',
      content: 'swal2-content-modern',
      cancelButton: 'swal2-cancel-modern',
      confirmButton: 'swal2-confirm-modern'
    }
  });
};