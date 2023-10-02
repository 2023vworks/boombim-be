import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserInfo } from '@app/common';
import { JwtConfig } from '@app/config';

type UserJwtPayLoad = Pick<UserInfo, 'id'>;

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    config: ConfigService,
  ) {
    this.jwtConfig = config.get<JwtConfig>('jwt');
  }

  decodeToken(token: string): UserInfo | null {
    try {
      const { secret, issuer, subject } = this.jwtConfig;
      return this.jwtService.verify(token, {
        secret,
        issuer, // Note: 발행자까지 일치하는지 확인한다.
        subject,
      }) as UserInfo;
    } catch (error) {
      return null;
    }
  }

  /**
   * jwt 토큰 발급
   * @param payload
   * @returns
   */
  issueToken(payload: UserJwtPayLoad): string {
    const { secret, issuer, expiresIn, subject } = this.jwtConfig;
    return this.jwtService.sign(payload, {
      secret,
      issuer,
      expiresIn,
      subject,
    });
  }
}
