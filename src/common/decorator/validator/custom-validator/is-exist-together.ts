import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

/**
 * 입력받은 targetProperyName와 데코레이터가 적용된 property가 동시에 존재하는지 검증한다.
 * - 동시에 존재하는 경우 통과
 * - 동시에 존재하지 않는 에러 발생
 * @param targetProperyName
 * @param validationOptions
 * @returns
 */
export function IsExistTogether<T>(
  targetProperyName: keyof T,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsExistTogether',
      validator: {
        validate: (value, args): boolean => {
          const object = args.object as T;
          const target = object[targetProperyName];
          return !!(value && target);
        },
        defaultMessage: buildMessage(
          (eachPrefix, args) =>
            `${args.property} and ${
              targetProperyName as string
            } do exist together`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
