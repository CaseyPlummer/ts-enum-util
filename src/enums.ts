export type EnumValue = string | number;
export type EnumLike = { [key: string]: EnumValue };

/**
 * Type converter function that converts a value to a specific type.
 * @param value - The value to convert
 * @returns The converted value, or undefined if conversion fails
 */
export type TypeConverter = (value: unknown) => string | number | undefined;

export interface EnumOptions {
  normalize?: (value: unknown) => unknown; // Invoked first
  ignoreCase?: boolean; // Only applies to strings
  convert?: boolean; // Converts type
  converter?: TypeConverter; // Custom converter function for type conversion
}

/**
 * Internal helper to convert a value to a number.
 * @param value - The value to convert
 * @returns The converted number, or undefined if conversion fails
 */
function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isNaN(value) ? undefined : value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const converted = Number(trimmed);
    return trimmed.length > 0 && !Number.isNaN(converted) ? converted : undefined;
  }

  return undefined;
}

const passthrough = <T>(value: T) => value;
const lowerCaseIfString = <T>(value: T) => (typeof value === 'string' ? value.toLowerCase() : value);

/**
 * Default type converter that handles string and number conversions.
 * @param value - The value to convert
 * @param toType - The target type to convert to
 * @returns The converted value
 */
const defaultConverter = <T>(value: T, toType: 'string' | 'number') => {
  if (toType === 'string' && typeof value !== 'string') return String(value);
  if (toType === 'number' && typeof value !== 'number') return toNumber(value);
  return value;
};

/**
 * Creates a type converter function based on the target type and options.
 * @param toType - The target type to convert to
 * @param customConverter - Optional custom converter function
 * @returns A converter function
 */
const createConverter = <T>(toType: 'string' | 'number', customConverter?: TypeConverter) => {
  if (customConverter) {
    return (value: T) => customConverter(value);
  }
  return (value: T) => defaultConverter(value, toType);
};

/**
 * Returns a function to compare enum keys or values with configurable options.
 * @param {EnumOptions} [options] - Optional settings, including `normalize`, `convert`, and `ignoreCase`.
 * @returns {(a: string | number, b: string | number) => boolean} A function comparing two keys or values.
 * @remarks The left-hand value (`a`) is the enum key/value, and the right-hand value (`b`) is the input to compare.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * const compare = equalFn({ ignoreCase: true });
 * console.log(compare("Red", "red")); // true
 * console.log(compare("#ff0000", "#FF0000")); // true
 */
export function equalFn(options?: EnumOptions): (a: string | number, b: string | number) => boolean {
  const normalize = options?.normalize ?? passthrough;
  const lowerCase = options?.ignoreCase ? lowerCaseIfString : passthrough;

  return (a: string | number, b: string | number) => {
    // Assume the key/value from the enum is on the left side (a) and the value to compare is on the right side (b).
    const expectedType = typeof a === 'string' ? 'string' : 'number';

    const a1 = normalize(a);
    const b1 = normalize(b);

    const convert = options?.convert ? createConverter(expectedType, options.converter) : passthrough;
    const a2 = convert(a1);
    const b2 = convert(b1);
    if (expectedType !== 'string') {
      return a2 === b2;
    }

    const a3 = lowerCase(a2);
    const b3 = lowerCase(b2);
    return a3 === b3;
  };
}

/**
 * Finds an enum value matching the given value.
 * @template T extends EnumLike
 * @param {T} enumObj - The enum-like object to search.
 * @param {EnumValue | undefined} value - The value to find (case-sensitive by default).
 * @param {EnumOptions} [options] - Optional settings, including `ignoreCase`.
 * @returns {T[keyof T] | undefined} The matching value, or `undefined` if not found.
 * @throws {Error} If multiple values match or if `enumObj` is invalid.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * console.log(enumValueByValue(Color, "#ff0000")); // "#ff0000"
 * console.log(enumValueByValue(Color, "#FF0000", { ignoreCase: true })); // "#ff0000"
 */
