import { toast as _toast, ToastOptions } from "react-toastify";

const BASE: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const toast = {
  success: (msg: string, opts?: ToastOptions) =>
    _toast.success(msg, { ...BASE, ...opts }),
  error: (msg: string, opts?: ToastOptions) =>
    _toast.error(msg, { ...BASE, autoClose: 6000, ...opts }),
  info: (msg: string, opts?: ToastOptions) =>
    _toast.info(msg, { ...BASE, ...opts }),
  warning: (msg: string, opts?: ToastOptions) =>
    _toast.warning(msg, { ...BASE, ...opts }),
  loading: (msg: string, opts?: ToastOptions) =>
    _toast.loading(msg, { ...BASE, autoClose: false, ...opts }),
  dismiss: _toast.dismiss,
  update: _toast.update,
};

export default toast;
