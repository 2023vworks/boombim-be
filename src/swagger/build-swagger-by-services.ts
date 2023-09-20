import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildSwagger } from '@app/common';
import { SwaggerConfig } from '@app/config';

export function swaggerbuilder(basePath: string, app: INestApplication): void {
  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  const { apis } = swaggerConfig;
  buildAllServiceSwagger(`${basePath}`);
  function buildAllServiceSwagger(adminPath: string) {
    buildSwagger(adminPath, app, apis);
  }
}
