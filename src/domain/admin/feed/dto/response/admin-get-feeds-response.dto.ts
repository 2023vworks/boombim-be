import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import {
  InstanceValidator,
  IntValidator,
  defaultResponseProperties,
} from '@app/common';
import { FeedEntity, UserEntity } from '@app/entity';

class AdminGetFeedsWithUserResponseDTO extends PickType(UserEntity, [
  ...defaultResponseProperties,
  'id',
  'nickname',
  'mbtiType',
]) {}

export class AdminGetFeedsResponseDTO extends OmitType(FeedEntity, [
  'user',
  'geoMark',
  'comments',
  'recommendHistories',
  'reportHistories',
]) {
  @ApiProperty({
    description: '피드 작성자 정보',
    type: AdminGetFeedsWithUserResponseDTO,
  })
  @Expose()
  @InstanceValidator(AdminGetFeedsWithUserResponseDTO)
  user: AdminGetFeedsWithUserResponseDTO;
}

export class AdminGetFeedsWithCountResponseDTO {
  @ApiProperty({
    description: '피드 리스트',
    type: AdminGetFeedsResponseDTO,
  })
  @Expose()
  @InstanceValidator(AdminGetFeedsResponseDTO, {}, { each: true })
  feeds: AdminGetFeedsResponseDTO[];

  @ApiProperty({
    description: '피드 개수',
    type: Number,
  })
  @Expose()
  @IntValidator()
  totalCount: number;
}
