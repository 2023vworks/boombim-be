import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig, LocalConfig } from '@app/config';
import {
  DevelopmentGlobalProviders,
  GlobalModule,
  ProductionProviders,
} from '@app/custom';
import { EnvUtil, getTypeOrmModuleAsyncOptions } from '@app/common';
import { ProdConfig } from '@app/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainModule } from './domain';

const globalProviders = EnvUtil.isProd()
  ? [...ProductionProviders]
  : [...DevelopmentGlobalProviders];
const config = EnvUtil.isProd() ? ProdConfig : LocalConfig;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [() => AppConfig.validate(config)],
    }),
    TypeOrmModule.forRootAsync(getTypeOrmModuleAsyncOptions()),
    GlobalModule,
    DomainModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...globalProviders],
})
export class AppModule {}
