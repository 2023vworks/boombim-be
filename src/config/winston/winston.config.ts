import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file'; // 날짜별로 윈스턴 로그 저장 기능을 지원하는 모듈
import { utilities, WinstonModuleOptions } from 'nest-winston';
import { join } from 'path';

const baseDir = join(process.cwd(), 'logs'); // ./logs
const errLogDir = join(baseDir, 'error'); // ./logs/error

/**
 * winston에 설정할 커스텀 로그 우선순위 목록 정의
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

/**
 * 개발 환경 로그 저장위치 설정 => 콘솔에 출력
 * @returns
 */
const devTransports = () => [new winston.transports.Console()];

/**
 * 운영 환경 로그 저장 위치 설정 => 파일로 저장
 * @returns
 */
const prodTransports = () => [
  /* warn 레벨 이하 로그를 저장할 파일 설정 */
  new winstonDaily({
    level: 'warn',
    datePattern: 'YYYY-MM-DD', // 파일명 날짜 형식 패턴
    dirname: baseDir, // 저장 위치
    filename: `%DATE%.log`, // ex) 2021-12-11.log
    maxFiles: 30, // 30일치 로그 파일 저장
    zippedArchive: true, // 30일이 지난 로그는 압축하도록 설정.
  }),
  /* error 레벨 로그를 저장할 파일 설정 */
  new winstonDaily({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: errLogDir,
    filename: `%DATE%.error.log`, // ex) 2021-12-11.error.log
    maxFiles: 30,
    zippedArchive: true,
  }),
];

/**
 * WinstonModule.createLogger()에 넣을 옵션을 생성하는 객체
 * - Production: File
 * - Development: Console
 */
export const Winston = {
  getProductionConfig: (appName: string): WinstonModuleOptions => ({
    levels,
    level: 'warn',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      utilities.format.nestLike(appName, { prettyPrint: true }),
    ),
    transports: prodTransports(),
  }),

  getDevelopmentConfig: (appName: string): WinstonModuleOptions => ({
    /* 커스텀 레벨 목록 설정 */
    levels,
    /* 설정한 로그 레벨 이하만 출력 */
    level: 'silly',
    /* 출력 포멧 설정 */
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(), // 이전 로그와 다음로그 시간차 출력
      // nestjs의 logger에 연동하기 위해 nest-winston를 사용하여 설정, 설정하지 않으면 undefined 출력
      utilities.format.nestLike(appName, { prettyPrint: true, colors: true }), // colors: false => 색상 없음
    ),
    /* 생성한 로그를 어디에 출력(전송)할지 설정 */
    transports: devTransports(),
  }),
};
