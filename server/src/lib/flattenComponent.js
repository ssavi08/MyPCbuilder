export function flattenComponent(row) {
  const { specs, created_at, ...rest } = row
  return { ...rest, ...specs }
}
