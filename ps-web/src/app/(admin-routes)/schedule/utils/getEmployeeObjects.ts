import { EmployeeDTO } from "@dtos/EmployeeDTO";

interface OriginalObject {
  id: string;
  email: string;
  changePassword: boolean;
  role: string;
  active: boolean;
  employee: EmployeeDTO;
  accessGroupIds: string[];
}

export function getEmployeeObjects(
  originalArray: OriginalObject[]
): EmployeeDTO[] {
  return originalArray
    .filter((item) => item.employee !== null && item.employee !== undefined)
    .map((item) => item.employee!); // usando "!" para afirmar que employee existe
}
