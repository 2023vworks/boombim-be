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
} from 'class-validator';

import { Util } from '../../../util';
import { UnionValidatorDefaultOptions } from './type';

type Options = UnionValidatorDefaultOptions & {
  maxLength?: number;
  minLength?: number;
};

export function StringValidator(
  options: Options = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsNotEmpty]),
  );
}

export function StringValidatorOptional(
  options: Options = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsOptional]),
  );
}

function createDecorators(
  options: Options = {},
  validationOptions: ValidationOptions = {},
  appendDecorators: PropertyDecorator[],
): PropertyDecorator[] {
  const { maxLength, minLength } = options;
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterNotNil([
    ...appendDecorators,
    IsString(validationOptions),
    Type(() => String),
    !isEach && maxLength && MaxLength(maxLength, validationOptions),
    !isEach && minLength && MinLength(minLength, validationOptions),
    !isEach && Transform(({ value }) => value && value.trim()),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
}
