// Exact combinatorics with BigInt, plus small enumeration helpers.

export function fact(n: number): bigint {
  let r = 1n;
  for (let i = 2; i <= n; i++) r *= BigInt(i);
  return r;
}

/** P(n, k) = n! / (n − k)!, and 0 when k > n. */
export function perm(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  let r = 1n;
  for (let i = 0; i < k; i++) r *= BigInt(n - i);
  return r;
}

/** C(n, k), and 0 outside 0 ≤ k ≤ n. */
export function choose(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  k = Math.min(k, n - k);
  let r = 1n;
  for (let i = 1; i <= k; i++) r = (r * BigInt(n - k + i)) / BigInt(i);
  return r;
}

/** 1234567 → "1,234,567" */
export const fmt = (x: bigint | number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** All k-element subsets (as sorted arrays) of items, in lexicographic order. */
export function subsets<T>(items: T[], k: number): T[][] {
  const out: T[][] = [];
  const go = (start: number, acc: T[]) => {
    if (acc.length === k) return void out.push([...acc]);
    for (let i = start; i < items.length; i++) go(i + 1, [...acc, items[i]]);
  };
  go(0, []);
  return out;
}

/** All orderings of arr. */
export function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr.slice()];
  return arr.flatMap((x, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p]));
}

/** All lists of length k from items, with or without repetition. */
export function lists<T>(items: T[], k: number, repeat: boolean): T[][] {
  const out: T[][] = [];
  const go = (acc: T[]) => {
    if (acc.length === k) return void out.push(acc);
    for (const x of items) if (repeat || !acc.includes(x)) go([...acc, x]);
  };
  go([]);
  return out;
}
