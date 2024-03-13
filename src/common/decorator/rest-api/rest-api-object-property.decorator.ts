import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { RestApiDecoratorDefaultOptions } from './type';
import { ObjectValidator, ObjectValidatorOptional } from '../validator';

type RestApiObjectPropertyOptions = RestApiDecoratorDefaultOptions;

const toApiPropertyOptions = (options: RestApiObjectPropertyOptions) => ({
  type: Object,
  description: options.description,
  isArray: options.isArray,
  maxItems: options.arrayMaxSize,
  minItems: options.arrayMinSize,
  default: options.default,
});

export function RestApiObjectProperty(
  options: RestApiObjectPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiProperty({ ...toApiPropertyOptions(options) }),
    ObjectValidator({ ...options }, { each: options.isArray }),
  );
}

export function RestApiObjectPropertyOptional(
  options: RestApiObjectPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiPropertyOptional({ ...toApiPropertyOptions(options) }),
    ObjectValidatorOptional({ ...options }, { each: options.isArray }),
  );
}
