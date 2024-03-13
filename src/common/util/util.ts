import { HttpException } from '@nestjs/common';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

import { defaultPlainToInstanceOptions } from '../constant';
import { PrimitiveType } from '../type';

interface Util {
  isServerError(error: HttpException): boolean;

  /**
   *  value === null || value === undefined 경우만 true를 리턴한다.
   * @param value
   */
  isNull(value: any): boolean;
  isNull(value: any[]): boolean;
  /**
   * value가 false로 판별되면 true를 리턴한다.
   * @param value
   */
  isNil(value: any): boolean;
  isNil(value: any[]): boolean;

  isTruthy(value: any): boolean;
  isTruthy(value: any[]): boolean;
  isFalsy(value: any): boolean;
  isFalsy(value: any[]): boolean;

  /**
   * 빈배열을 판별하는 함수
   * - array && array.length === 0;
   * @param array
   */
  isEmpty(array: any[]): boolean;
  /**
   * 빈배열이 아닌지 판별하는 함수
   * - array && array.length > 0;
   * @param array
   */
  isNotEmpty(array: any[]): boolean;

  /**
   * 배열에서 null 제거한 신규 배열을 리턴
   * @param array
   */
  filterNull<T>(array: T[]): T[];
  /**
   * 배열에서 null, undefined 제거한 신규 배열을 리턴
   * @param array
   */
  filterNil<T>(array: T[]): T[];

  /**
   * !!연산시 false로 판별되는 값을 제거한 신규 배열을 리턴
   * @param array
   */
  filterFalsy<T>(array: T[]): T[];

  /**
   * plainToInstance를 사용하여 인스턴스를 생성한다.
   * @param cls
   * @param plain
   * @param options
   */
  toInstance<T, V>(
    cls: ClassConstructor<T>,
    plain: V[],
    options?: ClassTransformOptions,
  ): T[];
  toInstance<T, V>(
    cls: ClassConstructor<T>,
    plain: V,
    options?: ClassTransformOptions,
  ): T;
  toInstance<T, V>(
    cls: ClassConstructor<T>,
    plain: V | V[],
    options?: ClassTransformOptions,
  ): T | T[] | undefined;

  getValues<T extends object, K extends Partial<keyof T>>(
    array: T[],
    targetProperty: K,
  ): T[K][];

  /**
   * 원시 배열이나, 원시값을 가진 객체 배열을 받아 중복이 있다면 제거한 결과를 리턴한다.
   * @param arr
   */
  deDuplication<T extends PrimitiveType>(arr: T[]): T[];
  deDuplication<T extends Record<string, PrimitiveType>>(arr: T[]): T[];

  /**
   * 원시 배열이나, 원시값을 가진 객체 배열을 받아 중복이 있다면 true 리턴한다.
   * @param arr
   */
  isDuplication<T extends PrimitiveType>(arr: T[]): boolean;
  isDuplication<T extends Record<string, PrimitiveType>>(arr: T[]): boolean;

  sort<T extends PrimitiveType>(
    arr: T[],
    orderBy?: 'asc' | 'desc',
  ): PrimitiveType[];
}

export const Util: Util = {
  isServerError(error) {
    return !(error instanceof HttpException);
  },

  isNull(value: any | any[]): boolean {
    const isNull = (val: unknown) => val === null || val === undefined;
    return Array.isArray(value) ? value.every(isNull) : isNull(value);
  },
  isNil(value: any | any[]): boolean {
    const isNil = (val: unknown) => !!val === false;
    return Array.isArray(value) ? value.every(isNil) : isNil(value);
  },
  isTruthy(value: any | any[]): boolean {
    const isTruthy = (val: unknown) => !!val === true;
    return Array.isArray(value) ? value.every(isTruthy) : isTruthy(value);
  },
  isFalsy(value: any | any[]): boolean {
    return !this.isTruthy(value);
  },
  isEmpty: (array: any[]): boolean => array && array.length === 0,
  isNotEmpty: (array: any[]): boolean => array && array.length > 0,

  filterNull<T>(arr: T[]): T[] {
    return !this.isEmpty(arr) ? arr.filter((item) => !this.isNull(item)) : [];
  },
  filterNil<T>(arr: T[]): T[] {
    return !this.isEmpty(arr) ? arr.filter((item) => !this.isNil(item)) : [];
  },
  filterFalsy<T>(arr: T[]): T[] {
    return !this.isEmpty(arr) ? arr.filter((item) => !this.isFalsy(item)) : [];
  },

  toInstance<T, V>(
    cls: ClassConstructor<T>,
    plain: V | V[],
    options?: ClassTransformOptions,
  ): T | T[] | undefined {
    return plainToInstance(cls, plain, {
      ...defaultPlainToInstanceOptions,
      ...options,
    });
  },

  getValues<T extends object, K extends Partial<keyof T>>(
    array: T[],
    targetProperty: K,
  ): T[K][] {
    return array.map((item) => item[targetProperty]);
  },

  deDuplication<T extends PrimitiveType>(arr: T[]): T[] {
    const isRecords = arr.every((i) => typeof i === 'object');
    if (!isRecords) {
      return Array.from(new Set(arr));
    }

    const deDuplicationJsons = Array.from(
      new Set(arr.map((item) => JSON.stringify(item))),
    );
    return deDuplicationJsons.map((json) => JSON.parse(json));
  },

  isDuplication<T extends PrimitiveType>(arr: T[]): boolean {
    return arr.length !== this.deDuplication(arr).length;
  },

  sort<T extends PrimitiveType>(
    arr: T[],
    orderBy: 'asc' | 'desc' = 'asc',
  ): PrimitiveType[] {
    return orderBy === 'asc'
      ? [...arr].sort((a: T, b: T) => (a > b ? 1 : -1))
      : [...arr].sort((a: T, b: T) => (b > a ? 1 : -1));
  },
};
