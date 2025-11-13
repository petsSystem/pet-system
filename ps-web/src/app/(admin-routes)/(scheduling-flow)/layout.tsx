"use client";
import { ReactNode } from "react";
import { AppointmentProvider } from "@/src/contexts/AppointmentContext";

interface PrivateLayoutProps {
  children: ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return <>{children}</>;
}
