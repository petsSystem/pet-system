import { IconList, IconStore, IconUser } from "@components/icons";
import { TField, TOption } from "@interfaces/DynamicForm";

export const generalFields: TField[] = [
  {
    label: "Dados Gerais",
    name: "general",
    type: "form",
    icon: IconUser,
    index: 0,
    fields: [
      { label: "Email", name: "email", type: "text", readonly: true },
      {
        label: "CPF",
        name: "cpf",
        type: "text",
        mask: "999.999.999-99",
        readonly: true,
      },
      { label: "Nome", name: "name", type: "text" },
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
