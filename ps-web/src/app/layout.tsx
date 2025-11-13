// import "./globals.css";
import "./css/style.css";

import { Inter } from "next/font/google";

import type { Metadata } from "next";
import { AuthContextProvider } from "@contexts/AuthContext";
import ToastProvider from "@providers/toast.provider";
import { AppointmentProvider } from "@/src/contexts/AppointmentContext";
import { ProfileProvider } from "@contexts/ProfileContext";
import { CompanyProvider } from "@contexts/CompanyContext";
import { AppProvider } from "@contexts/AppContext";

import Theme from "./theme-provider";
import { CategoryProvider } from "../contexts/CategoryContext";
import { CalendarProvider } from "../contexts/CalendarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Petshop APP",
  description: "Aplication PetShop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={` flex justify-center	 ${inter.className} bg-slate-100`}>
        <AppProvider>
          <ToastProvider>
            <main className="flex justify-center min-w-full	 min-h-screen">
              <AuthContextProvider>
                <ProfileProvider>
                  <AppointmentProvider>
                    <CompanyProvider>
                      <CategoryProvider>
                        <CalendarProvider>{children}</CalendarProvider>
                      </CategoryProvider>
                    </CompanyProvider>
                  </AppointmentProvider>
                </ProfileProvider>
              </AuthContextProvider>
            </main>
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
