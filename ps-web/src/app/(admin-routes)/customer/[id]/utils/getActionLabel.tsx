export type ActionType = "view" | "edit" | "delete" | "add";

export function getActionLabel(action: ActionType): string {
  switch (action) {
    case "view":
      return "Visualização";
    case "edit":
      return "Atualizar informações";
    case "delete":
      return "Excluir";
    case "add":
      return "Adicionar";
    default:
      throw new Error("Ação inválida");
  }
}
