import { ko } from 'date-fns/locale';
import * as Fns from 'date-fns';

interface DateUtil {
  toFormat(date?: Date, format?: string): string;
  /**
   * 입력받은 date의 시, 분, 초, ms를 최대로 변경한다.
   * ex)
   * - input 2023-01-01 13:24:20.123
   * - output 2023-01-01 23:59:59.999
   * @param date
   * @returns
   */
  toEndOfDay(date?: Date): Date;

  /**
   * 입력받은 date의 시, 분, 초, ms를 최소로 변경한다.
   * ex)
   * - input 2023-01-01 13:24:20.123
   * - output 2023-01-01 00:00:00.000
   * @param date
   * @returns
   */
  toStartOfDay(date?: Date): Date;

  getYear(date?: Date): number;

  getMonth(date?: Date): number;

  getDays(date?: Date): number;

  /**
   * dateLeft 날짜에서 현재까지 몇시간이 지났는지 시간차를 계산한다.
   * - dateLeft가 현재시간 보다 작은 경우에 양수를 반환한다.
   * @param dateLeft
   */
  differenceInHours(dateLeft: Date): number;
  /**
   * dateLeft 날짜에서 dateRight까지 몇시간이 지났는지 시간차를 계산한다.
   * - dateLeft가 dateRight 보다 작은 경우에 양수를 반환한다.
   * - dateLeft: 작은 날짜
   * - dateRight: 큰 날짜
   * @param dateLeft
   * @param dateRight
   */
  differenceInHours(dateLeft: Date, dateRight: Date): number;
}

export const DateUtil: DateUtil = {
  toFormat: (
    date: Date = new Date(),
    format = 'yyyy-MM-dd HH:mm:ss.SSS',
  ): string => {
    return Fns.format(date, format, {
      locale: ko,
    });
  },

  toEndOfDay: function (date: Date = new Date()): Date {
    return Fns.endOfDay(date);
  },

  toStartOfDay: function (date: Date = new Date()): Date {
    return Fns.startOfDay(date);
  },

  getYear: function (date?: Date): number {
    return Fns.getYear(date ?? new Date());
  },

  getMonth: function (date?: Date): number {
    return Fns.getMonth(date ?? new Date());
  },

  getDays: function (date?: Date): number {
    return Fns.getDate(date ?? new Date());
  },

  differenceInHours: function (
    dateLeft: Date,
    dateRight: Date = new Date(),
  ): number {
    return Fns.differenceInHours(dateRight, dateLeft);
    /**
     Fns.differenceInHours(
        new Date('2023-10-03 02:42:00.000'),
        new Date('2023-10-03 00:51:59.999'),
      ); // 1
     */
  },
};
