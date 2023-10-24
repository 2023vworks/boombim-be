import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRequest, errorMessage } from '@app/common';
import { AuthService } from '../auth.service';
import { BaseJwtGuard } from './base-jwt.guard';

@Injectable()
export class AdminJwtGuard extends BaseJwtGuard {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest<UserRequest>(context);
    const jwt = this.getJwt(request);
    if (!jwt) throw new UnauthorizedException(errorMessage.E401_APP_001);

    const payload = this.authService.decodeToken(jwt);
    if (!payload) throw new UnauthorizedException(errorMessage.E401_APP_001);

    const adminInfo = { id: payload.id, jwt };
    const isValid = await this.authService.isValidAdmin(adminInfo);
    if (!isValid) throw new UnauthorizedException(errorMessage.E401_APP_001);

    request.user = adminInfo;
    return true;
  }
}
