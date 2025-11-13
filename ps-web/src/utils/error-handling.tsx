import { useEffect } from "react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface ErrorHandlingProps {
  children: ReactNode;
}

export default function ErrorHandling({ children }: ErrorHandlingProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      // Limpar token do armazenamento local ao iniciar a mudança de rota
      // localStorage.removeItem("token");
      console.log("mudou de rota");
    };

    // Adicionar um ouvinte de evento para lidar com a mudança de rota
    router.events.on("routeChangeStart", handleRouteChange);

    // Remover o ouvinte de evento ao desmontar o componente
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]); // Executar o efeito quando o evento de mudança de rota mudar

  // Renderizar os elementos filhos
  return <>{children}</>;
}
