import { errorMessage } from '@app/common/message';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';

export function ApiFile(fieldName: string = 'image') {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiUnsupportedMediaTypeResponse({ description: errorMessage.E415_APP_001 }),
  );
}

export function ApiFiles(fieldName: string = 'images') {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'array', // Note: 배열 타입 선언
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
    ApiUnsupportedMediaTypeResponse({ description: errorMessage.E415_APP_001 }),
  );
}
