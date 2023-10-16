import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRequest, errorMessage } from '@app/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest<UserRequest>(context);
    const jwt = this.getJwt(request);
    if (!jwt) throw new UnauthorizedException(errorMessage.E401_APP_001);

    const payload = this.authService.decodeToken(jwt);
    if (!payload) throw new UnauthorizedException(errorMessage.E401_APP_001);

    const isValid = await this.authService.isValidUser({ id: payload.id, jwt });
    if (!isValid) throw new UnauthorizedException(errorMessage.E401_APP_001);

    request.user = { id: payload.id, jwt };
    return true;
  }

  private getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }

  private getJwt(request: UserRequest): string | null {
    const authorization: string | undefined = request.headers['authorization']; // authorization
    return (
      authorization &&
      authorization.startsWith('Bearer') &&
      authorization.split(' ')[1]
    );
  }
}
