import { tryParseNumber } from '../../src/utils/try-parse-number';

describe('tryParseNumber', () => {
  it.each([
    ['Not a number', 0],
    [null, 0],
    ['', 0],
    [123, 123],
    [1.23, 1.23],
    ['1.23', 1.23],
    ['123', 123],
  ])('tryParseNumber(%s)=%s', (input, expected) => {
    const actual = tryParseNumber(input);
    expect(actual).toBe(expected);
  });
  it('Should use the provided default value', () => {
    const actual = tryParseNumber('Not a number', 100);
    expect(actual).toBe(100);
  });
});
