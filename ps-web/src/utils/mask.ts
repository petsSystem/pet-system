export function formatWithMask(value: string, mask: string): string {
  if (!value || !mask) return value || "";
  
  let valueIndex = 0;
  let result = "";

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "9" && valueIndex < value.length) {
      result += value[valueIndex];
      valueIndex++;
    } else if (mask[i] === "9") {
      result += "";
    } else {
      result += mask[i];
    }
  }

  return result;
}
