import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { IntValidator, IntValidatorOptional } from '../decorator';

export class CursorPaginationDTO {
  @ApiPropertyOptional({
    description:
      '다음 커서(요청할 데이터 시작 커서), 없다면 가장 최초 커서를 사용한다.',
    type: Number,
    minimum: 1,
    maximum: 2147483647,
  })
  @Expose()
  @IntValidatorOptional()
  readonly nextCursor?: number;

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

  @ApiHideProperty()
  @IsOptional()
  @Expose()
  readonly sort: 'ASC' | 'DESC';
}
