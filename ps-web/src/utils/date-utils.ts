export function convertDateToString(data: Date): string {
  // const dataObj: Date = new Date(data);
  const dataFormatada: string = data.toISOString().slice(0, 10);
  return dataFormatada;
}

export function formatDate(date: Date | null): string {
  if (!date) return "";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

//"2024-03-03"
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatarDataToUse(date: Date): string {
  const dia = String(date.getDate()).padStart(2, "0");
  const mesIndex = date.getMonth();
  const ano = date.getFullYear();

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const mes = meses[mesIndex];

  return `${dia} ${mes}, ${ano}`;
}
