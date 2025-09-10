import toast from "react-hot-toast";

export const onSuccess = (text: string) => {
  if (localStorage.getItem("vibration") !== "false") navigator.vibrate?.(50);

  toast.success(text);
};
