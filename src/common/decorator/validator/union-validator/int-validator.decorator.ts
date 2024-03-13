import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  ValidationOptions,
} from 'class-validator';

import { Util } from '../../../util';
import { UnionValidatorDefaultOptions } from './type';

type IntValidatorOptions = UnionValidatorDefaultOptions & {
  max?: number;
  min?: number;
};

export function IntValidator(
  options: IntValidatorOptions = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsNotEmpty()]),
  );
}

export function IntValidatorOptional(
  options: IntValidatorOptions = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsOptional()]),
  );
}

function createDecorators(
  options: IntValidatorOptions = {},
  validationOptions: ValidationOptions = {},
  appendDecorators: PropertyDecorator[],
): PropertyDecorator[] {
  const { max, min } = options;
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterFalsy([
    ...appendDecorators,
    Type(() => Number),
    IsInt(validationOptions),
    max && Max(max, validationOptions),
    min && Min(min, validationOptions),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
}
