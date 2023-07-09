import { mergeNumber, mergeString, mergeStringArrayKeepUnique } from '../../src/utils/merge';

describe('merge', () => {
  describe('mergeString', () => {
    it.each([
      ['', 'a', 'l', 'a'],
      ['', 'a', 'r', 'a'],
      ['a', '', 'l', 'a'],
      ['a', '', 'r', 'a'],
      ['a', 'b', 'r', 'b'],
      ['a', 'b', 'l', 'a'],
    ] as [string, string, 'l' | 'r', string][])('mergeString(%s,%S,%s)=%s', (left, right, which, expected) => {
      const actual = mergeString(left, right, which);
      expect(actual).toBe(expected);
    });
  });

  describe('mergeNumber', () => {
    it.each([
      [null, 123, 'l', 123],
      [null, 123, 'r', 123],
      [null, null, 'l', null],
      [null, null, 'r', null],
      [123, null, 'l', 123],
      [123, null, 'r', 123],
      [123, 456, 'r', 456],
      [123, 456, 'l', 123],
    ] as [number | null, number | null, 'l' | 'r', number | null][])(
      'mergeNumber(%s,%S,%s)=%s',
      (left, right, which, expected) => {
        const actual = mergeNumber(left, right, which);
        expect(actual).toBe(expected);
      },
    );
  });

  describe('mergeStringArrayKeepUnique', () => {
    it.each([
      [[], [], []],
      [[], ['a'], ['a']],
      [['a'], [], ['a']],
      [['a'], ['b'], ['a', 'b']],
      [['a'], ['a'], ['a']],
      [['a', 'a'], [], ['a']],
    ] as [string[], string[], string[]][])('mergeStringArrayKeepUnique(%s,%S,%s)=%s', (left, right, expected) => {
      const actual = mergeStringArrayKeepUnique(left, right);
      expect(actual).toStrictEqual(expected);
    });
  });
});
