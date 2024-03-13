import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { RestApiDecoratorDefaultOptions } from './type';
import { BooleanValidator, BooleanValidatorOptional } from '../validator';

type RestApiBooleanPropertyOptions = RestApiDecoratorDefaultOptions;

const toApiPropertyOptions = (options: RestApiBooleanPropertyOptions) => ({
  type: Boolean,
  description: options.description,
  isArray: options.isArray,
  maxItems: options.arrayMaxSize,
  minItems: options.arrayMinSize,
  default: options.default,
});

export function RestApiBooleanProperty(
  options: RestApiBooleanPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiProperty({ ...toApiPropertyOptions(options) }),
    BooleanValidator({ ...options }, { each: options.isArray }),
  );
}

export function RestApiBooleanPropertyOptional(
  options: RestApiBooleanPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiPropertyOptional({ ...toApiPropertyOptions(options) }),
    BooleanValidatorOptional({ ...options }, { each: options.isArray }),
  );
}
