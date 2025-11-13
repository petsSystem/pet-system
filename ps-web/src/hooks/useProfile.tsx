// hooks/usePermissions.ts
"use client";
import { useContext } from "react";
import { ProfileContext } from "@contexts/ProfileContext";

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useUser must be used within a PermissionsProvider");
  }
  return context;
};
