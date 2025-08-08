import toast from "react-hot-toast";

export const onError = (errorText = "Something went wrong!", error?: Error) => {
  if (error) console.error(error);

  navigator.vibrate?.(200);
  toast.error(errorText);
};
