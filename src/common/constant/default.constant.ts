export const DEFALUT_APP_NAME = process.env.APP_NAME ?? 'Test';
export const USER_ACCESS_TOKEN = 'USER_ACCESS_TOKEN';
export const ADMIN_ACCESS_TOKEN = 'ADMIN_ACCESS_TOKEN';

export const UPLOAD_FILE_NAME = 'image';
export const UPLOAD_FILES_NAME = 'images';

/**
 * nestjs의 Global ValidationPipe에 적용할 옵션
 * - ValidationPipeOptions
 * @property {boolean} whitelist - 화이트리스트 설정으로 true시 검증 데코레이터가 적용되지 않은 필드는 제거
 * @property {boolean} forbidNonWhitelisted - 검증 데코레이터가 적용되지 않은 값이 포함된 경우 예외를 발생
 * @property {boolean} transform - true 설정시 요청 Body를 class-transform을 사용하여 class로 변환
 * @property {Object} transformOptions -  { transform: true }인 경우 class-transform의 변환 옵션 설정
 * @property {boolean} transformOptions.enableImplicitConversion - true: js 묵시적형 변환 허용
 * @property {boolean} transformOptions.exposeUnsetFields - true: 변환된 class에 undefined 필드를 포함한다.
 * @Url [nestjs 공식 문서](https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe)
 * @Url [class-transform | source code](https://github.com/typestack/class-transformer/blob/develop/src/interfaces/class-transformer-options.interface.ts)
 */
export const defaultGlobalValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    // Note: 묵시적 형변환 옵션을 끄고, @Type 데코레이터를 사용.
    enableImplicitConversion: false,
    exposeUnsetFields: false,
  },
};

/**
 * class-transform의 plainToInstance 함수에 사용할 옵션 기본값
 * - ClassTransformOptions
 * @property {boolean} enableImplicitConversion - true: js 묵시적형 변환 허용
 * @property {boolean} exposeUnsetFields - true: 변환된 class에 undefined 필드를 포함한다
 * @property {boolean} excludeExtraneousValues - true: `@Expose()`가 없는 속성 모두 제거
 * @Url [jsdocs | class-transfrom#ClassTransformOptions](https://www.jsdocs.io/package/class-transformer#ClassTransformOptions.enableImplicitConversion)
 * @Url [class-transform | source code](https://github.com/typestack/class-transformer/blob/develop/src/interfaces/class-transformer-options.interface.ts)
 */
export const defaultPlainToInstanceOptions = {
  // Note: 묵시적 형변환 옵션을 끄고, @Type 데코레이터를 사용.
  enableImplicitConversion: false,
  exposeUnsetFields: false,
  excludeExtraneousValues: true,
};

export const defaultResponseProperties: ['id', 'createdAt', 'updatedAt'] = [
  'id',
  'createdAt',
  'updatedAt',
];
