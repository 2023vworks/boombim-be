import { ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

import { errorMessage } from '../../message';
import { ADMIN_ACCESS_TOKEN, USER_ACCESS_TOKEN } from '../../constant';

type TokenName = typeof USER_ACCESS_TOKEN | typeof ADMIN_ACCESS_TOKEN;

export const ApiAuthDocument = (tokenName: TokenName) => {
  return applyDecorators(
    ApiSecurity(tokenName),
    ApiUnauthorizedResponse({
      description: errorMessage.E401_APP_001,
    }),
  );
};
