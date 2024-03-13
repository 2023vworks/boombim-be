import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDate,
  IsNotEmpty,
  IsOptional,
  ValidationOptions,
} from 'class-validator';

import { Util } from '../../../util';
import { UnionValidatorDefaultOptions } from './type';

type DateValidatorOption = UnionValidatorDefaultOptions;

export function DateValidator(
  options: DateValidatorOption = {},
  validationOptions: ValidationOptions = {},
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsNotEmpty()]),
  );
}

export function DateValidatorOptional(
  options: DateValidatorOption = {},
  validationOptions: ValidationOptions = {},
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsOptional()]),
  );
}

function createDecorators(
  options: DateValidatorOption = {},
  validationOptions: ValidationOptions = {},
  appendDecorators: PropertyDecorator[],
): PropertyDecorator[] {
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterFalsy([
    ...appendDecorators,
    IsDate(validationOptions),
    Type(() => Date),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
}
