/**
 * Basic Usage Examples
 *
 * This example demonstrates the fundamental usage of ts-enum-util functions
 * with common enum patterns.
 */

import {
  enumValueByKey,
  enumValueByValue,
  enumKeyByKey,
  enumKeyByValue,
  isEnumValue,
  isEnumKey,
  toEnumValue,
  toEnumKey,
  type EnumLike,
} from '../src/enums';

// String enums
enum HttpStatus {
  OK = '200',
  NotFound = '404',
  ServerError = '500',
}

// Numeric enums
enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

// Mixed enums (using string/number values only)
enum Config {
  Environment = 'production',
  DebugMode = 'false',
  MaxRetries = 3,
  Timeout = 5000,
}

// Custom enum-like objects
const userRoles: EnumLike = {
  Admin: 'admin',
  User: 'user',
  Guest: 'guest',
};

const apiEndpoints: EnumLike = {
  Login: '/api/login',
  Logout: '/api/logout',
  Profile: '/api/profile',
  Settings: '/api/settings',
};

console.log('=== Basic Usage Examples ===\n');

// 1. Finding values by key
console.log('1. Finding values by key:');
console.log('HttpStatus.OK:', enumValueByKey(HttpStatus, 'OK')); // '200'
console.log('Priority.High:', enumValueByKey(Priority, 'High')); // 3
console.log('User role admin:', enumValueByKey(userRoles, 'Admin')); // 'admin'
console.log('API endpoint login:', enumValueByKey(apiEndpoints, 'Login')); // '/api/login'

// 2. Finding values by value
console.log('\n2. Finding values by value:');
console.log('Status 200:', enumValueByValue(HttpStatus, '200')); // '200'
console.log('Priority 3:', enumValueByValue(Priority, 3)); // 3
console.log('Role admin:', enumValueByValue(userRoles, 'admin')); // 'admin'

// 3. Finding keys by key
console.log('\n3. Finding keys by key:');
console.log('Key OK:', enumKeyByKey(HttpStatus, 'OK')); // 'OK'
console.log('Key High:', enumKeyByKey(Priority, 'High')); // 'High'
console.log('Key Admin:', enumKeyByKey(userRoles, 'Admin')); // 'Admin'

// 4. Finding keys by value
console.log('\n4. Finding keys by value:');
console.log('Key for 200:', enumKeyByValue(HttpStatus, '200')); // 'OK'
console.log('Key for 3:', enumKeyByValue(Priority, 3)); // 'High'
console.log('Key for admin:', enumKeyByValue(userRoles, 'admin')); // 'Admin'

// 5. Validation
console.log('\n5. Validation:');
console.log('Is "200" valid status?', isEnumValue(HttpStatus, '200')); // true
console.log('Is "invalid" valid status?', isEnumValue(HttpStatus, 'invalid')); // false
console.log('Is "High" valid key?', isEnumKey(Priority, 'High')); // true
console.log('Is "Invalid" valid key?', isEnumKey(Priority, 'Invalid')); // false

// 6. Conversion
console.log('\n6. Conversion:');
console.log('Convert "3" to priority:', toEnumValue(Priority, '3', { convert: true })); // 3
console.log('Convert 2 to key:', toEnumKey(Priority, 2, { convert: true })); // 'Medium'
console.log('Convert invalid:', toEnumValue(HttpStatus, 'invalid')); // undefined

// 7. Working with mixed enums
console.log('\n7. Working with mixed enums:');
console.log('Config.Environment:', enumValueByKey(Config, 'Environment')); // 'production'
console.log('Config.DebugMode:', enumValueByKey(Config, 'DebugMode')); // 'false'
console.log('Config.MaxRetries:', enumValueByKey(Config, 'MaxRetries')); // 3

console.log('\n=== End Basic Examples ===');
