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
// } from '@caseyplummer/ts-enum-util';

enum Color {
  Red = '#ff0000',
  Green = '#00ff00',
  Blue = '#0000ff',
  AlsoBlue = '#0000ff',
}

// Find enum value by key
const redValue = enumValueByKey(Color, 'Red'); // '#ff0000'

// Find enum value by value
const blueValue = enumValueByValue(Color, '#0000ff'); // '#0000ff'

// Find enum key by key
const blueKey = enumKeyByKey(Color, 'Blue'); // 'Blue'

// Find enum key by value
const redKey = enumKeyByValue(Color, '#ff0000'); // 'Red'
const blueKeyBad = enumKeyByValue(Color, '#0000ff'); // Throws an error because of duplicate values

// Find enum keys by value
const blueKeys = enumKeysByValue(Color, '#0000ff'); // ['Blue', 'AlsoBlue']

// Check if a value is valid
const isValidValue = isEnumValue(Color, '#ff0000'); // true

// Check if a key is valid
const isValidKey = isEnumKey(Color, 'Blue'); // true

// Convert string to enum value
const value = toEnumValue(Color, 'red', { ignoreCase: true }); // '#ff0000'

// Convert string to enum key
const foundKey = toEnumKey(Color, 'red', { ignoreCase: true }); // 'Red'
