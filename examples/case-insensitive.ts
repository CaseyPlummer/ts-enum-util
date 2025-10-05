/**
 * Case-Insensitive Usage Examples
 *
 * This example demonstrates how to use ts-enum-util with case-insensitive
 * matching for user input validation and processing.
 */

import { enumValueByKey, enumKeyByKey, enumKeyByValue, isEnumValue, isEnumKey, toEnumKey } from '../src/enums';

// User-facing enums that might receive mixed case input
enum Theme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

enum Language {
  English = 'en',
  Spanish = 'es',
  French = 'fr',
  German = 'de',
}

enum Permission {
  Read = 'read',
  Write = 'write',
  Execute = 'execute',
  Admin = 'admin',
}

console.log('=== Case-Insensitive Examples ===\n');

// 1. User input validation
console.log('1. User input validation:');
const userInput = 'LIGHT';
const theme = enumValueByKey(Theme, userInput, { ignoreCase: true });
console.log(`User input "${userInput}" -> theme:`, theme); // 'light'

const languageInput = 'english';
const language = enumValueByKey(Language, languageInput, { ignoreCase: true });
console.log(`User input "${languageInput}" -> language:`, language); // 'en'

// 2. Case-insensitive validation
console.log('\n2. Case-insensitive validation:');
console.log('Is "DARK" a valid theme?', isEnumValue(Theme, 'DARK', { ignoreCase: true })); // true
console.log('Is "light" a valid theme?', isEnumValue(Theme, 'light', { ignoreCase: true })); // true
console.log('Is "AUTO" a valid theme?', isEnumValue(Theme, 'AUTO', { ignoreCase: true })); // true
console.log('Is "invalid" a valid theme?', isEnumValue(Theme, 'invalid', { ignoreCase: true })); // false

// 3. Finding keys with case-insensitive input
console.log('\n3. Finding keys with case-insensitive input:');
console.log('Key for "dark":', enumKeyByKey(Theme, 'dark', { ignoreCase: true })); // 'Dark'
console.log('Key for "DARK":', enumKeyByKey(Theme, 'DARK', { ignoreCase: true })); // 'Dark'
console.log('Key for "Dark":', enumKeyByKey(Theme, 'Dark', { ignoreCase: true })); // 'Dark'

// 4. Finding keys by value with case-insensitive matching
console.log('\n4. Finding keys by value with case-insensitive matching:');
console.log('Key for "light":', enumKeyByValue(Theme, 'light', { ignoreCase: true })); // 'Light'
console.log('Key for "LIGHT":', enumKeyByValue(Theme, 'LIGHT', { ignoreCase: true })); // 'Light'
console.log('Key for "Light":', enumKeyByValue(Theme, 'Light', { ignoreCase: true })); // 'Light'

// 5. Converting user input to enum keys
console.log('\n5. Converting user input to enum keys:');
const userPermissionInput = 'READ';
const permissionKey = toEnumKey(Permission, userPermissionInput, { ignoreCase: true });
console.log(`User input "${userPermissionInput}" -> key:`, permissionKey); // 'Read'

const userLanguageInput = 'FRENCH';
const languageKey = toEnumKey(Language, userLanguageInput, { ignoreCase: true });
console.log(`User input "${userLanguageInput}" -> key:`, languageKey); // 'French'

// 6. API endpoint processing
console.log('\n6. API endpoint processing:');
const processThemeRequest = (input: string) => {
  const theme = enumValueByKey(Theme, input, { ignoreCase: true });
  if (theme) {
    console.log(`✅ Valid theme request: ${input} -> ${theme}`);
    return theme;
  } else {
    console.log(`❌ Invalid theme request: ${input}`);
    return null;
  }
};

processThemeRequest('light');
processThemeRequest('LIGHT');
processThemeRequest('Light');
processThemeRequest('invalid');

// 7. Configuration file processing
console.log('\n7. Configuration file processing:');
const processConfig = (key: string, value: string) => {
  const validKey = enumKeyByKey(Permission, key, { ignoreCase: true });
  const validValue = isEnumValue(Permission, value, { ignoreCase: true });

  if (validKey && validValue) {
    console.log(`✅ Valid config: ${key} = ${value}`);
  } else {
    console.log(`❌ Invalid config: ${key} = ${value}`);
  }
};

processConfig('read', 'read');
processConfig('READ', 'READ');
processConfig('Write', 'write');
processConfig('invalid', 'invalid');

console.log('\n=== End Case-Insensitive Examples ===');
