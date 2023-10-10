import { utilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

const levels = winston.config.npm.levels;
const reverseLevels = Object.fromEntries(
  Object.entries(levels).reduce(
    (acc, [key, value]) => acc.set(value.toString(), key),
    new Map(),
  ),
);

/**
 * WinstonModule.createLogger()에 넣을 옵션을 생성하는 객체
 */
export const Winston = {
  getProductionConfig: (appName: string): WinstonModuleOptions => ({
    levels,
    level: reverseLevels[levels.info], // TODO: 향후 warn으로 변경예정
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      utilities.format.nestLike(appName, { prettyPrint: true, colors: false }),
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/app.log',
        level: 'info',
      }),
    ],
  }),

  getDevelopmentConfig: (appName: string): WinstonModuleOptions => ({
    /* 커스텀 레벨 목록 설정 */
    levels,
    /* 설정한 로그 레벨 이하만 출력 */
    level: reverseLevels[levels.debug],
    /* 출력 포멧 설정 */
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(), // 이전 로그와 다음로그 시간차 출력
      // nestjs의 logger에 연동하기 위해 nest-winston를 사용하여 설정, 설정하지 않으면 undefined 출력
      utilities.format.nestLike(appName, { prettyPrint: true, colors: true }), // colors: false => 색상 없음
    ),
    /* 생성한 로그를 어디에 출력(전송)할지 설정 */
    transports: [new winston.transports.Console()],
  }),
};
