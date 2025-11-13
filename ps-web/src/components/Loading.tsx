import React from "react";

interface LoadingProps {
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ text }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 dark:bg-gray-800 z-50  bg-opacity-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-300 dark:border-white"></div>
      {text && <p className="ml-2 text-primary dark:text-white">{text}</p>}
    </div>
  );
};
