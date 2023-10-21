import { IntValidator } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PostFeedResponseDTO {
  @ApiProperty({
    description: '생성된 피드 id',
    example: 1,
  })
  @Expose()
  @IntValidator({ min: 1, max: 2_147_483_647 })
  feedId: number;
}
