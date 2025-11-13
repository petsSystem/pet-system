"use client";
import { useEffect } from "react";

import { LayoutPS } from "@components/template/Layout";
import { AppProvider } from "@contexts/AppContext";
import { AuthContextProvider } from "@contexts/AuthContext";

export default function Home() {
  function handleSigin() {}

  return (
    <AuthContextProvider>
      <AppProvider>
        <main>
          <LayoutPS
            title="Página inicial"
            subTitle="Pagina em construção"
            menu=""
          >
            <h3>Conteudo</h3>
          </LayoutPS>
        </main>
      </AppProvider>
    </AuthContextProvider>
  );
}
