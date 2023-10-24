import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { InstanceValidator, defaultResponseProperties } from '@app/common';
import { FeedEntity, ReportHistoryEntity, UserEntity } from '@app/entity';

class AdminGetFeedWithUserResponseDTO extends PickType(UserEntity, [
  ...defaultResponseProperties,
  'id',
  'nickname',
  'mbtiType',
]) {}
class AdminGetFeedWithReportHistoryResponseDTO extends ReportHistoryEntity {}

export class AdminGetFeedResponseDTO extends OmitType(FeedEntity, [
  'user',
  'geoMark',
  'comments',
  'recommendHistories',
  'reportHistories',
]) {
  @ApiProperty({
    description: '피드 작성자 정보',
    type: AdminGetFeedWithUserResponseDTO,
  })
  @Expose()
  @InstanceValidator(AdminGetFeedWithUserResponseDTO)
  user: AdminGetFeedWithUserResponseDTO;

  @ApiProperty({
    description: '피드 신고 내역',
    type: [AdminGetFeedWithReportHistoryResponseDTO],
  })
  @Expose()
  @InstanceValidator(
    AdminGetFeedWithReportHistoryResponseDTO,
    {},
    { each: true },
  )
  reportHistories: AdminGetFeedWithReportHistoryResponseDTO[] | [];
}
