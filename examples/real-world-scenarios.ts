/**
 * Real-World Scenarios Examples
 *
 * This example demonstrates practical usage of ts-enum-util in common
 * application scenarios like API handling, configuration management, and user input processing.
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
  validateEnumLike,
  type EnumLike,
} from '../src/enums';

// API Response Status
enum ApiStatus {
  Success = 'success',
  Error = 'error',
  Loading = 'loading',
  Idle = 'idle',
}

// User Roles and Permissions
enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user',
  Guest = 'guest',
}

enum Permission {
  Read = 'read',
  Write = 'write',
  Delete = 'delete',
  Admin = 'admin',
}

// Application Configuration
enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

// Database Operations
enum DbOperation {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

console.log('=== Real-World Scenarios ===\n');

// 1. API Response Handler
console.log('1. API Response Handler:');
class ApiResponseHandler {
  private static validateStatus(status: string): ApiStatus | null {
    const validStatus = toEnumValue(ApiStatus, status, { ignoreCase: true });
    if (validStatus) {
      console.log(`✅ Valid API status: ${status} -> ${validStatus}`);
      return validStatus;
    } else {
      console.log(`❌ Invalid API status: ${status}`);
      return null;
    }
  }

  static processResponse(response: { status: string; data: any }) {
    const status = this.validateStatus(response.status);
    if (status) {
      switch (status) {
        case ApiStatus.Success:
          console.log('📊 Processing successful response:', response.data);
          break;
        case ApiStatus.Error:
          console.log('🚨 Processing error response:', response.data);
          break;
        case ApiStatus.Loading:
          console.log('⏳ Response is still loading...');
          break;
        case ApiStatus.Idle:
          console.log('😴 Response is idle');
          break;
      }
    }
    return status;
  }
}

ApiResponseHandler.processResponse({ status: 'success', data: { users: [] } });
ApiResponseHandler.processResponse({ status: 'ERROR', data: { message: 'Not found' } });
ApiResponseHandler.processResponse({ status: 'invalid', data: null });

// 2. User Authentication and Authorization
console.log('\n2. User Authentication and Authorization:');
class AuthManager {
  private static rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.Admin]: [Permission.Read, Permission.Write, Permission.Delete, Permission.Admin],
    [UserRole.Moderator]: [Permission.Read, Permission.Write, Permission.Delete],
    [UserRole.User]: [Permission.Read, Permission.Write],
    [UserRole.Guest]: [Permission.Read],
  };

  static validateUserRole(roleInput: string): UserRole | null {
    const role = toEnumValue(UserRole, roleInput, { ignoreCase: true });
    if (role) {
      console.log(`✅ Valid user role: ${roleInput} -> ${role}`);
      return role;
    } else {
      console.log(`❌ Invalid user role: ${roleInput}`);
      return null;
    }
  }

  static checkPermission(userRole: UserRole, requiredPermission: string): boolean {
    const permission = toEnumValue(Permission, requiredPermission, { ignoreCase: true });
    if (!permission) {
      console.log(`❌ Invalid permission: ${requiredPermission}`);
      return false;
    }

    const userPermissions = this.rolePermissions[userRole];
    const hasPermission = userPermissions.includes(permission);

    console.log(
      `${hasPermission ? '✅' : '❌'} User ${userRole} ${hasPermission ? 'has' : 'lacks'} permission: ${permission}`,
    );
    return hasPermission;
  }

  static authorize(userRoleInput: string, action: string): boolean {
    const userRole = this.validateUserRole(userRoleInput);
    if (!userRole) return false;

    return this.checkPermission(userRole, action);
  }
}

AuthManager.authorize('admin', 'delete');
AuthManager.authorize('user', 'write');
AuthManager.authorize('guest', 'delete');
AuthManager.authorize('invalid', 'read');

// 3. Configuration Management
console.log('\n3. Configuration Management:');
class ConfigManager {
  private static configSchema: EnumLike = {
    environment: Environment.Development,
    logLevel: LogLevel.Info,
    apiTimeout: 5000,
    maxRetries: 3,
  };

  static validateConfig(config: Record<string, any>): Record<string, any> {
    const validatedConfig: Record<string, any> = {};

    for (const [key, value] of Object.entries(config)) {
      switch (key) {
        case 'environment':
          const env = toEnumValue(Environment, value, { ignoreCase: true });
          if (env) {
            validatedConfig[key] = env;
            console.log(`✅ Environment: ${value} -> ${env}`);
          } else {
            console.log(`❌ Invalid environment: ${value}`);
          }
          break;

        case 'logLevel':
          const level = toEnumValue(LogLevel, value, { convert: true });
          if (level !== undefined) {
            validatedConfig[key] = level;
            console.log(`✅ Log level: ${value} -> ${level}`);
          } else {
            console.log(`❌ Invalid log level: ${value}`);
          }
          break;

        default:
          validatedConfig[key] = value;
          console.log(`ℹ️  Config key ${key}: ${value} (no validation)`);
      }
    }

    return validatedConfig;
  }

  static loadConfig(configInput: Record<string, any>): Record<string, any> {
    console.log('🔧 Loading configuration...');
    return this.validateConfig(configInput);
  }
}

ConfigManager.loadConfig({
  environment: 'production',
  logLevel: '2',
  apiTimeout: 10000,
  maxRetries: 5,
});

// 4. Database Operation Handler
console.log('\n4. Database Operation Handler:');
class DatabaseHandler {
  static validateOperation(operation: string): DbOperation | null {
    const validOp = toEnumValue(DbOperation, operation, { ignoreCase: true });
    if (validOp) {
      console.log(`✅ Valid DB operation: ${operation} -> ${validOp}`);
      return validOp;
    } else {
      console.log(`❌ Invalid DB operation: ${operation}`);
      return null;
    }
  }

  static executeOperation(operation: string, table: string, data?: any) {
    const op = this.validateOperation(operation);
    if (!op) return false;

    switch (op) {
      case DbOperation.Create:
        console.log(`📝 Creating record in ${table}:`, data);
        break;
      case DbOperation.Read:
        console.log(`📖 Reading from ${table}`);
        break;
      case DbOperation.Update:
        console.log(`✏️  Updating record in ${table}:`, data);
        break;
      case DbOperation.Delete:
        console.log(`🗑️  Deleting record from ${table}:`, data);
        break;
    }
    return true;
  }
}

DatabaseHandler.executeOperation('create', 'users', { name: 'John', email: 'john@example.com' });
DatabaseHandler.executeOperation('READ', 'users');
DatabaseHandler.executeOperation('update', 'users', { id: 1, name: 'Jane' });
DatabaseHandler.executeOperation('invalid', 'users');

// 5. Form Validation
console.log('\n5. Form Validation:');
class FormValidator {
  static validateSelectField(fieldName: string, value: string, options: EnumLike): boolean {
    validateEnumLike(options); // Ensure options is valid

    const validValue = isEnumValue(options, value, { ignoreCase: true });
    if (validValue) {
      console.log(`✅ Valid ${fieldName}: ${value}`);
      return true;
    } else {
      console.log(`❌ Invalid ${fieldName}: ${value}. Valid options:`, Object.keys(options).join(', '));
      return false;
    }
  }

  static validateForm(formData: Record<string, any>) {
    const errors: string[] = [];

    // Validate environment
    if (!this.validateSelectField('environment', formData.environment, Environment)) {
      errors.push('Invalid environment');
    }

    // Validate user role
    if (!this.validateSelectField('role', formData.role, UserRole)) {
      errors.push('Invalid user role');
    }

    // Validate API status
    if (!this.validateSelectField('status', formData.status, ApiStatus)) {
      errors.push('Invalid API status');
    }

    if (errors.length === 0) {
      console.log('✅ Form validation passed');
      return { valid: true, data: formData };
    } else {
      console.log('❌ Form validation failed:', errors);
      return { valid: false, errors };
    }
  }
}

FormValidator.validateForm({
  environment: 'production',
  role: 'admin',
  status: 'success',
});

FormValidator.validateForm({
  environment: 'invalid',
  role: 'user',
  status: 'unknown',
});

// 6. Command Line Interface Processing
console.log('\n6. Command Line Interface Processing:');
class CliProcessor {
  static processCommand(command: string, args: string[]) {
    const validCommand = toEnumValue(DbOperation, command, { ignoreCase: true });
    if (!validCommand) {
      console.log(`❌ Unknown command: ${command}`);
      console.log('Available commands:', Object.values(DbOperation).join(', '));
      return false;
    }

    console.log(`🚀 Executing command: ${validCommand}`);

    switch (validCommand) {
      case DbOperation.Create:
        if (args.length < 2) {
          console.log('❌ Usage: create <table> <data>');
          return false;
        }
        console.log(`Creating record in ${args[0]} with data:`, args.slice(1));
        break;

      case DbOperation.Read:
        if (args.length < 1) {
          console.log('❌ Usage: read <table>');
          return false;
        }
        console.log(`Reading from ${args[0]}`);
        break;

      case DbOperation.Update:
        if (args.length < 3) {
          console.log('❌ Usage: update <table> <id> <data>');
          return false;
        }
        console.log(`Updating record ${args[1]} in ${args[0]} with data:`, args.slice(2));
        break;

      case DbOperation.Delete:
        if (args.length < 2) {
          console.log('❌ Usage: delete <table> <id>');
          return false;
        }
        console.log(`Deleting record ${args[1]} from ${args[0]}`);
        break;
    }

    return true;
  }
}

CliProcessor.processCommand('create', ['users', 'John', 'Doe', 'john@example.com']);
CliProcessor.processCommand('read', ['users']);
CliProcessor.processCommand('update', ['users', '1', 'Jane', 'Doe']);
CliProcessor.processCommand('delete', ['users', '1']);
CliProcessor.processCommand('invalid', []);

console.log('\n=== End Real-World Scenarios ===');
