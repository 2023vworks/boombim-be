import {
  InfoObject,
  SecuritySchemeObject,
  SecuritySchemeType,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class SwaggerInfo implements InfoObject {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  version: string = '1.0';
}

class SwaggerSecurityOptions implements SecuritySchemeObject {
  @IsNotEmpty()
  @IsString()
  type: SecuritySchemeType;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  in: string;
}
class SwaggerBearerAuthOptions extends SwaggerSecurityOptions {
  @IsNotEmpty()
  @IsString()
  scheme?: string;

  @IsNotEmpty()
  @IsString()
  bearerFormat: string;
}
class SwaggerCustomAuthOptions extends SwaggerSecurityOptions {}

export class SwaggerSecurityConfig {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(({ object }) => {
    const type: SecuritySchemeType = object.securityOptions.type;
    switch (type) {
      case 'http':
        // TODO: 'http와', 'apiKey'가 반대로 들어가는 경우 에러를 찾기 어려워서 추가적인 작업이 필요해 보인다.
        // const option: SwaggerBearerAuthOptions = object.securityOptions;
        // if(option.scheme) {}
        return SwaggerBearerAuthOptions;
      case 'apiKey':
        return SwaggerCustomAuthOptions;
      case 'oauth2':
      case 'openIdConnect':
        throw new Error('[SwaggerOptions] Type is no supported.');
    }
  })
  securityOptions: SwaggerBearerAuthOptions | SwaggerCustomAuthOptions;
}

export class SwaggerOptions {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SwaggerInfo)
  info: SwaggerInfo;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SwaggerSecurityConfig)
  securityConfig: SwaggerSecurityConfig;
}

export class SwaggerConfig {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SwaggerOptions)
  apis: SwaggerOptions;
}
