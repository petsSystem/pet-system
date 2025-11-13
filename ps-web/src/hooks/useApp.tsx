import { useContext } from "react";
import { AppContext } from "@contexts/AppContext";

export function useApp() {
  const context = useContext(AppContext);

  return context;
}
