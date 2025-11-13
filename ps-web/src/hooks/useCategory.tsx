// hooks/usePermissions.ts
"use client";
import { useContext } from "react";
import { CategoryContext } from "@contexts/CategoryContext";

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useUser must be used within a PermissionsProvider");
  }
  return context;
};
