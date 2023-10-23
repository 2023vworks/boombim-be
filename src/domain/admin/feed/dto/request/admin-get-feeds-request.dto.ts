import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { EnumValidator, OffsetPaginationDTO } from '@app/common';

export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
  RECOMMEND = 'RECOMMEND',
  UNRECOMMEND = 'UNRECOMMEND',
}
export enum Filter {
  ALL = 'ALL',
  REPORT = 'REPORT',
  ACTIVATE = 'ACTIVATE',
}

export class AdminGetFeedsRequestDTO extends PickType(OffsetPaginationDTO, [
  'page',
  'pageSize',
]) {
  @ApiProperty({
    description: `
    정렬조건:
    - ${Sort.ASC}: 오름차순(오래된순)
    - ${Sort.DESC}: 내림차순(최신순)
    - ${Sort.RECOMMEND}: 추천순
    - ${Sort.UNRECOMMEND}: 비추천순
    `,
    enum: Sort,
  })
  @Expose()
  @EnumValidator(Sort)
  readonly sort: Sort;

  @ApiProperty({
    description: `
    필터조건:
    - ${Filter.ALL}: 전체 조회
    - ${Filter.REPORT}: 신고가 있는 피드만 조회
    - ${Filter.ACTIVATE}: 활성화된 피드만 조회
    `,
    enum: Filter,
  })
  @Expose()
  @EnumValidator(Filter)
  readonly filter: Filter;
}
