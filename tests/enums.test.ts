import { describe, expect, it } from 'vitest';
import {
  enumKeyByKey,
  enumKeyByValue,
  enumKeysByValue,
  enumValueByKey,
  enumValueByValue,
  equalFn,
  isEnumKey,
  isEnumLike,
  isEnumValue,
  toEnumKey,
  toEnumKeys,
  toEnumValue,
  validateEnumLike,
  type EnumLike,
} from '../src/enums';

export enum StringEnum {
  Fruit = 'Apple',
  Vegetable = 'Cucumber',
  Nut = 'Almond',
}

export enum NumericEnum {
  One = 1,
  Two = 2,
  Three = 3,
}

export enum MixedEnum {
  Fruit = 'Apple',
  Vegetable = 'Cucumber',
  Nut = 'Almond',
  One = 1, // NOSONAR
  Two = 2,
  Three = 3,
}

export enum NonUniqueEnum {
  Fruit = 'Apple',
  Vegetable = 'Cucumber',
  Nut = 'Almond',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Favorite = 'Apple', // Non-unique value
  One = 1, // NOSONAR
  Two = 2,
  Three = 3,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  First = 1, // Non-unique value
}

const customEnumLike = {
  A: 'ValueA',
  B: 'ValueB',
  C: 123,
};

const emptyEnumLike = {};

const nonUniqueCustomEnumLike = {
  A: 'ValueA',
  B: 'ValueB',
  C: 'ValueA',
};

describe('enumValueByKey', () => {
  describe('basic functionality', () => {
    it('should return the enum value for a valid key in StringEnum', () => {
      expect(enumValueByKey(StringEnum, 'Fruit')).toBe('Apple');
      expect(enumValueByKey(StringEnum, 'Vegetable')).toBe('Cucumber');
      expect(enumValueByKey(StringEnum, 'Nut')).toBe('Almond');
    });

    it('should return the enum value for a valid key in NumericEnum', () => {
      expect(enumValueByKey(NumericEnum, 'One')).toBe(1);
      expect(enumValueByKey(NumericEnum, 'Two')).toBe(2);
      expect(enumValueByKey(NumericEnum, 'Three')).toBe(3);
    });

    it('should return the enum value for a valid key in MixedEnum', () => {
      expect(enumValueByKey(MixedEnum, 'Fruit')).toBe('Apple');
      expect(enumValueByKey(MixedEnum, 'One')).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should return undefined for non-existent keys', () => {
      expect(enumValueByKey(StringEnum, 'Invalid')).toBeUndefined();
      expect(enumValueByKey(NumericEnum, 'Four')).toBeUndefined();
    });

    it('should return undefined for invalid or empty keys', () => {
      expect(enumValueByKey(StringEnum, '')).toBeUndefined();
      // @ts-expect-error testing
      expect(enumValueByKey(StringEnum, null)).toBeUndefined();
      expect(enumValueByKey(StringEnum, undefined)).toBeUndefined();
    });

    it('should handle non-string keys', () => {
      // @ts-expect-error testing with non-string key
      expect(enumValueByKey(StringEnum, 123)).toBeUndefined();
      // @ts-expect-error testing with object as key
      expect(enumValueByKey(StringEnum, {})).toBeUndefined();
      // @ts-expect-error testing with array as key
      expect(enumValueByKey(StringEnum, [])).toBeUndefined();
    });

    it('should throw for null or undefined enum object', () => {
      // @ts-expect-error testing with null
      expect(() => enumValueByKey(null, 'key')).toThrow();
      // @ts-expect-error testing with undefined
      expect(() => enumValueByKey(undefined, 'key')).toThrow();
    });
  });

  describe('ignoreCase option', () => {
    it('should return the enum value for case-insensitive keys', () => {
      expect(enumValueByKey(StringEnum, 'fruit', { ignoreCase: true })).toBe('Apple');
      expect(enumValueByKey(StringEnum, 'FRUIT', { ignoreCase: true })).toBe('Apple');
    });

    it('should return undefined for case-sensitive keys by default', () => {
      expect(enumValueByKey(StringEnum, 'fruit')).toBeUndefined();
      expect(enumValueByKey(StringEnum, 'FRUIT')).toBeUndefined();
    });

    it('should throw for case-insensitive duplicate keys', () => {
      const caseInsensitiveEnum = {
        key: 'Value1',
        KEY: 'Value2', // Case-insensitively the same as 'key'
      };
      expect(() => enumValueByKey(caseInsensitiveEnum, 'key', { ignoreCase: true })).toThrow(
        'Enum keys are not unique. Cannot get value by key.',
      );
    });
  });

  describe('custom EnumLike objects', () => {
    it('should return the value for a valid key in custom EnumLike', () => {
      expect(enumValueByKey(customEnumLike, 'A')).toBe('ValueA');
      expect(enumValueByKey(customEnumLike, 'C')).toBe(123);
    });

    it('should return undefined for keys in empty EnumLike', () => {
      expect(enumValueByKey(emptyEnumLike, 'any')).toBeUndefined();
    });
  });
});

