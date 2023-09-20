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

type Options = UnionValidatorDefaultOptions & {
  max?: number;
  min?: number;
};

export function IntValidator(
  options: Options = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsNotEmpty]),
  );
}

export function IntValidatorOptional(
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
  const { max, min } = options;
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterNotNil([
    ...appendDecorators,
    IsInt(validationOptions),
    Type(() => Number),
    max && Max(max, validationOptions),
    min && Min(min, validationOptions),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
}
