import { ZodType } from 'zod';
import { UnifiedConfigSchema } from './schema';

type ZodTypeDef = any;

function getDescription(zodType: ZodType): string | undefined {
  if ('description' in zodType && typeof zodType.description === 'string') {
    return zodType.description;
  }
  return undefined;
}

function getDefaultValue(zodType: ZodType): any {
  let current = zodType;
  while (current) {
    if (current._def?.typeName === 'ZodDefault') {
      return current._def.defaultValue();
    }
    if (current._def?.typeName === 'ZodOptional') {
      current = current._def.innerType;
      continue;
    }
    break;
  }
  return undefined;
}

function unwrapType(zodType: ZodType): ZodType {
  let unwrapped = zodType;
  while (
    unwrapped._def?.typeName === 'ZodOptional' ||
    unwrapped._def?.typeName === 'ZodDefault'
  ) {
    unwrapped = unwrapped._def.innerType;
  }
  return unwrapped;
}

function valueToYaml(value: any, indent: number = 0): string {
  const indentStr = ' '.repeat(indent);

  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    if (value.includes(':') || value.includes('#') || value.includes('\n') || value.includes('"')) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value || '""';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    let result = '\n';
    for (const item of value) {
      result += `${indentStr}- ${valueToYaml(item, indent + 2)}\n`;
    }
    return result.trimEnd();
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) {
      return '{}';
    }
    let result = '\n';
    for (const key of keys) {
      result += `${indentStr}${key}: ${valueToYaml(value[key], indent + 2)}\n`;
    }
    return result.trimEnd();
  }

  return String(value);
}

export function generateConfigWithComments(): string {
  let output = '# Abridge Configuration File\n';
  output += '# Documentation: https://github.com/Tomyail/abridge\n\n';

  const shape = UnifiedConfigSchema._def.shape();

  for (const [key, zodType] of Object.entries(shape)) {
    const description = getDescription(zodType);
    if (description) {
      output += `# ${description}\n`;
    }

    const unwrapped = unwrapType(zodType);
    const defaultValue = getDefaultValue(zodType);
    const typeName = unwrapped._def?.typeName;

    // Handle inline simple values
    if (typeName === 'ZodArray' && Array.isArray(defaultValue) && defaultValue.length === 0) {
      output += `${key}: []\n\n`;
    } else if (typeName === 'ZodObject') {
      output += `${key}:\n`;
      output += generateObject(unwrapped, 2);
      output += '\n';
    } else {
      output += `${key}:\n`;
      output += generateValue(unwrapped, defaultValue, 2);
      output += '\n';
    }
  }

  return output.trimEnd();
}

function generateValue(zodType: ZodType, defaultValue: any, indent: number): string {
  const typeName = zodType._def?.typeName;
  const indentStr = ' '.repeat(indent);

  switch (typeName) {
    case 'ZodObject': {
      return generateObject(zodType, indent);
    }
    case 'ZodArray': {
      const arrayResult = generateArray(zodType, indent);
      // If array result starts with newline, strip it for inline display
      if (arrayResult.trim() === '[]') {
        return ' []\n';
      }
      return arrayResult;
    }
    case 'ZodEnum': {
      const values = zodType._def.values;
      if (defaultValue !== undefined) {
        return `${valueToYaml(defaultValue)} # ${values.join(', ')}\n`;
      }
      return `# ${values.join(', ')}\n`;
    }
    default: {
      return `${valueToYaml(defaultValue)}\n`;
    }
  }
}

function generateObject(zodType: ZodType, indent: number): string {
  let output = '';
  const indentStr = ' '.repeat(indent);
  const shape = zodType._def.shape();

  for (const [key, fieldZodType] of Object.entries(shape)) {
    const unwrapped = unwrapType(fieldZodType);
    const defaultValue = getDefaultValue(fieldZodType);

    // Skip optional fields with null/undefined values
    if (defaultValue === null || defaultValue === undefined) {
      const isOptional = fieldZodType._def?.typeName === 'ZodOptional' ||
                        fieldZodType._def?.typeName === 'ZodDefault';
      if (isOptional) {
        continue;
      }
    }

    const description = getDescription(fieldZodType);
    if (description) {
      output += `${indentStr}# ${description}\n`;
    }

    output += `${indentStr}${key}:`;
    const innerType = unwrapped._def?.typeName;

    if (innerType === 'ZodObject') {
      output += '\n' + generateObject(unwrapped, indent + 2);
    } else if (innerType === 'ZodArray') {
      output += '\n' + generateArray(unwrapped, indent + 2);
    } else if (innerType === 'ZodEnum') {
      const values = unwrapped._def.values;
      output += ` ${valueToYaml(defaultValue)} # ${values.join(', ')}\n`;
    } else {
      output += ` ${valueToYaml(defaultValue)}\n`;
    }
  }

  return output;
}

