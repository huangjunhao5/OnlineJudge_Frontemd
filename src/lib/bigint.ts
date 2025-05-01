export function bigintReplacer(_: string, value: any): any {
  return typeof value === "bigint" ? value.toString() : value;
}
