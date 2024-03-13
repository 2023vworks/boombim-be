import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { RestApiDecoratorDefaultOptions } from './type';
import { InstanceValidator, InstanceValidatorOptional } from '../validator';

type RestApiInstancePropertyOptions = RestApiDecoratorDefaultOptions;

const toApiPropertyOptions = (
  entity: Type,
  options: RestApiInstancePropertyOptions,
) => ({
  type: entity,
  description: options.description,
  isArray: options.isArray,
  maxItems: options.arrayMaxSize,
  minItems: options.arrayMinSize,
  default: options.default,
});

export function RestApiInstanceProperty(
  entity: Type,
  options: RestApiInstancePropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiProperty({ ...toApiPropertyOptions(entity, options) }),
    InstanceValidator(entity, options, { each: options.isArray }),
  );
}

export function RestApiInstancePropertyOptional(
  entity: Type,
  options: RestApiInstancePropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiPropertyOptional({ ...toApiPropertyOptions(entity, options) }),
    InstanceValidatorOptional(entity, options, { each: options.isArray }),
  );
}
