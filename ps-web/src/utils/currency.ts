export function convertCurrencyToNumber(currencyValue: string): number | null {
  console.log(currencyValue);
  // Remove non-numeric characters except commas and dots
  const cleanedValue = currencyValue.replace(/[^\d.,]/g, "");

  // Replace commas with dots
  const valueWithDot = cleanedValue.replace(",", ".");

  // Try to convert to a number
  const numberValue = parseFloat(valueWithDot);

  // Check if the conversion was successful
  return isNaN(numberValue) ? null : numberValue;
}
