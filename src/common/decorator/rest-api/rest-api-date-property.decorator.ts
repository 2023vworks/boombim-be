import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { RestApiDecoratorDefaultOptions } from './type';
import { DateValidator, DateValidatorOptional } from '../validator';

type RestApiDatePropertyOptions = RestApiDecoratorDefaultOptions;

const toApiPropertyOptions = (options: RestApiDatePropertyOptions) => ({
  type: Date,
  description: options.description,
  isArray: options.isArray,
  maxItems: options.arrayMaxSize,
  minItems: options.arrayMinSize,
  default: options.default,
});

export function RestApiDateProperty(
  options: RestApiDatePropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiProperty({ ...toApiPropertyOptions(options) }),
    DateValidator({ ...options }, { each: options.isArray }),
  );
}

export function RestApiDatePropertyOptional(
  options: RestApiDatePropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiPropertyOptional({ ...toApiPropertyOptions(options) }),
    DateValidatorOptional({ ...options }, { each: options.isArray }),
  );
}