describe('enumValueByValue', () => {
  describe('basic functionality', () => {
    it('should return the enum value for a valid value in StringEnum', () => {
      expect(enumValueByValue(StringEnum, 'Apple')).toBe('Apple');
      expect(enumValueByValue(StringEnum, 'Cucumber')).toBe('Cucumber');
    });

    it('should return the enum value for a valid value in NumericEnum', () => {
      expect(enumValueByValue(NumericEnum, 1)).toBe(1);
      expect(enumValueByValue(NumericEnum, 2)).toBe(2);
    });

    it('should return the enum value for a valid value in MixedEnum', () => {
      expect(enumValueByValue(MixedEnum, 'Cucumber')).toBe('Cucumber');
      expect(enumValueByValue(MixedEnum, 1)).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should return undefined for non-existent values', () => {
      expect(enumValueByValue(StringEnum, 'Banana')).toBeUndefined();
      expect(enumValueByValue(NumericEnum, 4)).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      expect(enumValueByValue(StringEnum, undefined)).toBeUndefined();
    });
  });

  describe('ignoreCase option', () => {
    it('should return the enum value for case-insensitive values', () => {
      expect(enumValueByValue(StringEnum, 'apple', { ignoreCase: true })).toBe('Apple');
      expect(enumValueByValue(StringEnum, 'APPLE', { ignoreCase: true })).toBe('Apple');
    });

    it('should return undefined for case-sensitive values by default', () => {
      expect(enumValueByValue(StringEnum, 'apple')).toBeUndefined();
      expect(enumValueByValue(StringEnum, 'APPLE')).toBeUndefined();
    });
  });

  describe('custom EnumLike objects', () => {
    it('should return the value for a valid value in custom EnumLike', () => {
      expect(enumValueByValue(customEnumLike, 'ValueA')).toBe('ValueA');
      expect(enumValueByValue(customEnumLike, 123)).toBe(123);
    });

    it('should handle case-insensitive values in custom EnumLike', () => {
      expect(enumValueByValue(customEnumLike, 'valueA', { ignoreCase: true })).toBe('ValueA');
    });
  });

  describe('non-unique values', () => {
    it('should throw for non-unique values in NonUniqueEnum', () => {
      expect(() => enumValueByValue(NonUniqueEnum, 'Apple')).toThrow(
        'Enum values are not unique. Cannot get value by value.',
      );
      expect(() => enumValueByValue(NonUniqueEnum, 1)).toThrow(
        'Enum values are not unique. Cannot get value by value.',
      );
    });
  });
});

describe('enumKeyByKey', () => {
  describe('basic functionality', () => {
    it('should return the enum key for a valid key in StringEnum', () => {
      expect(enumKeyByKey(StringEnum, 'Fruit')).toBe('Fruit');
      expect(enumKeyByKey(StringEnum, 'Vegetable')).toBe('Vegetable');
    });

    it('should return the enum key for a valid key in NumericEnum', () => {
      expect(enumKeyByKey(NumericEnum, 'One')).toBe('One');
      expect(enumKeyByKey(NumericEnum, 'Two')).toBe('Two');
    });

    it('should return the enum key for a valid key in MixedEnum', () => {
      expect(enumKeyByKey(MixedEnum, 'Vegetable')).toBe('Vegetable');
      expect(enumKeyByKey(MixedEnum, 'One')).toBe('One');
    });
  });

  describe('edge cases', () => {
    it('should return undefined for non-existent keys', () => {
      expect(enumKeyByKey(StringEnum, 'NotAKey')).toBeUndefined();
      expect(enumKeyByKey(NumericEnum, 'Four')).toBeUndefined();
    });

    it('should return undefined for invalid or empty keys', () => {
      expect(enumKeyByKey(StringEnum, '')).toBeUndefined();
      expect(enumKeyByKey(StringEnum, undefined)).toBeUndefined();
    });
  });

  describe('ignoreCase option', () => {
    it('should return the enum key for case-insensitive keys', () => {
      expect(enumKeyByKey(StringEnum, 'fruit', { ignoreCase: true })).toBe('Fruit');
      expect(enumKeyByKey(StringEnum, 'FRUIT', { ignoreCase: true })).toBe('Fruit');
    });

    it('should return undefined for case-sensitive keys by default', () => {
      expect(enumKeyByKey(StringEnum, 'fruit')).toBeUndefined();
      expect(enumKeyByKey(StringEnum, 'FRUIT')).toBeUndefined();
    });
  });

  describe('custom EnumLike objects', () => {
    it('should return the key for a valid key in custom EnumLike', () => {
      expect(enumKeyByKey(customEnumLike, 'A')).toBe('A');
    });

    it('should handle case-insensitive keys in custom EnumLike', () => {
      expect(enumKeyByKey(customEnumLike, 'a', { ignoreCase: true })).toBe('A');
    });
  });
});

describe('enumKeyByValue', () => {
  describe('basic functionality', () => {
    it('should return the enum key for a valid value in StringEnum', () => {
      expect(enumKeyByValue(StringEnum, 'Apple')).toBe('Fruit');
      expect(enumKeyByValue(StringEnum, 'Cucumber')).toBe('Vegetable');
    });

    it('should return the enum key for a valid value in NumericEnum', () => {
      expect(enumKeyByValue(NumericEnum, 1)).toBe('One');
      expect(enumKeyByValue(NumericEnum, 2)).toBe('Two');
    });

    it('should return the enum key for a valid value in MixedEnum', () => {
      expect(enumKeyByValue(MixedEnum, 'Apple')).toBe('Fruit');
      expect(enumKeyByValue(MixedEnum, 2)).toBe('Two');
    });
  });

  describe('edge cases', () => {
    it('should return undefined for non-existent values', () => {
      expect(enumKeyByValue(StringEnum, 'Banana')).toBeUndefined();
      expect(enumKeyByValue(NumericEnum, 4)).toBeUndefined();
    });

    it('should throw for null or undefined enum object', () => {
      // @ts-expect-error testing with null
      expect(() => enumKeyByValue(null, 'value')).toThrow();
      // @ts-expect-error testing with undefined
      expect(() => enumKeyByValue(undefined, 'value')).toThrow();
    });
  });

  describe('ignoreCase option', () => {
    it('should return the enum key for case-insensitive values', () => {
      expect(enumKeyByValue(StringEnum, 'apple', { ignoreCase: true })).toBe('Fruit');
      expect(enumKeyByValue(StringEnum, 'APPLE', { ignoreCase: true })).toBe('Fruit');
    });
  });

  describe('custom EnumLike objects', () => {
    it('should return the key for a valid value in custom EnumLike', () => {
      expect(enumKeyByValue(customEnumLike, 'ValueB')).toBe('B');
    });

    it('should throw for non-unique values in custom EnumLike', () => {
      expect(() => enumKeyByValue(nonUniqueCustomEnumLike, 'ValueA')).toThrow(
        'Enum values are not unique. Cannot get key by value.',
      );
    });
  });

  describe('non-unique values', () => {
    it('should throw for non-unique values in NonUniqueEnum', () => {
      expect(() => enumKeyByValue(NonUniqueEnum, 'Apple')).toThrow(
        'Enum values are not unique. Cannot get key by value.',
      );
      expect(() => enumKeyByValue(NonUniqueEnum, 1)).toThrow('Enum values are not unique. Cannot get key by value.');
    });
  });
});