export function enumValueByValue<T extends EnumLike>(
  enumObj: T,
  value: EnumValue | undefined,
  options?: EnumOptions,
): T[keyof T] | undefined {
  validateEnumLike(enumObj);
  if (value == null) return undefined;
  const equal = equalFn(options);
  const foundValues = Object.values(enumObj).filter((v) => equal(v, value));
  if (foundValues.length === 0) return undefined;
  if (foundValues.length > 1) {
    throw new Error('Enum values are not unique. Cannot get value by value.');
  }
  return foundValues[0] as T[keyof T];
}

/**
 * Finds an enum value by its key.
 * @template T extends EnumLike
 * @param {T} enumObj - The enum-like object to search.
 * @param {string | undefined} key - The key to find (case-sensitive by default).
 * @param {EnumOptions} [options] - Optional settings, including `ignoreCase`.
 * @returns {T[keyof T] | undefined} The value for the key, or `undefined` if not found.
 * @throws {Error} If multiple keys match or if `enumObj` is invalid.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * console.log(enumValueByKey(Color, "Red")); // "#ff0000"
 * console.log(enumValueByKey(Color, "red", { ignoreCase: true })); // "#ff0000"
 */
export function enumValueByKey<T extends EnumLike>(
  enumObj: T,
  key: string | undefined,
  options?: EnumOptions,
): T[keyof T] | undefined {
  validateEnumLike(enumObj);
  if (key == null) return undefined;
  const equalKey = equalFn(options);
  const foundKeys = Object.keys(enumObj).filter((k) => equalKey(k, key));
  if (foundKeys.length === 0) return undefined;
  if (foundKeys.length > 1) {
    throw new Error('Enum keys are not unique. Cannot get value by key.');
  }
  const foundKey = foundKeys[0];
  return enumObj[foundKey as keyof T];
}

/**
 * Finds all enum keys matching a given value.
 * @template T extends EnumLike
 * @param {T} enumObj - The enum-like object to search.
 * @param {EnumValue | undefined} value - The value to find (case-sensitive by default).
 * @param {EnumOptions} [options] - Optional settings, including `ignoreCase`.
 * @returns {(keyof T)[]} An array of matching keys, or empty if none found.
 * @throws {Error} If `enumObj` is invalid.
 * @example
 * enum Color { Red = 1, Green = 2, Blue = 1 }
 * console.log(enumKeysByValue(Color, 1)); // ["Red", "Blue"]
 * console.log(enumKeysByValue(Color, "1", { ignoreCase: true })); // ["Red", "Blue"]
 */
export function enumKeysByValue<T extends EnumLike>(
  enumObj: T,
  value: EnumValue | undefined,
  options?: EnumOptions,
): (keyof T)[] {
  validateEnumLike(enumObj);
  if (value == null) return [];
  const equalValue = equalFn(options);
  return Object.keys(enumObj).filter((key) => equalValue(enumObj[key] as EnumValue, value as EnumValue)) as (keyof T)[];
}

/**
 * Finds an enum key matching the given key.
 * @template T extends EnumLike
 * @param {T} enumObj - The enum-like object to search.
 * @param {string | undefined} key - The key to find (case-sensitive by default).
 * @param {EnumOptions} [options] - Optional settings, including `ignoreCase`.
 * @returns {keyof T | undefined} The matching key, or `undefined` if not found.
 * @throws {Error} If multiple keys match or if `enumObj` is invalid.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * console.log(enumKeyByKey(Color, "Red")); // "Red"
 * console.log(enumKeyByKey(Color, "red", { ignoreCase: true })); // "Red"
 */
export function enumKeyByKey<T extends EnumLike>(
  enumObj: T,
  key: string | undefined,
  options?: EnumOptions,
): keyof T | undefined {
  validateEnumLike(enumObj);
  if (key == null) return undefined;
  const equalKey = equalFn(options);
  const foundKeys = Object.keys(enumObj).filter((k) => equalKey(k, key));
  if (foundKeys.length === 0) return undefined;
  if (foundKeys.length > 1) {
    throw new Error('Enum keys are not unique. Cannot get key by key.');
  }
  const foundKey = foundKeys[0];
  return foundKey as keyof T;
}

