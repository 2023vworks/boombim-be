import { applyDecorators } from '@nestjs/common';
import { SlackController } from '../slack.controller';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { errorMessage, successMessage } from '@app/common';

type API_DOC_TYPE = keyof SlackController;

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  postAction: () =>
    applyDecorators(
      ApiOperation({ summary: '[Admin] Slack Action End Point' }),
      ApiNoContentResponse({
        description: successMessage.S200_APP_001,
      }),
      ApiBadRequestResponse({
        description: `400 Bad Request\n
    1. ${errorMessage.E400_SLACK_001} 
    2. ${errorMessage.E400_SLACK_002}
    3. ${errorMessage.E400_SLACK_003}
      `,
      }),
    ),
};

export const DocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
