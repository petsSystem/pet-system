import React from "react";

export function SkeletonTable() {
  return (
    <div
      role="status"
      className="divide-y divide-gray-200 rounded animate-pulse"
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="flex items-center justify-between p-4">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mr-20"></div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
