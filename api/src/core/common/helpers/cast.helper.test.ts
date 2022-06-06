import { toNumber } from './cast.helper';

describe('toNumber', () => {
  test('should return default when value is NaN', () => {
    const defaultValue = 15;

    const actual = toNumber('NaN', { default: defaultValue });

    expect(actual).toBe(defaultValue);
  });

  test('should return min when value is less then min', () => {
    const minValue = 10;

    const actual = toNumber('8', { min: minValue });

    expect(actual).toBe(minValue);
  });

  test('should return max when value is bigger then max', () => {
    const maxValue = 10;

    const actual = toNumber('15', { min: 1, max: maxValue });

    expect(actual).toBe(maxValue);
  });
});
