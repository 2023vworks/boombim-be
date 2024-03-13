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

type EnumValidatorOption = UnionValidatorDefaultOptions;

export function EnumValidator(
  enumType: object,
  options: EnumValidatorOption = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(enumType, options, validationOptions, [IsNotEmpty()]),
  );
}

export function EnumValidatorOptional(
  enumType: object,
  options: EnumValidatorOption = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(enumType, options, validationOptions, [IsOptional()]),
  );
}

const createDecorators = (
  enumType: object,
  options: EnumValidatorOption = {},
  validationOptions: ValidationOptions = {},
  appendDecorators: PropertyDecorator[],
): PropertyDecorator[] => {
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterFalsy([
    ...appendDecorators,
    IsEnum(enumType, validationOptions),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
};
