// components/Badge.tsx
import React from "react";

interface BadgeProps {
  label: string;
  color: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color }) => {
  return (
    <div className="m-1.5">
      <div
        className={`text-xs inline-flex font-medium bg-${color}-100 dark:bg-${color}-500/30 text-${color}-600 dark:text-${color}-400 rounded-full text-center px-2.5 py-1`}
      >
        {label}
      </div>
    </div>
  );
};
