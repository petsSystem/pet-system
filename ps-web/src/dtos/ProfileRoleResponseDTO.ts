type PermissionAction = "SHOW" | "CREATE" | "EDIT" | "ACTIVATE";

interface Permission {
  resource: string;
  actions: PermissionAction[];
}

export interface ProfileRoleResponseDTO {
  id: string;
  name: string;
  role: string;
  permissions: Permission[];
}
