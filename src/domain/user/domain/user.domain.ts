import { DateUtil } from '@app/common';
import { UserEntity } from '@app/entity';

import { BaseDomain } from 'src/domain/base.domain';

export interface UserProps extends UserEntity {}

export class User extends BaseDomain<UserProps> {
  private MAX_FEED_WRITING_COUNT = 5;
  private oldFeedWritingCount: number;

  constructor(readonly props: UserProps) {
    super(props);
  }

  /**
   * MBTI 유형
   */
  get mbtiType(): string {
    return this.props.mbtiType;
  }

  /**
   * 닉네임
   */
  get nickname(): string {
    return this.id ? this.props.nickname : '0000';
  }

  /**
   * JWT 토큰
   */
  get token(): string {
    return this.props.token;
  }

  /**
   * 마지막 접속일
   * - mvp에서는 생성시 추가
   */
  get accessedAt(): Date {
    return this.props.accessedAt;
  }

  /**
   * 피드 작성 가능 횟수
   * - min 0
   * - max 5
   */
  get feedWritingCount(): number {
    return this.props.feedWritingCount;
  }

  /**
   * 충전 시작 여부
   */
  get isRechargeStart(): boolean {
    return this.props.isRechargeStart;
  }

  /**
   * feedWritingCount(피드 작성 가능 횟수) 충전 시작 시간
   */
  get feedWritingCountRechargeStartAt(): Date {
    return this.props.feedWritingCountRechargeStartAt;
  }

  /* ============ custom ============ */
  /**
   * 피드 최대 작성 횟수인지 확인합니다.
   * - 최대 5회까지 작성 가능합니다.
   */
  get isMaxFeedWritingCount(): boolean {
    return this.props.feedWritingCount === this.MAX_FEED_WRITING_COUNT;
  }

  /**
   * 피드 작성 횟수가 갱신되었는지 확인합니다.
   */
  get isRenewedFeedWritingCount(): boolean {
    return this.oldFeedWritingCount !== this.props.feedWritingCount;
  }

  /**
   * 피드 작성 횟수를 갱신합니다.
   * - 작성횟수는 feedWritingCountRechargeStartAt 부터 dateRight 시간까지 1시간에 1씩 충전됩니다.
   * - 최대 5회까지 작성 가능합니다.
   * - dateRight 기본적으로 현재시간 기준으로 합니다.
   * @param dateRight
   * @returns
   * @error {Error} 충전횟수가 0보다 작을 경우 에러를 발생시킵니다.
   */
  renewFeedWritingCount(dateRight: Date = new Date()) {
    const differenceHours = DateUtil.differenceInHours(
      this.props.feedWritingCountRechargeStartAt,
      dateRight,
    );
    if (differenceHours < 0)
      throw new Error('[UserDomain] differenceHours is less than 0');
    // 갱신할 필요 없으면 그냥 리턴
    if (differenceHours === 0) return this;

    this.oldFeedWritingCount = this.props.feedWritingCount;

    // 피드 작성 횟수 갱신
    const newFeedWritingCount = this.props.feedWritingCount + differenceHours;
    this.props.feedWritingCount =
      newFeedWritingCount > this.MAX_FEED_WRITING_COUNT
        ? this.MAX_FEED_WRITING_COUNT
        : newFeedWritingCount;

    // 피드 작성 횟수 충전 시작 시간 갱신
    this.props.feedWritingCountRechargeStartAt = this.isMaxFeedWritingCount
      ? this.props.feedWritingCountRechargeStartAt
      : new Date();

    // 충전 시작 여부 갱신
    this.props.isRechargeStart = this.isMaxFeedWritingCount ? false : true;

    return this;
  }

  /**
   * 닉네임
   * - 000 + id,
   * - default 0000
   */
  generateNickname(): this {
    switch (this.id.toString().length) {
      case 1:
        this.props.nickname = `00${this.id}`;
        return this;
      case 2:
        this.props.nickname = `0${this.id}`;
        return this;
      default:
        this.props.nickname = `${this.id}`;
        return this;
    }
  }
}
