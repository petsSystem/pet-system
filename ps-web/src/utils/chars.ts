export function removeSpecialChars(inputString: string): string {
  // Remove pontos, traços e caracteres especiais
  const cleanString = inputString.replace(/[^\w\s]/gi, "");
  return cleanString;
}

export function removeAndParse(
  value: string,
  charactersToRemove: string[]
): number | null {
  // Remova os caracteres especificados
  const cleanedValue = charactersToRemove.reduce(
    (result, char) => result.replace(new RegExp(char, "g"), ""),
    value
  );

  // Substitua ',' por '.' e converta para número
  const parsedValue = parseFloat(cleanedValue.replace(",", "."));

  // Verifique se a conversão foi bem-sucedida
  return isNaN(parsedValue) ? null : parsedValue;
}

export function extractNumbers(str: string): string {
  return str.replace(/\D/g, ""); // Remove tudo que não é número
}
