# ts-enum-util

[![npm version](https://img.shields.io/npm/v/@caseyplummer/ts-enum-util.svg)](https://www.npmjs.com/package/@caseyplummer/ts-enum-util)
[![npm downloads](https://img.shields.io/npm/dm/@caseyplummer/ts-enum-util.svg)](https://www.npmjs.com/package/@caseyplummer/ts-enum-util)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A comprehensive TypeScript utility library for working with enums and enum-like objects. Provides type-safe functions for finding, validating, and converting enum values with flexible options for case-insensitive matching, type conversion, and custom normalization.

## Features

- 🔍 **Find enum values** by key or value with case-insensitive options
- ✅ **Validate** enum values and keys with type safety
- 🔄 **Convert** values to enum types with automatic type conversion
- 🎯 **Type-safe** with full TypeScript support and generics
- 🚀 **Flexible** with custom converters and normalization functions
- 📦 **Dual format** support (ESM and CommonJS)
- 🧪 **Well tested** with 131+ comprehensive test cases

## Installation

```bash
npm install @caseyplummer/ts-enum-util
```

## Quick Start

```typescript
import { enumValueByKey, isEnumValue, toEnumKey } from '@caseyplummer/ts-enum-util';

enum Color {
  Red = '#ff0000',
  Green = '#00ff00',
  Blue = '#0000ff',
}

// Find enum value by key
const redValue = enumValueByKey(Color, 'Red'); // '#ff0000'

// Check if a value is valid
const isValid = isEnumValue(Color, '#ff0000'); // true

// Convert string to enum key
const key = toEnumKey(Color, 'red', { ignoreCase: true }); // 'Red'
```

## API Reference

### Core Functions

#### `enumValueByKey(enumObj, key, options?)`

Finds an enum value by its key.

```typescript
enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

enumValueByKey(Status, 'Active'); // 'active'
enumValueByKey(Status, 'active', { ignoreCase: true }); // 'active'
```

#### `enumValueByValue(enumObj, value, options?)`

Finds an enum value matching the given value.

```typescript
enumValueByValue(Status, 'active'); // 'active'
enumValueByValue(Status, 'ACTIVE', { ignoreCase: true }); // 'active'
```

#### `enumKeyByKey(enumObj, key, options?)`

Finds an enum key matching the given key.

```typescript
enumKeyByKey(Status, 'Active'); // 'Active'
enumKeyByKey(Status, 'active', { ignoreCase: true }); // 'Active'
```

#### `enumKeyByValue(enumObj, value, options?)`

Finds the enum key for a given value.

```typescript
enumKeyByValue(Status, 'active'); // 'Active'
enumKeyByValue(Status, 'ACTIVE', { ignoreCase: true }); // 'Active'
```

#### `enumKeysByValue(enumObj, value, options?)`

Finds all enum keys matching a given value (handles duplicate values).

```typescript
enum Priority {
  Low = 1,
  Medium = 2,
  High = 1, // Duplicate value
}

enumKeysByValue(Priority, 1); // ['Low', 'High']
```

### Validation Functions

#### `isEnumValue(enumObj, value, options?)`

Checks if a value is a valid enum value.

```typescript
isEnumValue(Status, 'active'); // true
isEnumValue(Status, 'invalid'); // false
isEnumValue(Status, 'ACTIVE', { ignoreCase: true }); // true
```

#### `isEnumKey(enumObj, key, options?)`

Checks if a key is a valid enum key.

```typescript
isEnumKey(Status, 'Active'); // true
isEnumKey(Status, 'Invalid'); // false
isEnumKey(Status, 'active', { ignoreCase: true }); // true
```

#### `isEnumLike(obj)`

Checks if an object is enum-like (string keys, string/number values).

```typescript
isEnumLike({ A: 'value', B: 123 }); // true
isEnumLike({ A: true }); // false
```

### Conversion Functions

#### `toEnumValue(enumObj, value, options?)`

Converts a value to an enum value.

```typescript
enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
}

toEnumValue(Priority, '2', { convert: true }); // 2
toEnumValue(Priority, 'invalid'); // undefined
```

#### `toEnumKey(enumObj, key, options?)`

Converts a value to an enum key.

```typescript
toEnumKey(Priority, 1, { convert: true }); // 'Low'
toEnumKey(Priority, 'invalid'); // undefined
```

#### `toEnumKeys(enumObj, value, options?)`

Converts a value to an array of enum keys.

```typescript
enum Priority {
  Low = 1,
  Medium = 2,
  High = 1, // Duplicate
}

toEnumKeys(Priority, 1); // ['Low', 'High']
```

### Utility Functions

#### `equalFn(options?)`

Creates a comparison function with configurable options.

```typescript
const compare = equalFn({ ignoreCase: true });
compare('Hello', 'hello'); // true
```

#### `validateEnumLike(obj)`

Validates that an object is enum-like (throws if invalid).

```typescript
validateEnumLike({ A: 'value' }); // OK
validateEnumLike({ A: true }); // Throws error
```

## Options

All functions accept an optional `EnumOptions` object:

```typescript
interface EnumOptions {
  normalize?: (value: unknown) => unknown; // Custom normalization
  ignoreCase?: boolean; // Case-insensitive matching
  convert?: boolean; // Enable type conversion
  converter?: TypeConverter; // Custom converter function
}
```

### Option Examples

#### Case-Insensitive Matching

```typescript
enum Color {
  Red = 'red',
  Blue = 'blue',
}

enumValueByKey(Color, 'RED', { ignoreCase: true }); // 'red'
isEnumValue(Color, 'BLUE', { ignoreCase: true }); // true
```

#### Type Conversion

```typescript
enum Count {
  One = 1,
  Two = 2,
}

toEnumValue(Count, '1', { convert: true }); // 1
isEnumValue(Count, '2', { convert: true }); // true
```

#### Custom Normalization

```typescript
const normalize = (value: unknown) => (typeof value === 'string' ? value.trim().toLowerCase() : value);

enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

isEnumValue(Status, '  ACTIVE  ', { normalize, ignoreCase: true }); // true
```

#### Custom Converter

```typescript
const dateConverter = (value: unknown): number | undefined => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  return undefined;
};

enum Timestamp {
  NewYear2023 = 1672531200000,
  NewYear2024 = 1704067200000,
}

const date = new Date('2023-01-01');
toEnumValue(Timestamp, date, { convert: true, converter: dateConverter }); // 1672531200000
```

## Working with Custom Objects

The library works with any enum-like object (string keys, string/number values):

```typescript
const customEnum = {
  Option1: 'value1',
  Option2: 'value2',
  Option3: 123,
};

enumValueByKey(customEnum, 'Option1'); // 'value1'
isEnumValue(customEnum, 123); // true
```

## TypeScript Support

Full TypeScript support with generics and type inference:

```typescript
enum Priority {
  Low = 1,
  High = 2,
}

// Type inference works automatically
const value: Priority = enumValueByKey(Priority, 'Low'); // Type: Priority
const key: keyof typeof Priority = enumKeyByValue(Priority, 2); // Type: 'High'
```

## Error Handling

Functions throw descriptive errors for invalid inputs:

```typescript
// Throws: "The enum object is required."
enumValueByKey(null, 'key');

// Throws: "Enum values are not unique. Cannot get value by value."
enum Value {
  A = 'same',
  B = 'same',
}
enumValueByValue(Value, 'same');
```

## Performance

Optimized for performance with large enums:

- O(n) lookup operations
- Efficient filtering and mapping
- Memory-conscious implementations
- Tested with 1000+ enum entries

## Contributing

Contributions are welcome! Please see the [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and breaking changes.
