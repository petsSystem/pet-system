export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  } else if (value !== null) {
    return [value];
  } else {
    return [];
  }
}
