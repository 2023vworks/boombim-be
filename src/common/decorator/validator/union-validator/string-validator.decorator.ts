import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidationOptions,
  isString,
} from 'class-validator';

import { Util } from '../../../util';
import { UnionValidatorDefaultOptions } from './type';

type StringValidatorOption = UnionValidatorDefaultOptions & {
  maxLength?: number;
  minLength?: number;
};

export function StringValidator(
  options: StringValidatorOption = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsNotEmpty()]),
  );
}

export function StringValidatorOptional(
  options: StringValidatorOption = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsOptional()]),
  );
}

function createDecorators(
  options: StringValidatorOption = {},
  validationOptions: ValidationOptions = {},
  appendDecorators: PropertyDecorator[],
): PropertyDecorator[] {
  const { maxLength, minLength } = options;
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterFalsy([
    ...appendDecorators,
    Type(() => String),
    Transform(({ value }) => trim(value)),
    IsString(validationOptions),
    maxLength && MaxLength(maxLength, validationOptions),
    minLength && MinLength(minLength, validationOptions),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
}

function trim(val: unknown) {
  return isString(val)
    ? val.trim()
    : Array.isArray(val) && val.every(isString)
    ? val.map((str) => str.trim())
    : undefined;
}
