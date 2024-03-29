import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserInfo } from '@app/common';
import { JwtConfig } from '@app/config';
import { AdminRepositoryPort } from '../admin/admin.repository';
import { UserRepositoryPort } from '../user/user.repository';

type JwtPayload = Pick<UserInfo, 'id'>;

export abstract class AuthServiceUseCase {
  abstract decodeToken(token: string): JwtPayload | null;
  abstract issueToken(payload: JwtPayload): string;
  abstract isValidUser(userInfo: UserInfo): Promise<boolean>;
  abstract isValidAdmin(adminInfo: UserInfo): Promise<boolean>;
}

@Injectable()
export class AuthService extends AuthServiceUseCase {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepositoryPort,
    private readonly adminRepository: AdminRepositoryPort,
    config: ConfigService,
  ) {
    super();
    this.jwtConfig = config.get<JwtConfig>('jwt');
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const { secret, issuer, subject } = this.jwtConfig;
      return this.jwtService.verify(token, {
        secret,
        issuer, // Note: 발행자까지 일치하는지 확인한다.
        subject,
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * jwt 토큰 발급
   * @param payload
   * @returns
   */
  issueToken(payload: JwtPayload): string {
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

  async isValidAdmin(adminInfo: UserInfo): Promise<boolean> {
    const admin = await this.adminRepository.findOneByPK(adminInfo.id);
    if (!admin) return false;
    if (!admin.isActive) return false;
    if (admin.token !== adminInfo.jwt) return false;
    // Note: 부수적인 로직이기 때문에 await를 하지 않는다.
    this.adminRepository.updateProperty(admin.id, { accessedAt: new Date() });
    return true;
  }
}
