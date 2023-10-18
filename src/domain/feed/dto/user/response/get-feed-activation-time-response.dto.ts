import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { DateValidator } from '@app/common';
import { FeedEntity } from '@app/entity';

export class GetFeedActivationTimeResponseDTO extends PickType(FeedEntity, [
  'activationAt',
]) {
  @ApiProperty({ description: '현재시간', type: Date })
  @Expose()
  @DateValidator()
  currentAt: Date;
}
