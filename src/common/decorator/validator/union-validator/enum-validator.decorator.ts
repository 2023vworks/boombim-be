import { applyDecorators } from '@nestjs/common';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidationOptions,
} from 'class-validator';

import { Util } from '../../../util';
import { UnionValidatorDefaultOptions } from './type';

type Options = UnionValidatorDefaultOptions;

export function EnumValidator(
  enumType: object,
  options: Options = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(enumType, options, validationOptions, [IsNotEmpty]),
  );
}

export function EnumValidatorOptional(
  enumType: object,
  options: Options = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(enumType, options, validationOptions, [IsOptional]),
  );
}

const createDecorators = (
  enumType: object,
  options: Options = {},
  validationOptions: ValidationOptions = {},
  appendDecorators: PropertyDecorator[],
): PropertyDecorator[] => {
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterNotNil([
    ...appendDecorators,
    IsEnum(enumType, validationOptions),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
};
