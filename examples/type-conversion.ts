/**
 * Type Conversion Examples
 *
 * This example demonstrates how to use ts-enum-util with automatic type conversion
 * for handling string inputs that should be converted to numbers or vice versa.
 */

import { enumValueByValue, isEnumValue, toEnumValue, toEnumKey, toEnumKeys } from '../src/enums';

// Numeric enums that might receive string input
enum StatusCode {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500,
}

enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

enum ErrorCode {
  ValidationError = 1001,
  AuthenticationError = 1002,
  AuthorizationError = 1003,
  NetworkError = 1004,
}

// Enum with duplicate values
enum PriorityLevel {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 1, // Same as Low
  Critical = 4,
}

console.log('=== Type Conversion Examples ===\n');

// 1. Converting string numbers to numeric enum values
console.log('1. Converting string numbers to numeric enum values:');
console.log('String "200" to status code:', toEnumValue(StatusCode, '200', { convert: true })); // 200
console.log('String "404" to status code:', toEnumValue(StatusCode, '404', { convert: true })); // 404
console.log('String "500" to status code:', toEnumValue(StatusCode, '500', { convert: true })); // 500
console.log('Invalid string "999":', toEnumValue(StatusCode, '999', { convert: true })); // undefined

// 2. Validating string inputs with conversion
console.log('\n2. Validating string inputs with conversion:');
console.log('Is "200" a valid status code?', isEnumValue(StatusCode, '200', { convert: true })); // true
console.log('Is "400" a valid status code?', isEnumValue(StatusCode, '400', { convert: true })); // true
console.log('Is "invalid" a valid status code?', isEnumValue(StatusCode, 'invalid', { convert: true })); // false
console.log('Is "999" a valid status code?', isEnumValue(StatusCode, '999', { convert: true })); // false

// 3. Converting numbers to string keys
console.log('\n3. Converting numbers to string keys:');
console.log('Number 200 to key:', toEnumKey(StatusCode, 200, { convert: true })); // 'Success'
console.log('Number 404 to key:', toEnumKey(StatusCode, 404, { convert: true })); // 'NotFound'
console.log('Number 500 to key:', toEnumKey(StatusCode, 500, { convert: true })); // 'ServerError'
console.log('Invalid number 999:', toEnumKey(StatusCode, 999, { convert: true })); // undefined

// 4. HTTP response processing
console.log('\n4. HTTP response processing:');
const processHttpResponse = (statusCode: string | number) => {
  const validCode = toEnumValue(StatusCode, statusCode, { convert: true });
  if (validCode) {
    const key = toEnumKey(StatusCode, validCode, { convert: true });
    console.log(`✅ HTTP ${statusCode} -> ${key} (${validCode})`);
    return { code: validCode, key };
  } else {
    console.log(`❌ Invalid HTTP status: ${statusCode}`);
    return null;
  }
};

processHttpResponse('200');
processHttpResponse(404);
processHttpResponse('500');
processHttpResponse('999');

// 5. Priority processing with duplicate values
console.log('\n5. Priority processing with duplicate values:');
console.log('All keys for priority 1:', toEnumKeys(PriorityLevel, 1)); // ['Low', 'Urgent']
console.log('All keys for priority "1":', toEnumKeys(PriorityLevel, '1', { convert: true })); // ['Low', 'Urgent']
console.log('All keys for priority 2:', toEnumKeys(PriorityLevel, 2)); // ['Medium']
console.log('All keys for priority 4:', toEnumKeys(PriorityLevel, 4)); // ['Critical']

// 6. Form input processing
console.log('\n6. Form input processing:');
const processFormInput = (field: string, value: string) => {
  switch (field) {
    case 'priority':
      const priority = toEnumValue(Priority, value, { convert: true });
      if (priority) {
        const key = toEnumKey(Priority, priority, { convert: true });
        console.log(`✅ Priority: ${value} -> ${key} (${priority})`);
        return priority;
      } else {
        console.log(`❌ Invalid priority: ${value}`);
        return null;
      }

    case 'errorCode':
      const errorCode = toEnumValue(ErrorCode, value, { convert: true });
      if (errorCode) {
        const key = toEnumKey(ErrorCode, errorCode, { convert: true });
        console.log(`✅ Error code: ${value} -> ${key} (${errorCode})`);
        return errorCode;
      } else {
        console.log(`❌ Invalid error code: ${value}`);
        return null;
      }

    default:
      console.log(`❌ Unknown field: ${field}`);
      return null;
  }
};

processFormInput('priority', '1');
processFormInput('priority', '3');
processFormInput('priority', 'invalid');
processFormInput('errorCode', '1001');
processFormInput('errorCode', '1004');
processFormInput('errorCode', '9999');

// 7. API query parameter processing
console.log('\n7. API query parameter processing:');
const processQueryParams = (params: Record<string, string>) => {
  const result: Record<string, any> = {};

  if (params.priority) {
    const priority = toEnumValue(Priority, params.priority, { convert: true });
    if (priority) {
      result.priority = priority;
      console.log(`✅ Query param priority: ${params.priority} -> ${priority}`);
    } else {
      console.log(`❌ Invalid priority query param: ${params.priority}`);
    }
  }

  if (params.status) {
    const status = toEnumValue(StatusCode, params.status, { convert: true });
    if (status) {
      result.status = status;
      console.log(`✅ Query param status: ${params.status} -> ${status}`);
    } else {
      console.log(`❌ Invalid status query param: ${params.status}`);
    }
  }

  return result;
};

processQueryParams({ priority: '2', status: '200' });
processQueryParams({ priority: 'invalid', status: '404' });
processQueryParams({ priority: '3', status: 'invalid' });

console.log('\n=== End Type Conversion Examples ===');
