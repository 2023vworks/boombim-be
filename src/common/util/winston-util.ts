import { utilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

import { DEFALUT_APP_NAME, EnvUtil } from '@app/common';

type NpmLogLevels = typeof winston.config.npm.levels;
type Options = { env?: string; appName?: string };

export class WinstonUtil {
  private static _npmLogLevels: NpmLogLevels = winston.config.npm.levels;
  private static _appName: string;

  /** WinstonModule.createLogger()에 넣을 옵션 가져온다 */
  static getConfig(
    options: Options = {
      env: 'local',
      appName: DEFALUT_APP_NAME,
    },
  ) {
    this._appName = options.appName;
    return EnvUtil.isProd(options.env)
      ? this.getProductionConfig()
      : this.getDevelopmentConfig();
  }

  private static getProductionConfig(): WinstonModuleOptions {
    return {
      levels: this._npmLogLevels,
      level: this.getNpmLogLevelName(this._npmLogLevels.info), // TODO: 향후 warn으로 변경예정
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike(this._appName, {
          prettyPrint: true,
          colors: false,
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs/app.log',
          level: 'info',
        }),
      ],
    };
  }

  private static getDevelopmentConfig(): WinstonModuleOptions {
    return {
      /* 커스텀 레벨 목록 설정 */
      levels: this._npmLogLevels,
      /* 설정한 로그 레벨 이하만 출력 */
      level: this.getNpmLogLevelName(this._npmLogLevels.debug),
      /* 출력 포멧 설정 */
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(), // 이전 로그와 다음로그 시간차 출력
        // nest-winston에서 제공하는 utilities는 nestjs의 logger에 연동하기 위해 사용된다.
        // 설정하지 않으면 undefined가 출력 된다.
        utilities.format.nestLike(this._appName, {
          prettyPrint: true,
          colors: true, // colors: false => 색상 없음
        }),
      ),
      /* 생성한 로그를 어디에 출력(전송)할지 설정 */
      transports: [new winston.transports.Console()],
    };
  }

  private static getNpmLogLevelName(level: number): string {
    const reverseLevelsKeyValue: Record<string, string> = Object.fromEntries(
      Object.entries(this._npmLogLevels).reduce(
        (acc, [key, value]) => acc.set(value.toString(), key),
        new Map(),
      ),
    );
    const logLevelName = reverseLevelsKeyValue[level];
    if (!logLevelName) {
      throw new Error(`matched Npm Log Levels not exist`);
    }
    return logLevelName;
  }
}
