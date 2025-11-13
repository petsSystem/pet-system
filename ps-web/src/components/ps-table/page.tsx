import Table, { TableColumn } from "./index";
import HeaderContent from "@components/ps-header-content";

const columns = [
  { title: "Invoice", key: "invoice" },
  { title: "Total", key: "total", color: true },
  { title: "Status", key: "status", color: true, type: "status" },
  { title: "Customer", key: "customer" },
  { title: "Issued on", key: "issueddate" },
  { title: "Paid on", key: "paiddate" },
  { title: "Type", key: "type", type: "type" },
];

export default function InvoicesContent() {
  const handleView = (item: any) => {
    console.log("Visualizar:", item);
  };

  const handleEdit = (item: any) => {
    console.log("Editar:", item);
  };

  const handleDelete = (item: any) => {
    console.log("Excluir:", item);
  };
  const invoices = [
    {
      id: 0,
      invoice: "#123567",
      total: "$129.00",
      status: "Overdue",
      customer: "Dominik Lamakani",
      issueddate: "22/07/2021",
      paiddate: "-",
      type: "Subscription",
    },
    {
      id: 1,
      invoice: "#779912",
      total: "$59.00",
      status: "Paid",
      customer: "Mark Cameron",
      issueddate: "19/07/2021",
      paiddate: "20/07/2021",
      type: "Subscription",
    },
    {
      id: 2,
      invoice: "#889924",
      total: "$89.00",
      status: "Paid",
      customer: "Sergio Gonnelli",
      issueddate: "17/07/2021",
      paiddate: "19/07/2021",
      type: "One-time",
    },
    {
      id: 3,
      invoice: "#897726",
      total: "$129.00",
      status: "Due",
      customer: "Manuel Garbaya",
      issueddate: "04/07/2021",
      paiddate: "-",
      type: "Subscription",
    },
    {
      id: 4,
      invoice: "#123567",
      total: "$129.00",
      status: "Due",
      customer: "Cool Robot",
      issueddate: "04/07/2021",
      paiddate: "-",
      type: "Subscription",
    },
    {
      id: 5,
      invoice: "#896644",
      total: "$129.00",
      status: "Paid",
      customer: "Mark Cameron",
      issueddate: "04/07/2021",
      paiddate: "09/07/2021",
      type: "One-time",
    },
    {
      id: 6,
      invoice: "#136988",
      total: "$69.00",
      status: "Paid",
      customer: "Glenn Thomas",
      issueddate: "01/07/2021",
      paiddate: "01/07/2021",
      type: "One-time",
    },
    {
      id: 7,
      invoice: "#442206",
      total: "$129.00",
      status: "Overdue",
      customer: "Dominik Lamakani",
      issueddate: "22/06/2021",
      paiddate: "-",
      type: "Subscription",
    },
    {
      id: 8,
      invoice: "#764321",
      total: "$89.00",
      status: "Paid",
      customer: "Brian Halligan",
      issueddate: "21/06/2021",
      paiddate: "29/06/2021",
      type: "One-time",
    },
    {
      id: 9,
      invoice: "#908764",
      total: "$129.00",
      status: "Due",
      customer: "Carolyn McNeail",
      issueddate: "17/06/2021",
      paiddate: "-",
      type: "Subscription",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <HeaderContent
        title="Categorias ✨"
        searchPlaceholder="Pesquisar Categoria"
        buttonLabel="Nova Categoria"
        onButtonClick={() => {
          // Lógica para lidar com o clique no botão
          console.log("Botão clicado!");
        }}
      />
      <Table
        columns={columns}
        data={invoices}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
