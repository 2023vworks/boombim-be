import { ApiProperty } from '@nestjs/swagger';
import { EnumValidator, IntValidator } from '../decorator';
import { Expose } from 'class-transformer';
import { Sort } from '../constant';

export class OffsetPaginationDTO {
  @ApiProperty({
    description: '페이지 번호',
    type: Number,
    default: 1,
    minimum: 1,
  })
  @Expose()
  @IntValidator({ min: 1 })
  readonly page: number;

  @ApiProperty({
    description: '페이지 당 데이터 개수',
    type: Number,
    default: 10,
    minimum: 1,
    maximum: 1000,
  })
  @Expose()
  @IntValidator({ min: 1, max: 1000 })
  readonly pageSize: number;

  @ApiProperty({
    description: `
    정렬조건:
    - ${Sort.ASC}: 오름차순(오래된순)
    - ${Sort.DESC}: 내림차순(최신순)
    `,
    enum: Sort,
  })
  @Expose()
  @EnumValidator(Sort)
  readonly sort: Sort;
}
