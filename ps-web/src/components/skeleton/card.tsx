import React from "react";

export function SkeletonCard() {
  return (
    <div
      role="status"
      className="rounded animate-pulse h-full w-full  grid grid-cols-2 gap-4  "
    >
      {[1, 2].map((index) => (
        <div
          key={index}
          className="p-4 bg-primary-100 h-40 grid grid-cols-3 gap-4 rounded-md h-10 "
        >
          <div className="bg-primary-100  dark:bg-gray-700 w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
