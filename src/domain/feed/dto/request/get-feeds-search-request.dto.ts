import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { IntValidator } from '@app/common';

export class GetFeedsSearchRequestDTO {
  @ApiProperty({
    description: 'GeoMark id',
    example: 1,
  })
  @Expose()
  @IntValidator({ min: 1, max: 2_147_483_647 })
  geoMarkId?: number;
}
