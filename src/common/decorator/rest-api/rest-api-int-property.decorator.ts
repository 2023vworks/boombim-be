import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { RestApiDecoratorDefaultOptions } from './type';
import { IntValidator, IntValidatorOptional } from '../validator';

type RestApiIntPropertyOptions = RestApiDecoratorDefaultOptions & {
  max?: number;
  min?: number;
};

const toApiPropertyOptions = (options: RestApiIntPropertyOptions) => ({
  type: Number,
  description: options.description,
  isArray: options.isArray,
  maximum: options.max,
  minimum: options.min,
  maxItems: options.arrayMaxSize,
  minItems: options.arrayMinSize,
  default: options.default,
});

export function RestApiIntProperty(
  options: RestApiIntPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiProperty({ ...toApiPropertyOptions(options) }),
    IntValidator({ ...options }, { each: options.isArray }),
  );
}

export function RestApiIntPropertyOptional(
  options: RestApiIntPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiPropertyOptional({ ...toApiPropertyOptions(options) }),
    IntValidatorOptional({ ...options }, { each: options.isArray }),
  );
}
