// components/sidebar/SidebarRoutes.tsx
import {
  IconDashboard,
  IconStore,
  IconCalendar,
  IconUser,
  IconUserPlus,
  IconPuzzle,
  IconSquaresPlus,
  IconUserGroup,
} from "@components/icons";
import { ResourcesEnum } from "@enums/Resource";

export const sidebarRoutes = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: IconDashboard,
    resource: ResourcesEnum.ADMIN,
  },
  {
    to: "/company",
    label: "Petshop",
    icon: IconStore,
    resource: ResourcesEnum.COMPANY,
  },
  {
    to: "/user",
    label: "Usuários",
    icon: IconUserPlus,
    resource: ResourcesEnum.USER,
  },
  {
    to: "/categories",
    label: "Categorias",
    icon: IconSquaresPlus,
    resource: ResourcesEnum.CATEGORY,
  },
  {
    to: "/services",
    label: "Serviços",
    icon: IconPuzzle,
    resource: ResourcesEnum.SERVICE,
  },
  {
    to: "/customer",
    label: "Clientes",
    icon: IconUserGroup,
    resource: ResourcesEnum.CUSTOMER,
  },
  {
    to: "/employee",
    label: "Funcionários",
    icon: IconUser,
    resource: ResourcesEnum.EMPLOYEE,
  },
  {
    to: "/schedule",
    label: "Agenda",
    icon: IconCalendar,
    resource: ResourcesEnum.SCHEDULE,
  },
];

export default sidebarRoutes;
