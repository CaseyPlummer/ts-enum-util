# Examples

This directory contains practical examples demonstrating how to use `@caseyplummer/ts-enum-util` in various scenarios.

## Running the Examples

Each example file can be executed with TypeScript or Node.js:

```bash
# Using ts-node
npx ts-node examples/basic-usage.ts

# Or compile and run (requires ES2022+ for Object.hasOwn)
npx tsc examples/basic-usage.ts --target es2022 --module commonjs --moduleResolution node
node examples/basic-usage.js

# Or use the project's tsconfig
npx tsc examples/basic-usage.ts --project tsconfig.json
node examples/basic-usage.js
```

## Example Files

### 1. [basic-usage.ts](./basic-usage.ts)

Demonstrates the fundamental usage of all core functions:

- Finding enum values by key or value
- Finding enum keys by key or value
- Validation with `isEnumValue` and `isEnumKey`
- Type conversion with `toEnumValue` and `toEnumKey`
- Working with string, numeric, and mixed enums
- Using custom enum-like objects

### 2. [case-insensitive.ts](./case-insensitive.ts)

Shows how to handle case-insensitive input processing:

- User input validation with mixed case
- Case-insensitive enum matching
- API endpoint processing
- Configuration file processing
- Form input handling

### 3. [type-conversion.ts](./type-conversion.ts)

Demonstrates automatic type conversion features:

- Converting string numbers to numeric enum values
- Converting numbers to string keys
- HTTP response processing
- Form input processing with type conversion
- API query parameter processing
- Handling enums with duplicate values

### 4. [custom-converters.ts](./custom-converters.ts)

Advanced usage with custom converter functions:

- Date to timestamp conversion
- Hex string to number conversion
- File size conversion with units (KB, MB, GB)
- Boolean to number conversion
- Custom comparison functions
- Processing user input with custom converters

### 5. [real-world-scenarios.ts](./real-world-scenarios.ts)

Practical applications in real-world scenarios:

- API response handling
- User authentication and authorization
- Configuration management
- Database operation handling
- Form validation
- Command line interface processing

## Key Concepts Demonstrated

### Basic Operations

- **Finding values**: `enumValueByKey()`, `enumValueByValue()`
- **Finding keys**: `enumKeyByKey()`, `enumKeyByValue()`
- **Validation**: `isEnumValue()`, `isEnumKey()`
- **Conversion**: `toEnumValue()`, `toEnumKey()`

### Advanced Features

- **Case-insensitive matching**: `{ ignoreCase: true }`
- **Type conversion**: `{ convert: true }`
- **Custom normalization**: `{ normalize: (value) => ... }`
- **Custom converters**: `{ converter: (value) => ... }`

### Error Handling

- Graceful handling of invalid inputs
- Descriptive error messages
- Fallback values and default behaviors

### TypeScript Integration

- Full type safety and inference
- Generic type parameters
- Enum-like object support
- Custom type definitions

## Best Practices

1. **Always validate input**: Use validation functions before processing user input
2. **Handle errors gracefully**: Check for `undefined` returns and provide fallbacks
3. **Use appropriate options**: Leverage `ignoreCase` and `convert` options when needed
4. **Custom converters**: Create converters for complex data transformations
5. **Type safety**: Take advantage of TypeScript's type inference and generics

## Performance Considerations

- Functions are optimized for O(n) operations
- Use validation functions to avoid unnecessary processing
- Consider caching results for frequently accessed enums
- Test with large enums (1000+ entries) for performance validation

## Contributing

If you have additional examples or use cases, please consider contributing them to help other developers learn how to use this library effectively.
