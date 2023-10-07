import { ApiProperty, PickType } from '@nestjs/swagger';

import { InstanceValidator, defaultResponseProperties } from '@app/common';
import { FeedEntity, UserEntity } from '@app/entity';
import { Expose } from 'class-transformer';

export class GetFeedsWithUserResponseDTO extends PickType(UserEntity, [
  'mbtiType',
  'nickname',
]) {}

export class GetFeedsResponseDTO extends PickType(FeedEntity, [
  ...defaultResponseProperties,
  'activity',
  'hashTags',
  'activationAt',
  'recommendCount',
  'unrecommendCount',
  'reportCount',
  'viewCount',
  'commentCount',
]) {
  @ApiProperty({
    description: '피드 작성자 정보',
    type: GetFeedsWithUserResponseDTO,
  })
  @Expose()
  @InstanceValidator(GetFeedsWithUserResponseDTO)
  user: GetFeedsWithUserResponseDTO;
}
