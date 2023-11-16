import { ApiProperty, PickType } from '@nestjs/swagger';

import {
  IntValidator,
  StringValidator,
  defaultResponseProperties,
} from '@app/common';
import { FeedEntity } from '@app/entity';
import { Expose } from 'class-transformer';

export class GetUserFeedsResponseDTO extends PickType(FeedEntity, [
  ...defaultResponseProperties,
  'activity',
  'hashTags',
  'activationAt',
  'content',
  'recommendCount',
  'unrecommendCount',
  'reportCount',
  'viewCount',
  'commentCount',
]) {
  @ApiProperty({
    description: '지도 마커 ID',
    type: Number,
    minimum: 1,
    maximum: 2147483647,
  })
  @IntValidator()
  @Expose()
  geoMarkId: number;

  @ApiProperty({
    description: '지도 마커가 속한 지역정보(행정동)',
    type: String,
  })
  @StringValidator()
  @Expose()
  geoMarkRegion: string;
}
