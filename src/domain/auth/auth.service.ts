import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserInfo } from '@app/common';
import { JwtConfig } from '@app/config';
import { UserRepository, UserRepositoryToken } from '../user/user.repository';

type UserJwtPayload = Pick<UserInfo, 'id'>;

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
    config: ConfigService,
  ) {
    this.jwtConfig = config.get<JwtConfig>('jwt');
  }

  decodeToken(token: string): UserJwtPayload | null {
    try {
      const { secret, issuer, subject } = this.jwtConfig;
      return this.jwtService.verify(token, {
        secret,
        issuer, // Note: 발행자까지 일치하는지 확인한다.
        subject,
      }) as UserJwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * jwt 토큰 발급
   * @param payload
   * @returns
   */
  issueToken(payload: UserJwtPayload): string {
    const { secret, issuer, expiresIn, subject } = this.jwtConfig;
    return this.jwtService.sign(payload, {
      secret,
      issuer,
      expiresIn,
      subject,
    });
  }

  async isValidUser(userInfo: UserInfo): Promise<boolean> {
    const user = await this.userRepository.findOneByPK(userInfo.id);
    if (!user) return false;
    if (user.token !== userInfo.jwt) return false;
    // Note: 부수적인 로직이기 때문에 await를 하지 않는다.
    this.userRepository.updateProperty(user.id, { accessedAt: new Date() });
    return true;
  }
}
