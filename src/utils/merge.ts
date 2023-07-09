export function mergeString(left: string, right: string, whichToTakeWhenConflict: 'l' | 'r' = 'r'): string {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  return whichToTakeWhenConflict === 'r' ? right : left;
}

export function mergeNumber(
  left: number | null,
  right: number | null,
  whichToTakeWhenConflict: 'l' | 'r' = 'r',
): number | null {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  return whichToTakeWhenConflict === 'r' ? right : left;
}

export function mergeStringArrayKeepUnique(left: Array<string>, right: Array<string>): Array<string> {
  const res = new Set(left);
  for (const v of right) {
    res.add(v);
  }
  for (const v of left) {
    res.add(v);
  }
  return Array.from(res);
}
