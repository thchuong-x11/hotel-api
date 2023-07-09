export function tryParseNumber(value: string | null | number, defaultValue: number | null = 0): number | null {
  if (typeof value === 'number') {
    return value;
  }

  if (value === null) {
    return defaultValue;
  }

  try {
    const result = parseFloat(value);
    return Number.isNaN(result) ? defaultValue : result;
  } catch {
    return defaultValue;
  }
}
