import { ApiProperty } from '@nestjs/swagger';
import { IntValidator } from '../decorator';
import { Expose } from 'class-transformer';

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
}
