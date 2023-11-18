import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import {
  ApiAuthDocument,
  USER_ACCESS_TOKEN,
  errorMessage,
  successMessage,
} from '@app/common';
import {
  GetUserFeedsResponseDTO,
  GetUserResponseDTO,
  PostUsersResponseDTO,
} from '../dto';
import { UserController } from '../user.controller';

type API_DOC_TYPE = keyof UserController;

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  postUsers: () =>
    applyDecorators(
      ApiOperation({ summary: '(MVP 전용)유저 등록' }),
      ApiCreatedResponse({
        description: successMessage.S201_USER_001,
        type: PostUsersResponseDTO,
      }),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
    ),
  getUser: () =>
    applyDecorators(
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiOperation({ summary: '유저 정보 조회' }),
      ApiOkResponse({
        description: successMessage.S200_USER_001,
        type: GetUserResponseDTO,
      }),
    ),
  getUserFeeds: () =>
    applyDecorators(
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiOperation({ summary: '유저가 작성한 피드 리스트 조회' }),
      ApiOkResponse({
        description: successMessage.S200_USER_002,
        type: [GetUserFeedsResponseDTO],
      }),
    ),
  deleteUser: () =>
    applyDecorators(
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiOperation({ summary: '유저 제거' }),
      ApiNoContentResponse({
        description: successMessage.S204_USER_001,
      }),
    ),
  postUserRenew: () =>
    applyDecorators(
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiOperation({ summary: '(MVP 전용)유저 재등록' }),
      ApiCreatedResponse({
        description: successMessage.S201_USER_002,
        type: PostUsersResponseDTO,
      }),
    ),
};

export const DocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
