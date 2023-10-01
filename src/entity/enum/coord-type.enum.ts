/**
 * 좌표계 타입
 */
export enum CoordType {
  /** 위경도 좌표계(GPS가 사용하는 좌표계) */
  WGS84 = 'WGS84',
  WCONGNAMUL = 'WCONGNAMUL',
  CONGNAMUL = 'CONGNAMUL',
  WGS84GEO = 'WGS84GEO',
  WCONGNAMULGEO = 'WCONGNAMULGEO',
  CONGNAMULGEO = 'CONGNAMULGEO',
}
