import { ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

import { errorMessage } from '../../message';
import { USER_ACCESS_TOKEN } from '../../constant';

export const ApiAuthDocument = (tokenName: typeof USER_ACCESS_TOKEN) => {
  return applyDecorators(
    ApiSecurity(tokenName),
    ApiUnauthorizedResponse({
      description: errorMessage.E401_APP_001,
    }),
  );
};
