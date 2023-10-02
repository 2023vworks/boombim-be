import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { errorMessage } from '@app/custom';
import { UserRequest } from '@app/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest<UserRequest>(context);
    const jwt = this.getJwt(request);
    if (!jwt) throw new UnauthorizedException(errorMessage.E401_APP_001);

    const user = this.authService.decodeToken(jwt);
    if (!user) throw new UnauthorizedException(errorMessage.E401_APP_001);

    // TODO: 만료시간이 없기 때문에 유저 있는지 확인해야한다. 엑세스 시간도 업데이트하면 좋을듯?
    user.jwt = jwt;
    request.user = user;
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
