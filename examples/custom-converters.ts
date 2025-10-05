/**
 * Custom Converter Examples
 *
 * This example demonstrates how to use custom converter functions with ts-enum-util
 * for advanced type conversions and data processing.
 */

import {
  enumValueByValue,
  isEnumValue,
  toEnumValue,
  toEnumKey,
  toEnumKeys,
  equalFn,
  type TypeConverter,
} from '../src/enums';

// Date-based enums
enum EventType {
  NewYear2023 = 1672531200000, // 2023-01-01 00:00:00 UTC
  NewYear2024 = 1704067200000, // 2024-01-01 00:00:00 UTC
  Christmas2023 = 1703462400000, // 2023-12-25 00:00:00 UTC
}

// Color enums with hex values
enum Color {
  Red = 255, // 0xFF
  Green = 65280, // 0xFF00
  Blue = 16711680, // 0xFF0000
}

// File size enums
enum FileSize {
  Small = 1024, // 1KB
  Medium = 1048576, // 1MB
  Large = 1073741824, // 1GB
}

console.log('=== Custom Converter Examples ===\n');

// 1. Date to timestamp converter
console.log('1. Date to timestamp converter:');
const dateConverter: TypeConverter = (value: unknown): number | undefined => {
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date.getTime();
  }
  return undefined;
};

const newYear2023 = new Date('2023-01-01T00:00:00.000Z');
console.log('Date to event type:', toEnumValue(EventType, newYear2023, { convert: true, converter: dateConverter })); // 1672531200000
console.log(
  'Date string to event type:',
  toEnumValue(EventType, '2024-01-01T00:00:00.000Z', { convert: true, converter: dateConverter }),
); // 1704067200000
console.log(
  'Is Christmas 2023 valid?',
  isEnumValue(EventType, new Date('2023-12-25T00:00:00.000Z'), { convert: true, converter: dateConverter }),
); // true

// 2. Hex string to number converter
console.log('\n2. Hex string to number converter:');
const hexConverter: TypeConverter = (value: unknown): number | undefined => {
  if (typeof value === 'string' && value.startsWith('0x')) {
    const num = parseInt(value, 16);
    return isNaN(num) ? undefined : num;
  }
  if (typeof value === 'number') {
    return value;
  }
  return undefined;
};

console.log('Hex "0xFF" to color:', toEnumValue(Color, '0xFF', { convert: true, converter: hexConverter })); // 255
console.log('Hex "0xFF00" to color:', toEnumValue(Color, '0xFF00', { convert: true, converter: hexConverter })); // 65280
console.log('Hex "0xFF0000" to color:', toEnumValue(Color, '0xFF0000', { convert: true, converter: hexConverter })); // 16711680
console.log('Is "0xFF" a valid color?', isEnumValue(Color, '0xFF', { convert: true, converter: hexConverter })); // true

// 3. File size converter (with units)
console.log('\n3. File size converter (with units):');
const fileSizeConverter: TypeConverter = (value: unknown): number | undefined => {
  if (typeof value === 'string') {
    const match = value.match(/^(\d+(?:\.\d+)?)\s*(KB|MB|GB)$/i);
    if (match) {
      const [, size, unit] = match;
      const numSize = parseFloat(size);
      switch (unit.toUpperCase()) {
        case 'KB':
          return Math.floor(numSize * 1024);
        case 'MB':
          return Math.floor(numSize * 1048576);
        case 'GB':
          return Math.floor(numSize * 1073741824);
      }
    }
  }
  if (typeof value === 'number') {
    return value;
  }
  return undefined;
};

console.log('File size "1KB" to enum:', toEnumValue(FileSize, '1KB', { convert: true, converter: fileSizeConverter })); // 1024
console.log('File size "1MB" to enum:', toEnumValue(FileSize, '1MB', { convert: true, converter: fileSizeConverter })); // 1048576
console.log('File size "1GB" to enum:', toEnumValue(FileSize, '1GB', { convert: true, converter: fileSizeConverter })); // 1073741824
console.log(
  'Is "2MB" a valid file size?',
  isEnumValue(FileSize, '2MB', { convert: true, converter: fileSizeConverter }),
); // false (only 1MB is defined)

// 4. Boolean to number converter
console.log('\n4. Boolean to number converter:');
enum BooleanValue {
  False = 0,
  True = 1,
}

const booleanConverter: TypeConverter = (value: unknown): number | undefined => {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === '1' || lower === 'yes') {
      return 1;
    }
    if (lower === 'false' || lower === '0' || lower === 'no') {
      return 0;
    }
  }
  return undefined;
};

console.log('Boolean true to enum:', toEnumValue(BooleanValue, true, { convert: true, converter: booleanConverter })); // 1
console.log('Boolean false to enum:', toEnumValue(BooleanValue, false, { convert: true, converter: booleanConverter })); // 0
console.log(
  'String "true" to enum:',
  toEnumValue(BooleanValue, 'true', { convert: true, converter: booleanConverter }),
); // 1
console.log('String "yes" to enum:', toEnumValue(BooleanValue, 'yes', { convert: true, converter: booleanConverter })); // 1
console.log('String "no" to enum:', toEnumValue(BooleanValue, 'no', { convert: true, converter: booleanConverter })); // 0

// 5. Custom comparison function
console.log('\n5. Custom comparison function:');
const customCompare = equalFn({ convert: true, converter: dateConverter });
console.log('Date comparison (same):', customCompare(newYear2023 as any, new Date('2023-01-01T00:00:00.000Z') as any)); // true
console.log(
  'Date comparison (different):',
  customCompare(newYear2023 as any, new Date('2024-01-01T00:00:00.000Z') as any),
); // false

// 6. Processing user input with custom converters
console.log('\n6. Processing user input with custom converters:');
const processUserInput = (type: string, value: unknown) => {
  switch (type) {
    case 'date':
      const dateValue = toEnumValue(EventType, value, { convert: true, converter: dateConverter });
      if (dateValue) {
        const key = toEnumKey(EventType, dateValue, { convert: true, converter: dateConverter });
        console.log(`✅ Date input: ${value} -> ${key} (${dateValue})`);
        return dateValue;
      } else {
        console.log(`❌ Invalid date input: ${value}`);
        return null;
      }

    case 'color':
      const colorValue = toEnumValue(Color, value, { convert: true, converter: hexConverter });
      if (colorValue) {
        const key = toEnumKey(Color, colorValue, { convert: true, converter: hexConverter });
        console.log(`✅ Color input: ${value} -> ${key} (${colorValue})`);
        return colorValue;
      } else {
        console.log(`❌ Invalid color input: ${value}`);
        return null;
      }

    case 'fileSize':
      const sizeValue = toEnumValue(FileSize, value, { convert: true, converter: fileSizeConverter });
      if (sizeValue) {
        const key = toEnumKey(FileSize, sizeValue, { convert: true, converter: fileSizeConverter });
        console.log(`✅ File size input: ${value} -> ${key} (${sizeValue})`);
        return sizeValue;
      } else {
        console.log(`❌ Invalid file size input: ${value}`);
        return null;
      }

    default:
      console.log(`❌ Unknown type: ${type}`);
      return null;
  }
};

processUserInput('date', new Date('2023-01-01T00:00:00.000Z'));
processUserInput('date', '2024-01-01T00:00:00.000Z');
processUserInput('color', '0xFF');
processUserInput('color', '0xFF00');
processUserInput('fileSize', '1KB');
processUserInput('fileSize', '1MB');

console.log('\n=== End Custom Converter Examples ===');
