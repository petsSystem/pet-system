// hooks/usePermissions.ts
"use client";
import { useContext } from "react";
import { CompanyContext } from "@contexts/CompanyContext";

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useUser must be used within a PermissionsProvider");
  }
  return context;
};
