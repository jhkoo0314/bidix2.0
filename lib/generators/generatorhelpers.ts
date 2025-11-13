// lib/generators/generatorhelpers.ts
// Auction Engine v2.0 - Generator Helpers (난수/가중치/ID)
// Version: 2.0
// Last Updated: 2025-11-07

export function uuid(prefix = "id"): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
  }
  
  /** [min, max] 포함 정수 난수 */
  export function randomInt(min: number, max: number): number {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  }
  
  /** 가중치 샘플링: {label: weight} or string[] 지원 */
  export function sampleWeighted<T extends string>(
    table: Record<T, number> | readonly T[]
  ): T {
    if (Array.isArray(table)) {
      return table[Math.floor(Math.random() * table.length)];
    }
    const entries = Object.entries(table) as [T, number][];
    const total = entries.reduce((s, [, w]) => s + w, 0);
    let r = Math.random() * total;
    for (const [key, weight] of entries) {
      if ((r -= weight) <= 0) return key;
    }
    return entries[entries.length - 1][0];
  }
  