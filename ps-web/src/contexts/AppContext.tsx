"use client";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Loading } from "../components/Loading";

type Theme = "dark" | "";

export type AppContextDataProps = {
  theme: Theme;
  switchTheme: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContext = createContext<AppContextDataProps>(
  {} as AppContextDataProps
);

export function AppProvider({ children }: AppContextProviderProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function switchTheme() {
    setTheme(theme === "" ? "dark" : "");
  }

  return (
    <AppContext.Provider
      value={{
        theme,
        switchTheme,
        sidebarOpen,
        setSidebarOpen,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
      {isLoading ? <Loading /> : null}
    </AppContext.Provider>
  );
}
