// components/Modal.tsx
import React, { ReactNode } from "react";
import { IconClose } from "@components/icons";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50	">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-md w-4/5 md:w-2/5 h-3/4 relative">
        {children}
        <button
          className="p-4  text-red-500 absolute top-5 right-5 "
          onClick={() => setIsOpen(false)}
        >
          {IconClose}
        </button>
      </div>
    </div>
  );
};

export default Modal;
