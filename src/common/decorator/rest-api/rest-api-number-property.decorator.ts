import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { RestApiDecoratorDefaultOptions } from './type';
import { NumberValidator, NumberValidatorOptional } from '../validator';

type RestApiNumberPropertyOptions = RestApiDecoratorDefaultOptions & {
  max?: number;
  min?: number;
};

const toApiPropertyOptions = (options: RestApiNumberPropertyOptions) => ({
  type: Number,
  description: options.description,
  isArray: options.isArray,
  maximum: options.max,
  minimum: options.min,
  maxItems: options.arrayMaxSize,
  minItems: options.arrayMinSize,
  default: options.default,
});

export function RestApiNumberProperty(
  options: RestApiNumberPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiProperty({ ...toApiPropertyOptions(options) }),
    NumberValidator({ ...options }, { each: options.isArray }),
  );
}

export function RestApiNumberPropertyOptional(
  options: RestApiNumberPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiPropertyOptional({ ...toApiPropertyOptions(options) }),
    NumberValidatorOptional({ ...options }, { each: options.isArray }),
  );
}
