export function getArrayOf<T> (data: T | T[]): T[] {
  if (!data) {
    return []
  }
  if (Array.isArray(data)) {
    return data
  }
  return [data]
}
