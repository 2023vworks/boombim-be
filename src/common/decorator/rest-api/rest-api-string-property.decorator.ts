import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { RestApiDecoratorDefaultOptions } from './type';
import { StringValidator, StringValidatorOptional } from '../validator';

type RestApiStringPropertyOptions = RestApiDecoratorDefaultOptions & {
  maxLength?: number;
  minLength?: number;
};

const toApiPropertyOptions = (options: RestApiStringPropertyOptions) => ({
  type: String,
  description: options.description,
  isArray: options.isArray,
  maxLength: options.maxLength,
  minLength: options.minLength,
  maxItems: options.arrayMaxSize,
  minItems: options.arrayMinSize,
  default: options.default,
});

export function RestApiStringProperty(
  options: RestApiStringPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiProperty({ ...toApiPropertyOptions(options) }),
    StringValidator({ ...options }, { each: options.isArray }),
  );
}

export function RestApiStringPropertyOptional(
  options: RestApiStringPropertyOptions = { isArray: false },
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    ApiPropertyOptional({ ...toApiPropertyOptions(options) }),
    StringValidatorOptional({ ...options }, { each: options.isArray }),
  );
}
