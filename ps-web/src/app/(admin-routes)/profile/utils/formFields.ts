import { IconList, IconStore, IconUser } from "@components/icons";
import { TField, TOption } from "@interfaces/DynamicForm";

const statusOptions: TOption[] = [
  { label: "ativo", value: "true" },
  { label: "inativo", value: "false" },
];

const typeOptions: TOption[] = [
  { label: "Tosador", value: "GROOMER" },
  { label: "Banhista", value: "BATHER" },
];

export const generalFields: TField[] = [
  {
    label: "Dados Gerais",
    name: "general",
    type: "form",
    icon: IconUser,
    index: 0,
    fields: [
      { label: "Nome", name: "name", type: "text" },
      { label: "CPF", name: "cpf", type: "text", mask: "999.999.999-99" },
      { label: "Email", name: "email", type: "text" },
      {
        label: "Telefone",
        name: "phone",
        type: "text",
        mask: "(99) 99999-9999",
      },
      { label: "Perfil", name: "type", type: "select", options: typeOptions },
      {
        label: "Status",
        name: "active",
        type: "select",
        options: statusOptions,
      },
    ],
  },
  {
    label: "Endereço",
    name: "address",
    type: "form",
    icon: IconStore,
    index: 1,
    fields: [
      {
        label: "CEP",
        name: "postalCode",
        type: "text",
        mask: "99999-999",
      },
      { label: "Rua", name: "street", type: "text" },
      { label: "Número", name: "number", type: "text", mask: "9999" },
      { label: "Bairro", name: "neighborhood", type: "text" },
      { label: "Cidade", name: "city", type: "text" },
      { label: "Estado", name: "state", type: "text" },
      { label: "Pais", name: "country", type: "text" },
    ],
  },
];
