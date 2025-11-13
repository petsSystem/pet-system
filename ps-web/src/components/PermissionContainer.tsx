import { ReactNode } from "react";
import { useProfile } from "@hooks/useProfile";

interface PermissionContainerProps {
  resource: string;
  action: string;
  children: ReactNode;
}

export const PermissionContainer: React.FC<PermissionContainerProps> = ({
  resource,
  action,
  children,
}) => {
  const { profile } = useProfile();

  const hasPermission = profile?.permissions.some(
    (permission) =>
      permission.resource === resource && permission.actions.includes(action)
  );

  return hasPermission ? <>{children}</> : null;
};
