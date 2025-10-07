import { describe, expect, it } from 'vitest';
import {
  enumValueByKey,
  enumValueByValue,
  enumKeyByKey,
  enumKeyByValue,
  enumKeysByValue,
  isEnumValue,
  isEnumKey,
  toEnumValue,
  toEnumKey,
} from '../src/enums';

enum Color {
  Red = '#ff0000',
  Green = '#00ff00',
  Blue = '#0000ff',
  AlsoBlue = '#0000ff',
}

describe('Quickstart Examples', () => {
  describe('enumValueByKey example', () => {
    it('should find enum value by key', () => {
      // Find enum value by key
      const redValue = enumValueByKey(Color, 'Red'); // '#ff0000'
      expect(redValue).toBe('#ff0000');
    });
  });

  describe('enumValueByValue example', () => {
    it('should throw error for duplicate values', () => {
      // Find enum value by value - this should throw because #0000ff has duplicates
      expect(() => enumValueByValue(Color, '#0000ff')).toThrow(
        'Enum values are not unique. Cannot get value by value.',
      );
    });
  });

  describe('enumKeyByKey example', () => {
    it('should find enum key by key', () => {
      // Find enum key by key
      const blueKey = enumKeyByKey(Color, 'Blue'); // 'Blue'
      expect(blueKey).toBe('Blue');
    });
  });

  describe('enumKeyByValue example', () => {
    it('should find enum key by value', () => {
      // Find enum key by value
      const redKey = enumKeyByValue(Color, '#ff0000'); // 'Red'
      expect(redKey).toBe('Red');
    });
  });

  describe('enumKeyByValue error case', () => {
    it('should throw error for duplicate values', () => {
      // Find enum key by value
      // const blueKeyBad = enumKeyByValue(Color, '#0000ff'); // Throws an error because of duplicate values
      expect(() => enumKeyByValue(Color, '#0000ff')).toThrow('Enum values are not unique. Cannot get key by value.');
    });
  });

  describe('enumKeysByValue example', () => {
    it('should find enum keys by value', () => {
      // Find enum keys by value
      const blueKeys = enumKeysByValue(Color, '#0000ff'); // ['Blue', 'AlsoBlue']
      expect(blueKeys).toEqual(['Blue', 'AlsoBlue']);
    });
  });

  describe('isEnumValue example', () => {
    it('should check if a value is valid', () => {
      // Check if a value is valid
      const isValidValue = isEnumValue(Color, '#ff0000'); // true
      expect(isValidValue).toBe(true);
    });
  });

  describe('isEnumKey example', () => {
    it('should check if a key is valid', () => {
      // Check if a key is valid
      const isValidKey = isEnumKey(Color, 'Blue'); // true
      expect(isValidKey).toBe(true);
    });
  });

  describe('toEnumValue example', () => {
    it('should convert string to enum value', () => {
      // Convert string to enum value
      const greenValue = toEnumValue(Color, '#00FF00', { ignoreCase: true }); // '#00ff00'
      expect(greenValue).toBe('#00ff00');
    });
  });

  describe('toEnumKey example', () => {
    it('should convert string to enum key', () => {
      // Convert string to enum key
      const greenKey = toEnumKey(Color, 'green', { ignoreCase: true }); // 'Green'
      expect(greenKey).toBe('Green');
    });
  });
});
