import { EnvUtil, errorMessage, successMessage } from '@app/common';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AdminSlackController } from '../admin-slack.controller';

type API_DOC_TYPE = keyof AdminSlackController;

const getPostActionApiDecorators = () =>
  [
    EnvUtil.isProd() && ApiExcludeEndpoint(),
    ApiOperation({ summary: '[Admin] Slack Action End Point' }),
    ApiNoContentResponse({
      description: successMessage.S200_SLACK_001,
    }),
    ApiBadRequestResponse({
      description: `400 Bad Request\n
    1. ${errorMessage.E400_SLACK_001} 
    2. ${errorMessage.E400_SLACK_002}
    3. ${errorMessage.E400_SLACK_003}
      `,
    }),
  ].filter((d) => {
    return !!d;
  });

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  postAction: () => applyDecorators(...getPostActionApiDecorators()),
};

export const DocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
