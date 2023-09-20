export const DefalutAppName = 'Nestjs-API';

/**
 * class-transform의 plainToInstance 함수에 사용할 옵션 기본값
 * - ClassTransformOptions
 * @Url https://www.jsdocs.io/package/class-transformer#ClassTransformOptions.enableImplicitConversion
 */
export const defaultPlainToInstanceOptions = {
  enableImplicitConversion: true, // 정의된 속성 유형으로 암시적 형변환
  exposeUnsetFields: false, // undefined 속성 제거
  excludeExtraneousValues: true, // true시 @Expose()가 없는 속성 모두 제거
};

/**
 * nestjs ValidationPipe에 사용할 옵션 기본값
 * - ValidationPipeOptions
 * @Url https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
 */
export const defaultValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
    exposeUnsetFields: false,
  },
};

export const defaultResponseProperties: ['id', 'createdAt', 'updatedAt'] = [
  'id',
  'createdAt',
  'updatedAt',
];