describe('enumKeysByValue', () => {
  describe('basic functionality', () => {
    it('should return all keys for a valid value in StringEnum', () => {
      expect(enumKeysByValue(StringEnum, 'Apple')).toEqual(['Fruit']);
      expect(enumKeysByValue(StringEnum, 'Cucumber')).toEqual(['Vegetable']);
    });

    it('should return all keys for a valid value in NumericEnum', () => {
      expect(enumKeysByValue(NumericEnum, 1)).toEqual(['One']);
      expect(enumKeysByValue(NumericEnum, 2)).toEqual(['Two']);
    });

    it('should return all keys for a valid value in MixedEnum', () => {
      expect(enumKeysByValue(MixedEnum, 'Apple')).toEqual(['Fruit']);
      expect(enumKeysByValue(MixedEnum, 2)).toEqual(['Two']);
    });
  });

  describe('edge cases', () => {
    it('should return empty array for non-existent values', () => {
      expect(enumKeysByValue(StringEnum, 'Banana')).toEqual([]);
      expect(enumKeysByValue(NumericEnum, 4)).toEqual([]);
    });

    it('should return empty array for invalid or empty inputs', () => {
      expect(enumKeysByValue(StringEnum, '')).toStrictEqual([]);
      // @ts-expect-error testing
      expect(enumKeysByValue(StringEnum, null)).toStrictEqual([]);
      expect(enumKeysByValue(StringEnum, undefined)).toStrictEqual([]);
    });

    it('should throw for null or undefined enum object', () => {
      // @ts-expect-error testing with null
      expect(() => enumKeysByValue(null, 'value')).toThrow();
      // @ts-expect-error testing with undefined
      expect(() => enumKeysByValue(undefined, 'value')).toThrow();
    });

    it('should return empty array for object and array values', () => {
      const objValue = {};
      const arrValue: unknown = [];
      expect(enumKeysByValue(StringEnum, objValue as unknown as string)).toEqual([]);
      expect(enumKeysByValue(StringEnum, arrValue as string)).toEqual([]);
    });
  });

  describe('ignoreCase option', () => {
    it('should return all keys for case-insensitive values', () => {
      expect(enumKeysByValue(StringEnum, 'apple', { ignoreCase: true })).toEqual(['Fruit']);
      expect(enumKeysByValue(StringEnum, 'APPLE', { ignoreCase: true })).toEqual(['Fruit']);
    });
  });

  describe('custom EnumLike objects', () => {
    it('should return all keys for a valid value in custom EnumLike', () => {
      expect(enumKeysByValue(customEnumLike, 'ValueA')).toEqual(['A']);
      expect(enumKeysByValue(customEnumLike, 123)).toEqual(['C']);
    });

    it('should return empty array for empty EnumLike', () => {
      expect(enumKeysByValue(emptyEnumLike, 'any')).toEqual([]);
    });
  });

  describe('non-unique values', () => {
    it('should return multiple keys for non-unique values in NonUniqueEnum', () => {
      expect(enumKeysByValue(NonUniqueEnum, 'Apple')).toEqual(['Fruit', 'Favorite']);
      expect(enumKeysByValue(NonUniqueEnum, 1)).toEqual(['One', 'First']);
    });

    it('should return multiple keys for non-unique values in custom EnumLike', () => {
      expect(enumKeysByValue(nonUniqueCustomEnumLike, 'ValueA')).toEqual(['A', 'C']);
    });

    it('should return multiple keys for case-insensitive non-unique values', () => {
      const caseInsensitiveEnum = {
        A: 'value',
        B: 'Value', // Case-insensitively the same as 'value'
      };
      expect(enumKeysByValue(caseInsensitiveEnum, 'value', { ignoreCase: true })).toEqual(['A', 'B']);
    });
  });
});

describe('isEnumLike', () => {
  describe('basic functionality', () => {
    it('should return true for valid EnumLike objects', () => {
      expect(isEnumLike(StringEnum)).toBe(true);
      expect(isEnumLike(NumericEnum)).toBe(true);
      expect(isEnumLike(MixedEnum)).toBe(true);
      expect(isEnumLike(customEnumLike)).toBe(true);
      expect(isEnumLike({})).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should return false for null or undefined', () => {
      expect(isEnumLike(null)).toBe(false);
      expect(isEnumLike(undefined)).toBe(false);
    });

    it('should return false for non-object values', () => {
      expect(isEnumLike('string')).toBe(false);
      expect(isEnumLike(123)).toBe(false);
      expect(isEnumLike(true)).toBe(false);
      expect(isEnumLike(() => {})).toBe(false);
    });

    it('should return false for objects with invalid values', () => {
      expect(isEnumLike({ A: {} })).toBe(false);
      expect(isEnumLike({ A: [] })).toBe(false);
      expect(isEnumLike({ A: true })).toBe(false);
      expect(isEnumLike({ A: null })).toBe(false);
    });
  });
});

