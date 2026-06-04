import toast, { type ToastOptions } from "react-hot-toast";

export const onSuccess = (text: string, options?: ToastOptions) => {
  if (localStorage.getItem("vibration") !== "false") navigator.vibrate?.(50);

  toast.success(text, options);
};
