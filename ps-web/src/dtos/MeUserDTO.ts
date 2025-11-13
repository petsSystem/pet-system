export interface MeUserDTO {
  id: string;
  name: string;
  username: string;
  changePassword: boolean;
  role: string;
  companyId: string;
  currentCompanyId?: string;
  companyName: string;
  permissions: Permission[];
}

interface Permission {
  resource: string;
  actions: string[];
}