function generateArray(zodType: ZodType, indent: number): string {
  // Always show empty array without example items
  return `${valueToYaml([], indent)}\n`;
}

function generateObjectElementForArray(zodType: ZodType, indent: number): string {
  const shape = zodType._def.shape();
  const entries = Object.entries(shape);

  if (entries.length === 0) {
    return '{}';
  }

  const [firstKey, firstZodType] = entries[0];
  const description = getDescription(firstZodType);
  const unwrapped = unwrapType(firstZodType);
  const defaultValue = getDefaultValue(firstZodType);
  const innerType = unwrapped._def?.typeName;

  let output = '';

  // Add description for first field as comment above the array item
  if (description) {
    const indentStr = ' '.repeat(indent);
    output = `\n${indentStr}# ${description}\n${indentStr}- ${firstKey}: ${valueToYaml(defaultValue)}`;
  } else {
    output = `\n- ${firstKey}: ${valueToYaml(defaultValue)}`;
  }

  // Process remaining fields
  for (let i = 1; i < entries.length; i++) {
    const [key, fieldZodType] = entries[i];
    const desc = getDescription(fieldZodType);
    const unwrapped = unwrapType(fieldZodType);
    const defaultValue = getDefaultValue(fieldZodType);
    const innerType = unwrapped._def?.typeName;
    const indentStr = ' '.repeat(indent + 2);

    if (desc) {
      output += `\n${indentStr}# ${desc}`;
    }

    if (innerType === 'ZodObject') {
      output += `\n${indentStr}${key}:` + '\n' + generateObject(unwrapped, indent + 4);
    } else if (innerType === 'ZodArray') {
      const arrayResult = generateArray(unwrapped, indent + 4);
      if (arrayResult.startsWith('\n')) {
        output += `\n${indentStr}${key}:` + arrayResult;
      } else {
        output += `\n${indentStr}${key}: ` + arrayResult.trimEnd();
      }
    } else if (innerType === 'ZodEnum') {
      const values = unwrapped._def.values;
      output += `\n${indentStr}${key}: ${valueToYaml(defaultValue)} # ${values.join(', ')}`;
    } else {
      output += `\n${indentStr}${key}: ${valueToYaml(defaultValue)}`;
    }
  }

  return output + '\n';
}

function generateObjectElement(zodType: ZodType, indent: number): string {
  let output = '';
  const indentStr = ' '.repeat(indent);
  const shape = zodType._def.shape();

  for (const [key, fieldZodType] of Object.entries(shape)) {
    const description = getDescription(fieldZodType);
    if (description) {
      output += `${indentStr}# ${description}\n`;
    }

    const unwrapped = unwrapType(fieldZodType);
    const defaultValue = getDefaultValue(fieldZodType);
    const innerType = unwrapped._def?.typeName;

    output += `${indentStr}${key}:`;

    if (innerType === 'ZodObject') {
      output += '\n' + generateObject(unwrapped, indent + 2);
    } else if (innerType === 'ZodArray') {
      const arrayResult = generateArray(unwrapped, indent + 2);
      // If array result starts with newline, strip it to avoid double newline
      if (arrayResult.startsWith('\n')) {
        output += arrayResult;
      } else {
        output += ' ' + arrayResult;
      }
    } else if (innerType === 'ZodEnum') {
      const values = unwrapped._def.values;
      output += ` ${valueToYaml(defaultValue)} # ${values.join(', ')}\n`;
    } else {
      output += ` ${valueToYaml(defaultValue)}\n`;
    }
  }

  return output;
}
