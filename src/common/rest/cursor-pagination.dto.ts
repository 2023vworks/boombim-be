import { ApiProperty } from '@nestjs/swagger';
import { IntValidator } from '../decorator';
import { Expose } from 'class-transformer';

export class CurserPaginationDTO {
  @ApiProperty({
    description: '다음 커서(요청할 데이터 시작 커서)',
    type: Number,
    default: 1,
    minimum: 1,
    maximum: 2147483647,
  })
  @Expose()
  @IntValidator({ min: 1, max: 2147483647 })
  readonly nextCursor: number;

  @ApiProperty({
    description: '요청할 데이터의 개수',
    type: Number,
    default: 10,
    minimum: 1,
    maximum: 1000,
  })
  @Expose()
  @IntValidator({ min: 1, max: 1000 })
  readonly size: number;
}
