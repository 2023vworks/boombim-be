import { applyDecorators } from '@nestjs/common';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  ValidationOptions,
} from 'class-validator';

import { Util } from '../../../util';
import { UnionValidatorDefaultOptions } from './type';
import { Transform } from 'class-transformer';

type BooleanValidatorOption = UnionValidatorDefaultOptions;

export function BooleanValidator(
  options: BooleanValidatorOption = {},
  validationOptions: ValidationOptions = {},
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsNotEmpty()]),
  );
}

export function BooleanValidatorOptional(
  options: BooleanValidatorOption = {},
  validationOptions: ValidationOptions = {},
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(options, validationOptions, [IsOptional()]),
  );
}

function createDecorators(
  options: BooleanValidatorOption = {},
  validationOptions: ValidationOptions = {},
  appendDecorators: PropertyDecorator[],
): PropertyDecorator[] {
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterFalsy([
    ...appendDecorators,
    IsBoolean(validationOptions),
    // Note: @Type을 주석처리 하고, Transform 사용, 'true', true를 제외한 값은 모두 false 처리한다.
    // Type(() => Boolean),
    Transform(({ value }) =>
      value === 'true' || value === true ? true : false,
    ),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
}
