import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
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

export const showAlert = async (options: AlertOptions): Promise<SweetAlertResult<any>> => {
  const { title, text, icon = 'info', timer = 3000, showConfirmButton = false } = options;

  const alertOptions: SweetAlertOptions = {
    icon,
    title: text,
    background: theme.colors.background.primary,
    color: theme.colors.text.primary,
    timer,
    showConfirmButton,
    customClass: {
      container: '',
      popup: 'swal2-modern',
      title: 'swal2-title-modern',
      htmlContainer: 'swal2-content-modern',
      closeButton: '',
      icon: '',
      image: '',
      input: '',
      inputLabel: '',
      validationMessage: '',
      actions: '',
      confirmButton: '',
      denyButton: '',
      cancelButton: '',
      loader: '',
      footer: ''
    }
  };

  return Toast.fire(alertOptions);
};

export const showConfirmDialog = async (options: {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}): Promise<SweetAlertResult<any>> => {
  const {
    title,
    text,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel'
  } = options;

  const confirmOptions: SweetAlertOptions = {
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
      container: '',
      popup: 'swal2-modern',
      title: 'swal2-title-modern',
      htmlContainer: 'swal2-content-modern',
      closeButton: '',
      icon: '',
      image: '',
      input: '',
      inputLabel: '',
      validationMessage: '',
      actions: '',
      confirmButton: 'swal2-confirm-modern',
      denyButton: '',
      cancelButton: 'swal2-cancel-modern',
      loader: '',
      footer: ''
    }
  };

  return Swal.fire(confirmOptions);
};