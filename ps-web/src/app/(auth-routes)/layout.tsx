"use client";
import { useEffect } from "react";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { parseCookies } from "nookies";
import { useAuth } from "@hooks/useAuth";

interface PrivateLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PrivateLayoutProps) {
  const { token } = useAuth();
  if (token) {
    redirect("/admin");
  }

  return <>{children}</>;
}
