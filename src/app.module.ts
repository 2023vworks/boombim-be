import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvUtil, getTypeOrmModuleAsyncOptions } from '@app/common';
import { AppConfig, LocalConfig, ProdConfig } from '@app/config';
import {
  DevelopmentGlobalProviders,
  GlobalModule,
  ProductionProviders,
} from '@app/custom';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainModule } from './domain';
import { ScheduleModule } from '@nestjs/schedule';

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
    ScheduleModule.forRoot(),
    GlobalModule,
    DomainModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...globalProviders],
})
export class AppModule {}
