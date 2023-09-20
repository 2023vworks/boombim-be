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
};
