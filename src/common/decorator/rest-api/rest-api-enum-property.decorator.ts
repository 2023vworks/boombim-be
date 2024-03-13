import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { RestApiDecoratorDefaultOptions } from './type';
import { EnumValidator, EnumValidatorOptional } from '../validator';

type RestApiEnumPropertyOptions = RestApiDecoratorDefaultOptions;

const toApiPropertyOptions = (
  enumType: object,
  options: RestApiEnumPropertyOptions,
) => ({
  enum: enumType,
  description: options.description,
  isArray: options.isArray,
  maxItems: options.arrayMaxSize,
  minItems: options.arrayMinSize,
  default: options.default,
});

export function RestApiEnumProperty(
  enumType: object,
  options: RestApiEnumPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiProperty({ ...toApiPropertyOptions(enumType, options) }),
    EnumValidator(enumType, options, { each: options.isArray }),
  );
}

export function RestApiEnumPropertyOptional(
  enumType: object,
  options: RestApiEnumPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiPropertyOptional({ ...toApiPropertyOptions(enumType, options) }),
    EnumValidatorOptional(enumType, options, { each: options.isArray }),
  );
}
