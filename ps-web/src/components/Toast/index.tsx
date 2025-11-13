import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastPS = (
  message: string,
  type: "info" | "success" | "warning" | "error" = "success"
) => {
  const toastOptions: ToastOptions<{}> = {
    position: "top-right" as "top-right", // Forçando o tipo correto
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  switch (type) {
    case "info":
      toast.info(message, toastOptions);
      break;
    case "success":
      toast.success(message, toastOptions);
      break;
    case "warning":
      toast.warn(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    default:
      toast.success(message, toastOptions);
      break;
  }
};
