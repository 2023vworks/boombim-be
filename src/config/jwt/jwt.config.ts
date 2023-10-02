import { StringValidator, StringValidatorOptional } from '@app/common';
import { JwtSignOptions } from '@nestjs/jwt';

export class JwtConfig implements JwtSignOptions {
  @StringValidator({ minLength: 12 })
  secret: string;

  @StringValidator()
  expiresIn: string;

  @StringValidatorOptional()
  issuer: string;

  @StringValidatorOptional()
  subject?: string | null;
}
