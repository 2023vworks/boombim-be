import { OmitType } from '@nestjs/swagger';

import { FeedEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';
import { GeoMark } from 'src/domain/geo-mark/domain';
import { Comment } from './comment.domain';
import { RecommendHistory } from './recommend-history.domain';

export class FeedProps extends OmitType(FeedEntity, [
  'user',
  'comments',
  'recommendHistories',
  'reportHistories',
  'geoMark',
]) {
  comments: Comment[];
  recommendHistories: RecommendHistory[];
  geoMark: GeoMark;
}

export class Feed extends BaseDomain<FeedProps> {
  private readonly ADDITIONAL_MINUTES = 30;
  private readonly DEDUCTED_MINUTES = 15;

  constructor(readonly props: FeedProps) {
    super({
      ...props,
      comments: props.comments ?? [],
      recommendHistories: props.recommendHistories ?? [],
    });
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
  get viewCount(): number {
    return this.props.viewCount;
  }

  /**
   * 댓글수
   */
  get commentCount(): number {
    return this.props.commentCount;
  }

  get comments(): Comment[] {
    return this.props.comments;
  }

  get recommendHistories(): RecommendHistory[] {
    return this.props.recommendHistories;
  }

  get geoMark(): GeoMark {
    return this.props.geoMark;
  }

  /* ========== custom ========== */

  /**
   * 피드 활성화 여부
   * - 피드 활성화 시간이 현재 시간보다 크면 활성화(true)
   */
  get isActivated(): boolean {
    return this.props.activationAt >= new Date();
  }

  /**
   * 피드 활성화 시간 갱신(activationAt)
   * - 피드 활성화 시간 = 생성된 시간 + (추천수 * 30) - (비추천 * 15)
   * @returns
   */
  renewActivationAt() {
    const { recommendCount, unrecommendCount, activationAt } = this.props;
    const additionalMinutes = recommendCount * this.ADDITIONAL_MINUTES;
    const deductedMinutes = unrecommendCount * this.DEDUCTED_MINUTES;
    activationAt.setMinutes(
      activationAt.getMinutes() + additionalMinutes - deductedMinutes,
    );
    return this;
  }
}
