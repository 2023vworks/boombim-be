import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const ApiControllerDocument = (apiTag: string) => {
  return applyDecorators(ApiTags(apiTag));
};
