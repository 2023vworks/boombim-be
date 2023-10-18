import { OmitType } from '@nestjs/swagger';

import { FeedEntity, RecommendType } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';
import { GeoMark } from 'src/domain/geo-mark/domain';
import { Comment } from './comment.domain';
import { User } from 'src/domain/user/domain';
import { ReportHistory } from './report-history.domain';

type FeedWriter = Pick<User, 'id' | 'nickname' | 'mbtiType'>;

export class FeedProps extends OmitType(FeedEntity, [
  'user',
  'comments',
  'recommendHistories',
  'reportHistories',
  'geoMark',
]) {
  user: FeedWriter;
  geoMarkId: number;
  geoMark?: GeoMark | null;
  comments: Comment[] | [];
  reportHistories: ReportHistory[] | [];
}

export class Feed extends BaseDomain<FeedProps> {
  private readonly ADDITIONAL_MINUTES = 30;
  private readonly DEDUCTED_MINUTES = 15;

  constructor(readonly props: FeedProps) {
    super({ ...props });
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

  get geoMarkId(): number {
    return this.props.geoMarkId;
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

  get user(): FeedWriter {
    return this.props.user;
  }

  get comments(): Comment[] {
    return this.props.comments;
  }

  get geoMark(): GeoMark {
    return this.props.geoMark;
  }

  get reportHistories(): ReportHistory[] {
    return this.props.reportHistories;
  }

  /* ========== custom ========== */

  get hasGeoMark(): boolean {
    return !!this.props.geoMark;
  }

  get hasComments(): boolean {
    return this.props.comments.length > 0;
  }

  /**
   * 피드 활성화 여부
   * - 피드 활성화 시간이 현재 시간보다 크면 활성화(true)
   */
  get isActivated(): boolean {
    return this.props.activationAt >= new Date();
  }

  get isLockFeed(): boolean {
    return this.props.reportCount >= 5;
  }

  /* ========== method ========== */
  addViewCount(): this {
    this.props.viewCount++;
    return this;
  }

  addCommentCount(): this {
    this.props.commentCount++;
    return this;
  }

  addReportCount(): this {
    this.props.reportCount++;
    return this;
  }

  /**
   * 추천을 통해 활성시간과 활성도를 조정한다.
   * @returns
   */
  recommned(): this {
    this.props.recommendCount++;
    this.renewActivationAt(RecommendType.RECOMMEND);
    this.setActivity();
    return this;
  }

  /**
   * 비추천을 통해 활성시간을 조정한다.
   * @returns
   */
  unrecommned(): this {
    this.props.unrecommendCount++;
    this.renewActivationAt(RecommendType.UNRECOMMEND);
    // TODO: 비추천은 활성도에 영향을 주지 않는게 맞는지 확인해야한다.
    // this.setActivity();
    return this;
  }

  /**
   * 피드 활성화 시간 갱신(activationAt)
   * - 피드 활성화 시간 = 생성된 시간 + (추천수 * 30) - (비추천 * 15)
   * @returns
   */
  private renewActivationAt(type: RecommendType) {
    const { activationAt } = this.props;
    const additionalMinutes =
      type === RecommendType.RECOMMEND
        ? this.ADDITIONAL_MINUTES
        : -this.DEDUCTED_MINUTES;
    activationAt.setMinutes(activationAt.getMinutes() + additionalMinutes);

    return this;
  }

  /**
   * 피드 활성도
   * - 추천도에 따라 결정되면 기준을 아래와 같다.
   * - 기준: 0이상 | 5이상 | 10이상 | 20이상 | 30이상
   * - 결과: 1단계 | 2단계 | 3단계 | 4단계 | 5단계
   * @returns
   * @error {Error} 추천수가 0보다 작을 경우 에러를 발생시킵니다.
   */
  private setActivity() {
    if (this.props.activity < 0) {
      throw new Error('[FeedDomin] recommendCount is less than 0]');
    }

    switch (Math.floor(this.props.recommendCount / 5)) {
      case 0:
        this.props.activity = 1;
        break;
      case 1:
        this.props.activity = 2;
        break;
      case 2:
        this.props.activity = 3;
        break;
      case 4:
        this.props.activity = 4;
        break;
      case 6:
      default:
        this.props.activity = 5;
        break;
    }

    return this;
  }
}
