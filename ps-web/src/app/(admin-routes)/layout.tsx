"use client";
import { ReactNode, useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@hooks/useAuth";
import { useProfile } from "@hooks/useProfile";
import { useCompany } from "@hooks/useCompany";
import { LayoutPS } from "@components/template/Layout";
import { CalendarProvider } from "@/src/contexts/CalendarContext";

interface PrivateLayoutProps {
  children: ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const { token } = useAuth();
  const { getProfile } = useProfile();
  const { getCompanies } = useCompany();

  useEffect(() => {
    if (token) {
      getProfile();
      getCompanies();
    } else {
      redirect("/");
    }
  }, [token]);

  return (
    <CalendarProvider>
      <LayoutPS
        title="Página inicial"
        subTitle="Pagina em construção"
        menu="Dashboard"
      >
        {children}
      </LayoutPS>
    </CalendarProvider>
  );
}
