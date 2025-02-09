export function isNumber(value: string | number | undefined): boolean {
  if (!value) return false;
  return /^[0-9.]$/.test(String(value));
}
