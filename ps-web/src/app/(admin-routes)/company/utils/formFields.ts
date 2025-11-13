import { IconList, IconStore } from "@components/icons";
import { TField, TOption } from "@interfaces/DynamicForm";

const statusOptions: TOption[] = [
  { label: "ativo", value: "true" },
  { label: "inativo", value: "false" },
];

export const generalFields: TField[] = [
  {
    label: "Dados Gerais",
    name: "general",
    type: "form",
    icon: IconList,
    index: 0,
    fields: [
      { label: "Nome do Petshop", name: "name", type: "text" },
      {
        label: "CNPJ",
        name: "cnpj",
        type: "text",
        readonly: true,
        mask: "99.999.999/9999-99",
      },
      {
        label: "Telefone",
        name: "phone",
        type: "text",
        mask: "(99) 99999-9999",
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
