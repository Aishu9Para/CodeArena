// Express req.params values can technically be string | string[]; this helper
// safely extracts them as a plain string.
export function param(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}
