export function cep(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 9;
  let value = e.currentTarget.value;
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  e.currentTarget.value = value;
  return e;
}

export function currency(e: React.FormEvent<HTMLInputElement>) {
  let value = e.currentTarget.value;

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
  const numericValue = parseFloat(value) / 100;

  e.currentTarget.value = numericValue.toFixed(2).replace(".", ",");

  return e;
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

export function cpf(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 14;
  let value = e.currentTarget.value;
  if (!value.match(/^(\d{3}).(\d{3}).(\d{3})-(\d{2})$/)) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{2})$/, "$1-$2");
    e.currentTarget.value = value;
  }
  return e;
}
