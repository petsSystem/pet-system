export function formatNumberToCurrency(valor: number = 0): string {
  const valorFormatado = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return valorFormatado;
}

export function convertInCurrency(value: string) {
  // Remove qualquer não-dígito
  value = value.replace(/\D/g, "");

  // Adiciona zeros à esquerda se necessário
  while (value.length < 3) {
    value = "0" + value;
  }

  // Divide a string em parte inteira e parte decimal
  const integerPart = value.slice(0, -2) || "0"; // Garante que há pelo menos um dígito inteiro
  const decimalPart = value.slice(-2);

  // Formata a parte inteira com ponto como separador de milhares
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  );

  // Adiciona a parte decimal com vírgula como separador
  const formattedValue = formattedIntegerPart + "," + decimalPart;

  // Converte para um número e divide por 100 para obter a representação em decimal
  const numericValue = parseFloat(value) / 10;

  return numericValue.toFixed(2).replace(".", ",");
}
