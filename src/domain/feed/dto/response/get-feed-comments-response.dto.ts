import { InstanceValidator } from '@app/common';
import { CommentEntity, UserEntity } from '@app/entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class GetFeedCommentsWithUserResponseDTO extends PickType(UserEntity, [
  'mbtiType',
  'nickname',
]) {}

export class GetFeedCommentsResponseDTO extends PickType(CommentEntity, [
  'content',
]) {
  @ApiProperty({
    description: '댓글 작성자 정보',
    type: GetFeedCommentsWithUserResponseDTO,
  })
  @Expose()
  @InstanceValidator(GetFeedCommentsWithUserResponseDTO)
  user: GetFeedCommentsWithUserResponseDTO;
}
