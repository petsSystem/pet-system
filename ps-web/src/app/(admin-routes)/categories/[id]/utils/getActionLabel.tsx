export type ActionType = "view" | "edit" | "delete" | "add";

export function getActionLabel(action: ActionType): string {
  switch (action) {
    case "view":
      return ""; // Retorna vazio para a ação "view"
    case "edit":
      return "Atualizar dados"; // Retorna "Atualizar dados" para a ação "edit"
    case "delete":
      return "Excluir"; // Retorna "Deletar" para a ação "delete"
    case "add":
      return "Adicionar"; // Retorna "Adicionar" para a ação "add"
    default:
      throw new Error("Ação inválida"); // Lança um erro para ação desconhecida
  }
}
