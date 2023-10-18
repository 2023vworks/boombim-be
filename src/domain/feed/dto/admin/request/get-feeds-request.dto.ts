import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { EnumValidator, OffsetPaginationDTO, Sort } from '@app/common';

export class AdminGetFeedsRequestDTO extends OffsetPaginationDTO {
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
