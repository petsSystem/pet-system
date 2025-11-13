interface PermissionCheckParams {
  permissions?: any[]; // Substitua YourRoleType pelo tipo real do seu projeto
  resource: string;
  action: string;
}

export function checkPermission({
  permissions,
  resource,
  action,
}: PermissionCheckParams): boolean {
  return (
    permissions?.some(
      (permission: any) =>
        permission.resource === resource && permission.actions.includes(action)
    ) || false
  );
}
