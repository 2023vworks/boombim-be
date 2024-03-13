import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SwaggerConfig, SwaggerOptions } from '@app/config';
import { ConfigService } from '@nestjs/config';

export function buildSwagger(
  basePath: string,
  app: INestApplication,
  // eslint-disable-next-line @typescript-eslint/ban-types
  modules: Function[] = void 0,
): void {
  const configService = app.get(ConfigService);
  const swaggerConfig = configService.getOrThrow<SwaggerConfig>('swagger');
  const { apis } = swaggerConfig;

  // NOTE: 모든 API 노출
  setSwagger(basePath, app, apis, modules);
}

/**
 * nest app에 Swagger를 빌드한다.
 * @param path - Swagger를 응답할 url path 지정
 * @param app - port를 열지 않은 상태의 Nest Application
 * @param options
 * @param modules - optional로 없는 경우 AppModule과 하위의 Module을 모두 사용
 * @Url [nestjs 공식 문서 | openapi](https://docs.nestjs.com/openapi/introduction)
 * ```
 * // NOTE: 모든 API 노출
 * setSwagger('/docs', app, apis, [UserModule, UserProductModule]);
 * // NOTE: user 관련 API만 노출
 * setSwagger('/docs/user', app, user, [UserModule, UserProductModule]);
 * // NOTE: admin 관련 API만 노출
 * setSwagger('/docs/admin', app, admin, [AdminModule, AdminProductModule]);
 * ```
 */
function setSwagger(
  path: string,
  app: INestApplication,
  options: SwaggerOptions,
  // eslint-disable-next-line @typescript-eslint/ban-types
  modules: Function[] = void 0,
): void {
  const { info, securityConfigs } = options;
  const { title, description, version } = info;

  const documentBuilder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version);

  securityConfigs.forEach((config) => {
    documentBuilder.addBearerAuth(config.securityOptions, config.name);
  });

  const swaggerConfig = documentBuilder.build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: modules,
  });
  SwaggerModule.setup(path, app, document);
}