/**
 * Finds the unique enum key for a given value.
 * @template T extends EnumLike
 * @param {T} enumObj - The enum-like object to search.
 * @param {EnumValue | undefined} value - The value to find (case-sensitive by default).
 * @param {EnumOptions} [options] - Optional settings, including `ignoreCase`.
 * @returns {keyof T | undefined} The matching key, or `undefined` if not found.
 * @throws {Error} If multiple keys match or if `enumObj` is invalid.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * console.log(enumKeyByValue(Color, "#00ff00")); // "Green"
 * console.log(enumKeyByValue(Color, "#00FF00", { ignoreCase: true })); // "Green"
 */
export function enumKeyByValue<T extends EnumLike>(
  enumObj: T,
  value: EnumValue | undefined,
  options?: EnumOptions,
): keyof T | undefined {
  validateEnumLike(enumObj);
  if (value == null) return undefined;
  const equalValue = equalFn(options);
  const foundKeys = Object.keys(enumObj).filter((key) => equalValue(enumObj[key] as EnumValue, value as EnumValue));
  if (foundKeys.length === 0) return undefined;
  if (foundKeys.length > 1) {
    throw new Error('Enum values are not unique. Cannot get key by value.');
  }
  return foundKeys[0];
}

/**
 * Checks that an object is enum-like with string keys and string or number values.
 * @param {unknown} enumObj - The object to check.
 * @returns {boolean} True if the object is enum-like, false otherwise.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * console.log(isEnumLike(Color)); // true
 * console.log(isEnumLike({ A: 1, B: "b" })); // true
 * console.log(isEnumLike({ A: true })); // false
 */
export function isEnumLike(enumObj: unknown): enumObj is EnumLike {
  if (!enumObj || typeof enumObj !== 'object') {
    return false;
  }
  for (const key in enumObj) {
    if (Object.hasOwn(enumObj, key)) {
      if (typeof key !== 'string') {
        return false;
      }
      const value = (enumObj as Record<string, unknown>)[key];
      if (typeof value !== 'string' && typeof value !== 'number') {
        return false;
      }
    }
  }
  return true;
}

/**
 * Validates that an object is enum-like with string keys and string or number values.
 * @param {unknown} enumObj - The object to validate.
 * @throws {Error} If the input is not a non-null object, or has non-string keys or non-string/number values.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * validateEnumLike(Color); // Valid
 * validateEnumLike({ A: 1, B: "b" }); // Valid
 * validateEnumLike(null); // Throws: "The enum object is required."
 */
export function validateEnumLike(enumObj: unknown): asserts enumObj is EnumLike {
  if (!enumObj || typeof enumObj !== 'object') {
    throw new Error('The enum object is required.');
  }
  for (const key in enumObj) {
    if (Object.hasOwn(enumObj, key)) {
      if (typeof key !== 'string') {
        throw new Error(`Invalid enum key: ${key}. Expected string.`);
      }
      const value = (enumObj as Record<string, unknown>)[key];
      if (typeof value !== 'string' && typeof value !== 'number') {
        throw new Error(`Invalid enum value: ${value}. Expected string or number.`);
      }
    }
  }
}

/**
 * Checks if a value is a valid enum value for the given enum-like object.
 * @template T extends EnumLike
 * @param {T} enumObj - The enum-like object to validate against.
 * @param {unknown} value - The value to check.
 * @param {EnumOptions} [options] - Optional settings, including `ignoreCase` and `convert`.
 * @returns {boolean} True if the value is a valid enum value, false otherwise.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * console.log(isEnumValue(Color, "#ff0000")); // true
 * console.log(isEnumValue(Color, 123, { convert: true })); // false
 */
export function isEnumValue<T extends EnumLike>(
  enumObj: T,
  value: unknown,
  options: EnumOptions = {},
): value is T[keyof T] {
  validateEnumLike(enumObj);
  if (value == null) return false;
  const equalValue = equalFn(options);
  return Object.values(enumObj).some((v) => equalValue(v, value as EnumValue));
}

/**
 * Converts a value to an enum value for the given enum-like object.
 * @template T extends EnumLike
 * @param {T} enumObj - The enum-like object to validate against.
 * @param {unknown} value - The value to convert.
 * @param {EnumOptions} [options] - Optional settings, including `ignoreCase` and `convert`.
 * @returns {T[keyof T] | undefined} The matching enum value, or `undefined` if not found.
 * @throws {Error} If multiple values match or if `enumObj` is invalid.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * console.log(toEnumValue(Color, "#ff0000")); // "#ff0000"
 * console.log(toEnumValue(Color, 123, { convert: true })); // undefined
 */
