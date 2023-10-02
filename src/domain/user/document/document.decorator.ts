import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ApiAuthDocument, USER_ACCESS_TOKEN } from '@app/common';
import { errorMessage, successMessage } from '@app/custom';
import { GetUserResponseDTO, PostUsersResponseDTO } from '../dto';
import { UserController } from '../user.controller';

type API_DOC_TYPE = keyof UserController;

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  postUsers: () =>
    applyDecorators(
      ApiOperation({ summary: '유저 등록' }),
      ApiCreatedResponse({
        description: successMessage.S201_USER_001,
        type: PostUsersResponseDTO,
      }),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
    ),
  getUserMe: () =>
    applyDecorators(
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiOperation({ summary: '유저 정보 조회' }),
      ApiCreatedResponse({
        description: successMessage.S200_USER_001,
        type: GetUserResponseDTO,
      }),
    ),
};

export const DocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
