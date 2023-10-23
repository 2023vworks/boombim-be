import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import {
  InstanceValidator,
  IntValidator,
  defaultResponseProperties,
} from '@app/common';
import { FeedEntity, ReportHistoryEntity, UserEntity } from '@app/entity';

class AdminGetFeedsWithUserResponseDTO extends PickType(UserEntity, [
  ...defaultResponseProperties,
  'id',
  'nickname',
  'mbtiType',
]) {}
class AdminGetFeedsWithReportHistoryResponseDTO extends ReportHistoryEntity {}

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

  @ApiProperty({
    description: '피드 신고 내역',
    type: [AdminGetFeedsWithReportHistoryResponseDTO],
  })
  @Expose()
  @InstanceValidator(
    AdminGetFeedsWithReportHistoryResponseDTO,
    {},
    { each: true },
  )
  reportHistories: AdminGetFeedsWithReportHistoryResponseDTO[] | [];
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
