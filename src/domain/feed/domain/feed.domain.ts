import { OmitType } from '@nestjs/swagger';

import { FeedEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';
import { Comment } from './comment.domain';
import { RecommendHistory } from './recommend-history.domain';

export class FeedProps extends OmitType(FeedEntity, [
  'user',
  'comments',
  'recommendHistories',
  'reportHistories',
]) {
  comments: Comment[];
  recommendHistories: RecommendHistory[];
}

export class Feed extends BaseDomain<FeedProps> {
  constructor(readonly props: FeedProps) {
    super(props);
  }

  /**
   * 피드 활성도
   * - 1 ~ 5
   */
  get activity(): number {
    return this.props.activity;
  }

  /**
   * 피드 내용
   * - 140자
   * - 3byte * 140 = 420
   */
  get content(): string {
    return this.props.content;
  }

  /**
   * 썸네일 이미지 리스트
   * - min 0
   * - max 5
   */
  get thumbnailImages(): string[] {
    return this.props.thumbnailImages;
  }

  /**
   * 이미지 리스트
   * - min 0
   * - max 5
   */
  get images(): string[] {
    return this.props.images;
  }

  /**
   * 해시태그 리스트
   */
  get hashTags(): string[] {
    return this.props.hashTags;
  }

  /**
   * 피드 활성화 시간
   * - 피드 활성화 시간 = 생성된 시간 + (추천수 * 30) - (비추천 * 15)
   */
  get activationAt(): Date {
    return this.props.activationAt;
  }

  /**
   * 추천수
   */
  get recommendCount(): number {
    return this.props.recommendCount;
  }

  /**
   * 비추천수
   */
  get unrecommendCount(): number {
    return this.props.unrecommendCount;
  }

  /**
   * 신고수
   */
  get reportCount(): number {
    return this.props.reportCount;
  }

  /**
   * 조회수
   */
  get view(): number {
    return this.props.view;
  }

  get comments(): Comment[] {
    return this.props.comments;
  }

  get recommendHistories(): RecommendHistory[] {
    return this.props.recommendHistories;
  }
}
