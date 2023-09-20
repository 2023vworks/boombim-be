import { applyDecorators, Type } from '@nestjs/common';
import { Type as ToType } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  ValidationOptions,
} from 'class-validator';

import { Util } from '../../../util';
import { UnionValidatorDefaultOptions } from './type';

type Options = UnionValidatorDefaultOptions;

export function InstanceValidator(
  entity: Type,
  options: Options = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(entity, options, validationOptions, [IsNotEmpty]),
  );
}

export function InstanceValidatorOptional(
  entity: Type,
  options: Options = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ...createDecorators(entity, options, validationOptions, [IsOptional]),
  );
}

const createDecorators = (
  entity: Type,
  options: Options = {},
  validationOptions: ValidationOptions = {},
  appendDecorators: PropertyDecorator[],
): PropertyDecorator[] => {
  const { arrayMaxSize, arrayMinSize } = options;
  const isEach = validationOptions?.each;
  return Util.filterNotNil([
    ...appendDecorators,
    ToType(() => entity),
    ValidateNested(validationOptions),
    isEach && arrayMaxSize && ArrayMaxSize(arrayMaxSize),
    isEach && arrayMinSize && ArrayMinSize(arrayMinSize),
  ]);
};
