import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidationOptions,
} from 'class-validator';

import { Util } from '../../../util';
import { UnionValidatorDefaultOptions } from './type';

type Options = UnionValidatorDefaultOptions;

export function ObjectValidator(
  options: Options = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsNotEmpty]),
  );
}

export function ObjectValidatorOptional(
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
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterNotNil([
    ...appendDecorators,
    IsObject(validationOptions),
    Type(() => Object),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
}