export function toEnumValue<T extends EnumLike>(
  enumObj: T,
  value: unknown,
  options: EnumOptions = {},
): T[keyof T] | undefined {
  validateEnumLike(enumObj);
  if (value == null) return undefined;
  const equal = equalFn(options);
  const foundValues = Object.values(enumObj).filter((v) => equal(v, value as EnumValue));
  if (foundValues.length === 0) return undefined;
  if (foundValues.length > 1) {
    throw new Error('Enum values are not unique. Cannot get value by value.');
  }
  return foundValues[0] as T[keyof T];
}

/**
 * Checks if a value is a valid enum key for the given enum-like object.
 * @template T extends EnumLike
 * @param {T} enumObj - The enum-like object to validate against.
 * @param {unknown} key - The key to check.
 * @param {EnumOptions} [options] - Optional settings, including `ignoreCase` and `convert`.
 * @returns {boolean} True if the key is a valid enum key, false otherwise.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * console.log(isEnumKey(Color, "Red")); // true
 * console.log(isEnumKey(Color, 123, { convert: true })); // false
 */
export function isEnumKey<T extends EnumLike>(enumObj: T, key: unknown, options: EnumOptions = {}): key is keyof T {
  validateEnumLike(enumObj);
  if (key == null) return false;
  const compareKey = options.convert ? String(key) : key; // NOSONAR
  if (typeof compareKey !== 'string') return false;
  const equal = equalFn(options);
  return Object.keys(enumObj).some((k) => equal(k, compareKey));
}

/**
 * Converts a value to an enum key for the given enum-like object.
 * @template T extends EnumLike
 * @param {T} enumObj - The enum-like object to validate against.
 * @param {unknown} key - The key to convert.
 * @param {EnumOptions} [options] - Optional settings, including `ignoreCase` and `convert`.
 * @returns {keyof T | undefined} The matching enum key, or `undefined` if not found.
 * @throws {Error} If multiple keys match or if `enumObj` is invalid.
 * @example
 * enum Color { Red = "#ff0000", Green = "#00ff00" }
 * console.log(toEnumKey(Color, "Red")); // "Red"
 * console.log(toEnumKey(Color, 123, { convert: true })); // undefined
 */
export function toEnumKey<T extends EnumLike>(
  enumObj: T,
  key: unknown,
  options: EnumOptions = {},
): keyof T | undefined {
  validateEnumLike(enumObj);
  if (key == null) return undefined;
  const compareKey = options.convert ? String(key) : key; // NOSONAR
  if (typeof compareKey !== 'string') return undefined;
  const equal = equalFn(options);
  const foundKeys = Object.keys(enumObj).filter((k) => equal(k, compareKey));
  if (foundKeys.length === 0) return undefined;
  if (foundKeys.length > 1) {
    throw new Error('Enum keys are not unique. Cannot get key by key.');
  }
  return foundKeys[0] as keyof T;
}

/**
 * Converts a value to an array of enum keys for the given enum-like object.
 * @template T extends EnumLike
 * @param {T} enumObj - The enum-like object to validate against.
 * @param {unknown} value - The value to convert.
 * @param {EnumOptions} [options] - Optional settings, including `ignoreCase` and `convert`.
 * @returns {(keyof T)[]} An array of matching enum keys, or empty if none found.
 * @throws {Error} If `enumObj` is invalid.
 * @example
 * enum Color { Red = 1, Green = 2, Blue = 1 }
 * console.log(toEnumKeys(Color, 1)); // ["Red", "Blue"]
 * console.log(toEnumKeys(Color, 123, { convert: true })); // []
 */
export function toEnumKeys<T extends EnumLike>(enumObj: T, value: unknown, options: EnumOptions = {}): (keyof T)[] {
  validateEnumLike(enumObj);
  if (value == null) return [];
  const equal = equalFn(options);
  return Object.keys(enumObj).filter((key) => equal(enumObj[key] as EnumValue, value as EnumValue)) as (keyof T)[];
}
