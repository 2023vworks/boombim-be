import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
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
  maxDecimalPlaces?: number;
};

export function NumberValidator(
  options: Options = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsNotEmpty]),
  );
}

export function NumberValidatorOptional(
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
  const { max, min, maxDecimalPlaces } = options;
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterNotNil([
    ...appendDecorators,
    IsNumber({ maxDecimalPlaces: maxDecimalPlaces }, validationOptions),
    Type(() => Number),
    max && Max(max),
    min && Min(min),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
}