describe('isEnumValue', () => {
  describe('basic functionality', () => {
    it('should return true for valid enum values', () => {
      expect(isEnumValue(StringEnum, 'Apple')).toBe(true);
      expect(isEnumValue(NumericEnum, 1)).toBe(true);
      expect(isEnumValue(MixedEnum, 'Cucumber')).toBe(true);
      expect(isEnumValue(MixedEnum, 2)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should return false for non-existent values', () => {
      expect(isEnumValue(StringEnum, 'Banana')).toBe(false);
      expect(isEnumValue(NumericEnum, 4)).toBe(false);
      expect(isEnumValue(MixedEnum, 'Potato')).toBe(false);
    });

    it('should return false for null or undefined values', () => {
      expect(isEnumValue(StringEnum, null)).toBe(false);
      expect(isEnumValue(StringEnum, undefined)).toBe(false);
    });
  });

  describe('options handling', () => {
    it('should return false for case-sensitive values by default', () => {
      expect(isEnumValue(StringEnum, 'apple')).toBe(false);
      expect(isEnumValue(StringEnum, 'APPLE')).toBe(false);
    });

    it('should return true for case-insensitive values when ignoreCase is true', () => {
      expect(isEnumValue(StringEnum, 'apple', { ignoreCase: true })).toBe(true);
      expect(isEnumValue(StringEnum, 'APPLE', { ignoreCase: true })).toBe(true);
    });

    it('should not convert string values to numbers when convert is false', () => {
      expect(isEnumValue(NumericEnum, '1', { convert: false })).toBe(false);
      expect(isEnumValue(NumericEnum, '2', { convert: false })).toBe(false);
      expect(isEnumValue(NumericEnum, '4', { convert: false })).toBe(false);
    });

    it('should convert string values to numbers when convert is true', () => {
      expect(isEnumValue(NumericEnum, '1', { convert: true })).toBe(true);
      expect(isEnumValue(NumericEnum, '2', { convert: true })).toBe(true);
      expect(isEnumValue(NumericEnum, '4', { convert: true })).toBe(false);
    });

    it('should handle both ignoreCase and convert options together', () => {
      expect(isEnumValue(StringEnum, 'apple', { ignoreCase: true, convert: true })).toBe(true);
      expect(isEnumValue(NumericEnum, '1', { ignoreCase: true, convert: true })).toBe(true);
    });
  });
});

describe('isEnumKey', () => {
  describe('basic functionality', () => {
    it('should return true for valid enum keys', () => {
      expect(isEnumKey(StringEnum, 'Fruit')).toBe(true);
      expect(isEnumKey(NumericEnum, 'One')).toBe(true);
      expect(isEnumKey(MixedEnum, 'Vegetable')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should return false for non-existent keys', () => {
      expect(isEnumKey(StringEnum, 'NotAKey')).toBe(false);
      expect(isEnumKey(NumericEnum, 'Four')).toBe(false);
    });

    it('should return false for null or undefined keys', () => {
      expect(isEnumKey(StringEnum, null)).toBe(false);
      expect(isEnumKey(StringEnum, undefined)).toBe(false);
    });

    it('should return false for non-string types', () => {
      expect(isEnumKey(StringEnum, 123)).toBe(false);
      expect(isEnumKey(StringEnum, true)).toBe(false);
      expect(isEnumKey(StringEnum, {})).toBe(false);
    });
  });

  describe('options handling', () => {
    it('should return false for case-sensitive keys by default', () => {
      expect(isEnumKey(StringEnum, 'fruit')).toBe(false);
      expect(isEnumKey(StringEnum, 'FRUIT')).toBe(false);
    });

    it('should return true for case-insensitive keys when ignoreCase is true', () => {
      expect(isEnumKey(StringEnum, 'fruit', { ignoreCase: true })).toBe(true);
      expect(isEnumKey(StringEnum, 'FRUIT', { ignoreCase: true })).toBe(true);
    });

    it('should convert numeric keys to strings when convert is true', () => {
      const numericKeysEnum = { '1': 'One', '2': 'Two' };
      expect(isEnumKey(numericKeysEnum, 1, { convert: true })).toBe(true);
      expect(isEnumKey(StringEnum, 123, { convert: true })).toBe(false);
    });
  });
});

describe('toEnumValue', () => {
  describe('basic functionality', () => {
    it('should return the enum value for a valid value', () => {
      expect(toEnumValue(StringEnum, 'Apple')).toBe('Apple');
      expect(toEnumValue(NumericEnum, 1)).toBe(1);
      expect(toEnumValue(MixedEnum, 'Cucumber')).toBe('Cucumber');
    });
  });

  describe('edge cases', () => {
    it('should return undefined for non-existent values', () => {
      expect(toEnumValue(StringEnum, 'Banana')).toBeUndefined();
      expect(toEnumValue(NumericEnum, 4)).toBeUndefined();
    });

    it('should return undefined for null or undefined inputs', () => {
      expect(toEnumValue(StringEnum, null)).toBeUndefined();
      expect(toEnumValue(StringEnum, undefined)).toBeUndefined();
    });
  });

  describe('options handling', () => {
    it('should return the enum value for case-insensitive values when ignoreCase is true', () => {
      expect(toEnumValue(StringEnum, 'apple', { ignoreCase: true })).toBe('Apple');
      expect(toEnumValue(StringEnum, 'CUCUMBER', { ignoreCase: true })).toBe('Cucumber');
    });

    it('should convert string values to numbers when convert is true', () => {
      expect(toEnumValue(NumericEnum, '1', { convert: true })).toBe(1);
      expect(toEnumValue(NumericEnum, '2', { convert: true })).toBe(2);
      expect(toEnumValue(NumericEnum, '4', { convert: true })).toBeUndefined();
    });
  });

  describe('non-unique values', () => {
    it('should throw for non-unique values in NonUniqueEnum', () => {
      expect(() => toEnumValue(NonUniqueEnum, 'Apple')).toThrow(
        'Enum values are not unique. Cannot get value by value.',
      );
      expect(() => toEnumValue(NonUniqueEnum, 1)).toThrow('Enum values are not unique. Cannot get value by value.');
    });
  });
});

describe('toEnumKey', () => {
  describe('basic functionality', () => {
    it('should return the enum key for a valid key', () => {
      expect(toEnumKey(StringEnum, 'Fruit')).toBe('Fruit');
      expect(toEnumKey(NumericEnum, 'One')).toBe('One');
      expect(toEnumKey(MixedEnum, 'Vegetable')).toBe('Vegetable');
    });
  });

  describe('edge cases', () => {
    it('should return undefined for non-existent keys', () => {
      expect(toEnumKey(StringEnum, 'NotAKey')).toBeUndefined();
      expect(toEnumKey(NumericEnum, 'Four')).toBeUndefined();
    });

    it('should return undefined for null or undefined inputs', () => {
      expect(toEnumKey(StringEnum, null)).toBeUndefined();
      expect(toEnumKey(StringEnum, undefined)).toBeUndefined();
    });

    it('should return undefined for non-string types', () => {
      expect(toEnumKey(StringEnum, 123)).toBeUndefined();
      expect(toEnumKey(StringEnum, true)).toBeUndefined();
      expect(toEnumKey(StringEnum, {})).toBeUndefined();
    });
  });

  describe('options handling', () => {
    it('should return the enum key for case-insensitive keys when ignoreCase is true', () => {
      expect(toEnumKey(StringEnum, 'fruit', { ignoreCase: true })).toBe('Fruit');
      expect(toEnumKey(StringEnum, 'VEGETABLE', { ignoreCase: true })).toBe('Vegetable');
    });

    it('should convert numeric keys to strings when convert is true', () => {
      const numericKeysEnum = { '1': 'One', '2': 'Two' };
      expect(toEnumKey(numericKeysEnum, 1, { convert: true })).toBe('1');
      expect(toEnumKey(StringEnum, 123, { convert: true })).toBeUndefined();
    });

    it('should handle multiple options together', () => {
      expect(toEnumKey(StringEnum, 'Fruit', { convert: true, ignoreCase: true })).toBe('Fruit');
      expect(toEnumKey(StringEnum, 'Vegetable', { convert: true, ignoreCase: true })).toBe('Vegetable');
      expect(toEnumKey(NumericEnum, 'One', { convert: true, ignoreCase: true })).toBe('One');
      expect(toEnumKey(NumericEnum, 'Two', { convert: true, ignoreCase: true })).toBe('Two');
      expect(toEnumKey(MixedEnum, 'Nut', { convert: true, ignoreCase: true })).toBe('Nut');
      expect(toEnumKey(MixedEnum, 'Three', { convert: true, ignoreCase: true })).toBe('Three');
      expect(toEnumKey(NonUniqueEnum, 'Fruit', { convert: true, ignoreCase: true })).toBe('Fruit');
      expect(toEnumKey(NonUniqueEnum, 'Favorite', { convert: true, ignoreCase: true })).toBe('Favorite');
      expect(toEnumKey(customEnumLike, 'A', { convert: true, ignoreCase: true })).toBe('A');
      expect(toEnumKey(customEnumLike, 'C', { convert: true, ignoreCase: true })).toBe('C');
      expect(toEnumKey(StringEnum, 'Dairy', { convert: true, ignoreCase: true })).toBeUndefined();
      expect(toEnumKey(NumericEnum, 'Four', { convert: true, ignoreCase: true })).toBeUndefined();
    });

    it('should throw for case-insensitive duplicate keys', () => {
      const duplicateKeys = {
        Key: 'Value1',
        key: 'Value2',
      };
      expect(() => toEnumKey(duplicateKeys, 'Key', { ignoreCase: true })).toThrow(
        'Enum keys are not unique. Cannot get key by key.',
      );
    });
  });
});

describe('toEnumKeys', () => {
  describe('basic functionality', () => {
    it('should return all keys for a valid value', () => {
      expect(toEnumKeys(StringEnum, 'Apple')).toEqual(['Fruit']);
      expect(toEnumKeys(NumericEnum, 1)).toEqual(['One']);
      expect(toEnumKeys(NonUniqueEnum, 'Apple')).toEqual(['Fruit', 'Favorite']);
      expect(toEnumKeys(NonUniqueEnum, 1)).toEqual(['One', 'First']);
    });
  });

  describe('edge cases', () => {
    it('should return empty array for non-existent values', () => {
      expect(toEnumKeys(StringEnum, 'Banana')).toEqual([]);
      expect(toEnumKeys(NumericEnum, 4)).toEqual([]);
    });

    it('should return empty array for null or undefined values', () => {
      expect(toEnumKeys(StringEnum, null)).toEqual([]);
      expect(toEnumKeys(StringEnum, undefined)).toEqual([]);
    });
  });

  describe('options handling', () => {
    it('should return all keys for case-insensitive values when ignoreCase is true', () => {
      expect(toEnumKeys(StringEnum, 'apple', { ignoreCase: true })).toEqual(['Fruit']);
      expect(toEnumKeys(StringEnum, 'CUCUMBER', { ignoreCase: true })).toEqual(['Vegetable']);
    });

    it('should convert string values to numbers when convert is true', () => {
      expect(toEnumKeys(NumericEnum, '1', { convert: true })).toEqual(['One']);
      expect(toEnumKeys(NumericEnum, '2', { convert: true })).toEqual(['Two']);
      expect(toEnumKeys(NumericEnum, '4', { convert: true })).toEqual([]);
    });

    it('should handle both ignoreCase and convert options together', () => {
      expect(toEnumKeys(StringEnum, 'apple', { ignoreCase: true, convert: true })).toEqual(['Fruit']);
      expect(toEnumKeys(NumericEnum, '1', { ignoreCase: true, convert: true })).toEqual(['One']);
    });
  });

  describe('custom EnumLike objects', () => {
    it('should return all keys for a valid value in custom EnumLike', () => {
      expect(toEnumKeys(customEnumLike, 'ValueA')).toEqual(['A']);
      expect(toEnumKeys(customEnumLike, 123)).toEqual(['C']);
      expect(toEnumKeys(nonUniqueCustomEnumLike, 'ValueA')).toEqual(['A', 'C']);
    });

    it('should return empty array for empty EnumLike', () => {
      expect(toEnumKeys(emptyEnumLike, 'any')).toEqual([]);
    });
  });
});

describe('equalFn', () => {
  describe('basic functionality', () => {
    it('should compare values with default options', () => {
      const compare = equalFn();
      expect(compare('Apple', 'Apple')).toBe(true);
      expect(compare('Apple', 'apple')).toBe(false);
      expect(compare(1, 1)).toBe(true);
      expect(compare(1, 2)).toBe(false);
      expect(compare(1, '1')).toBe(false);
    });
  });

  describe('options handling', () => {
    it('should compare values case-insensitively when ignoreCase is true', () => {
      const compare = equalFn({ ignoreCase: true });
      expect(compare('Apple', 'apple')).toBe(true);
      expect(compare('Apple', 'APPLE')).toBe(true);
      expect(compare('Apple', 'banana')).toBe(false);
      expect(compare(1, 1)).toBe(true); // ignoreCase doesn't affect numbers
    });

    it('should convert string values to numbers when convert is true', () => {
      const compare = equalFn({ convert: true });
      expect(compare(1, '1')).toBe(true);
      expect(compare('1', 1)).toBe(true);
      expect(compare(1, '2')).toBe(false);
      expect(compare('1', 2)).toBe(false);
    });

    it('should apply custom normalization when normalize is provided', () => {
      const normalize = (value: unknown) => (typeof value === 'string' ? value.replace(/\s+/g, '') : value);
      const compare = equalFn({ normalize });
      expect(compare('hello world', 'helloworld')).toBe(true);
      expect(compare('test  string', 'teststring')).toBe(true);
      expect(compare('different', 'text')).toBe(false);
    });

    it('should combine ignoreCase, convert, and normalize options', () => {
      const normalize = (value: unknown) => (typeof value === 'string' ? value.trim() : value);
      const compare = equalFn({ normalize, ignoreCase: true, convert: true });
      expect(compare(1, ' 1 ')).toBe(true);
      expect(compare('Hello ', ' hello')).toBe(true);
      expect(compare(100, '100.0')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should return false for undefined, null, or object inputs', () => {
      const compare = equalFn();
      // @ts-expect-error testing with undefined
      expect(compare(undefined, 'value')).toBe(false);
      // @ts-expect-error testing with null
      expect(compare(null, 'value')).toBe(false);
      // @ts-expect-error testing with object
      expect(compare({}, 'value')).toBe(false);
    });
  });
});

describe('validateEnumLike', () => {
  describe('basic functionality', () => {
    it('should not throw for valid EnumLike objects', () => {
      expect(() => validateEnumLike(StringEnum)).not.toThrow();
      expect(() => validateEnumLike(NumericEnum)).not.toThrow();
      expect(() => validateEnumLike(MixedEnum)).not.toThrow();
      expect(() => validateEnumLike(customEnumLike)).not.toThrow();
      expect(() => validateEnumLike(emptyEnumLike)).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should throw for null or undefined input', () => {
      expect(() => validateEnumLike(null)).toThrow('The enum object is required.');
      expect(() => validateEnumLike(undefined)).toThrow('The enum object is required.');
    });

    it('should throw for non-object input', () => {
      expect(() => validateEnumLike('string')).toThrow('The enum object is required.');
      expect(() => validateEnumLike(123)).toThrow('The enum object is required.');
      expect(() => validateEnumLike(true)).toThrow('The enum object is required.');
      expect(() => validateEnumLike(() => {})).toThrow('The enum object is required.'); // NOSONAR
    });

    it('should throw for objects with invalid values', () => {
      const invalidValues = {
        A: {},
        B: 'Valid',
      };
      expect(() => validateEnumLike(invalidValues)).toThrow(
        'Invalid enum value: [object Object]. Expected string or number.',
      );
    });

    it('should handle Symbol properties without throwing', () => {
      const symbolKey = Symbol('test');
      const objWithSymbol = {
        normalKey: 'value',
        [symbolKey]: 'symbolValue',
      };
      expect(() => validateEnumLike(objWithSymbol)).not.toThrow();
    });

    it('should handle objects with prototype properties', () => {
      class TestClass {
        protoValue = 'inherited';
      }
      const instance = new TestClass();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any).ownValue = 'direct';
      expect(() => validateEnumLike(instance)).not.toThrow();
    });
  });
});

describe('dynamic enum modifications', () => {
  describe('modified EnumLike objects', () => {
    it('should reflect changes to EnumLike objects after modification', () => {
      const dynamicEnum: EnumLike = {
        A: 'ValueA',
        B: 'ValueB',
      };
      expect(enumValueByKey(dynamicEnum, 'A')).toBe('ValueA');
      dynamicEnum['C'] = 'ValueC';
      expect(enumValueByKey(dynamicEnum, 'C')).toBe('ValueC');
    });
  });
});

describe('performance tests', () => {
  describe('large EnumLike objects', () => {
    it('should handle large EnumLike objects efficiently', () => {
      const largeEnum: EnumLike = {};
      for (let i = 0; i < 1000; i++) {
        largeEnum[`Key${i}`] = `Value${i % 100}`; // Creates some duplicates
      }
      expect(typeof enumValueByKey(largeEnum, 'Key500')).toBe('string');
      expect(enumKeysByValue(largeEnum, 'Value50').length).toBeGreaterThan(0);
      expect(() => enumKeyByValue(largeEnum, 'Value50')).toThrow();
    });
  });
});

describe('custom converter functionality', () => {
  describe('TypeConverter with custom types', () => {
    it('should use custom converter for date to timestamp conversion', () => {
      const dateEnum = {
        Event1: 1609459200000, // 2021-01-01 00:00:00 UTC
        Event2: 1640995200000, // 2022-01-01 00:00:00 UTC
      };

      const dateConverter = (value: unknown): number | undefined => {
        if (value instanceof Date) return value.getTime();
        if (typeof value === 'number') return value;
        return undefined;
      };

      const date1 = new Date('2021-01-01T00:00:00.000Z');
      expect(isEnumValue(dateEnum, date1, { convert: true, converter: dateConverter })).toBe(true);
      expect(toEnumValue(dateEnum, date1, { convert: true, converter: dateConverter })).toBe(1609459200000);
      expect(toEnumKeys(dateEnum, date1, { convert: true, converter: dateConverter })).toEqual(['Event1']);
    });

    it('should use custom converter for boolean to number conversion', () => {
      const boolEnum = {
        False: 0,
        True: 1,
      };

      const boolConverter = (value: unknown): number | undefined => {
        if (typeof value === 'boolean') return value ? 1 : 0;
        if (typeof value === 'number') return value;
        return undefined;
      };

      expect(isEnumValue(boolEnum, true, { convert: true, converter: boolConverter })).toBe(true);
      expect(isEnumValue(boolEnum, false, { convert: true, converter: boolConverter })).toBe(true);
      expect(toEnumValue(boolEnum, true, { convert: true, converter: boolConverter })).toBe(1);
      expect(toEnumValue(boolEnum, false, { convert: true, converter: boolConverter })).toBe(0);
      expect(toEnumKeys(boolEnum, true, { convert: true, converter: boolConverter })).toEqual(['True']);
      expect(toEnumKeys(boolEnum, false, { convert: true, converter: boolConverter })).toEqual(['False']);
    });

    it('should use custom converter for trimming and lowercasing strings', () => {
      const trimEnum = {
        Apple: 'apple',
        Banana: 'banana',
      };

      const trimLowerConverter = (value: unknown): string | undefined => {
        if (typeof value === 'string') return value.trim().toLowerCase();
        return undefined;
      };

      expect(isEnumValue(trimEnum, '  APPLE  ', { convert: true, converter: trimLowerConverter })).toBe(true);
      expect(toEnumValue(trimEnum, '  Banana  ', { convert: true, converter: trimLowerConverter })).toBe('banana');
      expect(toEnumKeys(trimEnum, ' Apple ', { convert: true, converter: trimLowerConverter })).toEqual(['Apple']);
    });

    it('should use custom converter for hex to decimal conversion', () => {
      const hexEnum = {
        Color1: 255, // 0xFF
        Color2: 4080, // 0xFF0
        Color3: 65280, // 0xFF00
      };

      const hexConverter = (value: unknown): number | undefined => {
        if (typeof value === 'string' && value.startsWith('0x')) {
          const num = parseInt(value, 16);
          return isNaN(num) ? undefined : num;
        }
        if (typeof value === 'number') return value;
        return undefined;
      };

      expect(isEnumValue(hexEnum, '0xFF', { convert: true, converter: hexConverter })).toBe(true);
      expect(toEnumValue(hexEnum, '0xFF0', { convert: true, converter: hexConverter })).toBe(4080);
      expect(toEnumKeys(hexEnum, '0xFF00', { convert: true, converter: hexConverter })).toEqual(['Color3']);
    });

    it('should return undefined when custom converter returns undefined', () => {
      const strictConverter = (value: unknown): string | undefined => {
        if (typeof value === 'string' && value.length > 5) return value;
        return undefined;
      };

      // When converter returns undefined, the value becomes undefined and won't match enum values
      // However, the current implementation still compares the converted value
      // Since 'App' is converted to undefined by the converter, it won't match 'Apple'
      expect(isEnumValue(StringEnum, 'LongString', { convert: true, converter: strictConverter })).toBe(false);
      expect(toEnumValue(StringEnum, 'LongString', { convert: true, converter: strictConverter })).toBeUndefined();
      expect(toEnumKeys(StringEnum, 'LongString', { convert: true, converter: strictConverter })).toEqual([]);
    });

    it('should work with custom converter in equalFn', () => {
      const upperConverter = (value: unknown): string | undefined => {
        if (typeof value === 'string') return value.toUpperCase();
        return undefined;
      };

      const compare = equalFn({ convert: true, converter: upperConverter });
      expect(compare('APPLE', 'apple')).toBe(true);
      expect(compare('APPLE', 'APPLE')).toBe(true);
      expect(compare('APPLE', 'banana')).toBe(false);
    });

    it('should prefer custom converter over default converter', () => {
      const customNumConverter = (value: unknown): number | undefined => {
        // Custom converter that doubles the number
        if (typeof value === 'string') {
          const num = Number(value);
          return isNaN(num) ? undefined : num * 2;
        }
        if (typeof value === 'number') return value;
        return undefined;
      };

      const doubledEnum = {
        Two: 2,
        Four: 4,
        Six: 6,
      };

      // With custom converter, '1' becomes 2, which matches 'Two'
      expect(isEnumValue(doubledEnum, '1', { convert: true, converter: customNumConverter })).toBe(true);
      expect(toEnumValue(doubledEnum, '1', { convert: true, converter: customNumConverter })).toBe(2);
      expect(toEnumKeys(doubledEnum, '2', { convert: true, converter: customNumConverter })).toEqual(['Four']);
    });
  });

  describe('converter with normalize option', () => {
    it('should apply normalize before converter', () => {
      const normalize = (value: unknown) => (typeof value === 'string' ? value.trim() : value);
      const converter = (value: unknown): string | undefined => {
        if (typeof value === 'string') return value.toUpperCase();
        return undefined;
      };

      const compare = equalFn({ normalize, convert: true, converter });
      expect(compare('APPLE', '  apple  ')).toBe(true);
    });

    it('should work with all options combined: normalize, convert, ignoreCase, and converter', () => {
      const spaceEnum = {
        HelloWorld: 'hello world',
        GoodbyeWorld: 'goodbye world',
      };

      const normalize = (value: unknown) => (typeof value === 'string' ? value.replace(/_/g, ' ') : value);
      const converter = (value: unknown): string | undefined => {
        if (typeof value === 'string') return value.toLowerCase();
        return undefined;
      };

      expect(isEnumValue(spaceEnum, 'HELLO_WORLD', { normalize, convert: true, converter, ignoreCase: true })).toBe(
        true,
      );
      expect(toEnumValue(spaceEnum, 'Goodbye_World', { normalize, convert: true, converter })).toBe('goodbye world');
    });
  });

  describe('TypeConverter edge cases', () => {
    it('should handle converter that returns constant value', () => {
      const converter = (): number | undefined => 123;

      // Converter always returns 123 for ANY input
      // When comparing:
      // - ALL enum values ('Apple', 'Cucumber', 'Almond') get converted to 123
      // - Input value 123 gets converted to 123
      // - They all match! So this creates non-unique converted values
      expect(isEnumValue(StringEnum, 123, { convert: true, converter })).toBe(true);
      // toEnumValue throws because all values convert to the same value
      expect(() => toEnumValue(StringEnum, 123, { convert: true, converter })).toThrow('Enum values are not unique');
    });

    it('should handle converter that throws errors gracefully', () => {
      const throwingConverter = (): never => {
        throw new Error('Converter error');
      };

      // Should throw when converter is called
      expect(() => isEnumValue(StringEnum, 'Apple', { convert: true, converter: throwingConverter })).toThrow(
        'Converter error',
      );
    });

    it('should handle converter that returns unexpected types', () => {
      const badConverter = () => ({ invalid: 'object' }) as unknown as string;

      // TypeScript won't catch this at runtime, but the comparison will fail
      expect(isEnumValue(StringEnum, 'Apple', { convert: true, converter: badConverter })).toBe(false);
    });
  });

  describe('converter without convert flag', () => {
    it('should not use converter when convert is false', () => {
      const converter = (value: unknown): number | undefined => {
        if (typeof value === 'string') return 999; // Should not be called
        return undefined;
      };

      expect(isEnumValue(NumericEnum, '1', { convert: false, converter })).toBe(false);
      expect(toEnumValue(NumericEnum, '1', { convert: false, converter })).toBeUndefined();
    });

    it('should not use converter when convert is undefined', () => {
      const converter = (value: unknown): number | undefined => {
        if (typeof value === 'string') return 999; // Should not be called
        return undefined;
      };

      expect(isEnumValue(NumericEnum, '1', { converter })).toBe(false);
      expect(toEnumValue(NumericEnum, '1', { converter })).toBeUndefined();
    });
  });
});

describe('default converter functionality', () => {
  describe('number conversion', () => {
    it('should convert valid numeric strings to numbers', () => {
      expect(isEnumValue(NumericEnum, '1', { convert: true })).toBe(true);
      expect(isEnumValue(NumericEnum, '2', { convert: true })).toBe(true);
      expect(toEnumValue(NumericEnum, '3', { convert: true })).toBe(3);
    });

    it('should handle string with whitespace', () => {
      expect(isEnumValue(NumericEnum, '  1  ', { convert: true })).toBe(true);
      expect(toEnumValue(NumericEnum, '  2  ', { convert: true })).toBe(2);
    });

    it('should handle negative numbers', () => {
      const negativeEnum = { MinusOne: -1, MinusTwo: -2 };
      expect(isEnumValue(negativeEnum, '-1', { convert: true })).toBe(true);
      expect(toEnumValue(negativeEnum, '-2', { convert: true })).toBe(-2);
    });

    it('should handle decimal numbers', () => {
      const decimalEnum = { Half: 0.5, Quarter: 0.25 };
      expect(isEnumValue(decimalEnum, '0.5', { convert: true })).toBe(true);
      expect(toEnumValue(decimalEnum, '0.25', { convert: true })).toBe(0.25);
    });

    it('should handle zero', () => {
      const zeroEnum = { Zero: 0 };
      expect(isEnumValue(zeroEnum, '0', { convert: true })).toBe(true);
      expect(toEnumValue(zeroEnum, '0', { convert: true })).toBe(0);
    });

    it('should reject invalid numeric strings', () => {
      expect(isEnumValue(NumericEnum, 'abc', { convert: true })).toBe(false);
      expect(isEnumValue(NumericEnum, '', { convert: true })).toBe(false);
      expect(isEnumValue(NumericEnum, '  ', { convert: true })).toBe(false);
      expect(toEnumValue(NumericEnum, 'invalid', { convert: true })).toBeUndefined();
    });

    it('should handle scientific notation', () => {
      const sciEnum = { Thousand: 1000, Million: 1000000 };
      expect(isEnumValue(sciEnum, '1e3', { convert: true })).toBe(true);
      expect(toEnumValue(sciEnum, '1e6', { convert: true })).toBe(1000000);
    });

    it('should handle Infinity', () => {
      const infEnum = { Infinity: Infinity, NegInfinity: -Infinity };
      expect(isEnumValue(infEnum, 'Infinity', { convert: true })).toBe(true);
      expect(isEnumValue(infEnum, '-Infinity', { convert: true })).toBe(true);
      expect(toEnumValue(infEnum, 'Infinity', { convert: true })).toBe(Infinity);
    });

    it('should reject NaN values', () => {
      const nanEnum = { One: 1 };
      expect(isEnumValue(nanEnum, NaN, { convert: true })).toBe(false);
      expect(toEnumValue(nanEnum, NaN, { convert: true })).toBeUndefined();
    });
  });
});
