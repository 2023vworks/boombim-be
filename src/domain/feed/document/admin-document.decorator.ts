import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import {
  ADMIN_ACCESS_TOKEN,
  ApiAuthDocument,
  errorMessage,
  successMessage,
} from '@app/common';
import { AdminFeedController } from '../admin-feed.controller';
import { AdminGetFeedsResponseDTO } from '../dto';

type API_DOC_TYPE = keyof AdminFeedController;

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  getFeeds: () =>
    applyDecorators(
      ApiOperation({ summary: '[Admin] 피드 리스트 조회' }),
      ApiOkResponse({
        description: successMessage.S200_ADMIN_FEED_001,
        type: [AdminGetFeedsResponseDTO],
      }),
      ApiAuthDocument(ADMIN_ACCESS_TOKEN),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
    ),
  patchFeedActivation: () =>
    applyDecorators(
      ApiOperation({ summary: '[Admin] 피드 활성 수정' }),
      ApiNoContentResponse({
        description: successMessage.S204_ADMIN_FEED_001,
      }),
      ApiAuthDocument(ADMIN_ACCESS_TOKEN),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
    ),
};

export const AdminDocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
