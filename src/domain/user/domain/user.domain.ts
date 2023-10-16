import { DateUtil, errorMessage } from '@app/common';
import { UserEntity } from '@app/entity';
import { ConflictException } from '@nestjs/common';

import { BaseDomain } from 'src/domain/base.domain';

export interface UserProps extends Omit<UserEntity, 'oldId'> {}

export class User extends BaseDomain<UserProps> {
  private MAX_FEED_WRITING_COUNT = 5;
  private lastRechargeStartAt: Date;

  constructor(readonly props: UserProps) {
    super(props);
    this.lastRechargeStartAt = props.feedWritingCountRechargeStartAt;
  }

  get mbtiType(): string {
    return this.props.mbtiType;
  }

  get nickname(): string {
    return this.id ? this.props.nickname : '0000';
  }

  get token(): string {
    return this.props.token;
  }

  get accessedAt(): Date {
    return this.props.accessedAt;
  }

  get feedWritingCount(): number {
    return this.props.feedWritingCount;
  }

  get feedWritingCountRechargeStartAt(): Date {
    return this.props.feedWritingCountRechargeStartAt;
  }

  /* ============ custom ============ */

  /**
   * 피드 작성 횟수가 최대치인지 확인합니다.
   */
  get isMaxFeedWritingCount(): boolean {
    return this.props.feedWritingCount === this.MAX_FEED_WRITING_COUNT;
  }

  /**
   * 피드 작성 횟수가 5회 이하인지 확인합니다.
   */
  get isRechargeStart(): boolean {
    return this.props.feedWritingCount <= this.MAX_FEED_WRITING_COUNT;
  }

  /**
   * 피드 작성 횟수가 갱신되었는지 확인합니다.
   */
  get isRenewedFeedWritingCount(): boolean {
    return (
      this.lastRechargeStartAt !== this.props.feedWritingCountRechargeStartAt
    );
  }

  get canWriteFeed(): boolean {
    return this.props.feedWritingCount > 0;
  }

  /* ================== method ================== */

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

  /**
   * 피드 작성 횟수 소모
   * 1. 피드 작성 횟수 갱신 수행 => this.renewFeedWritingCount()
   * 2. 작성 불가능하면 에러 발생
   * 3. 작성 횟수 차감
   * @returns
   * @Error {ConflictException} 피드 작성 횟수가 0일 경우 에러를 발생시킵니다.
   */
  useWritingCount() {
    this.renewFeedWritingCount();
    if (!this.canWriteFeed)
      throw new ConflictException(errorMessage.E409_FEED_001);

    this.props.feedWritingCount--;
    return this;
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
    const hoursPassed = DateUtil.differenceInHours(
      this.props.feedWritingCountRechargeStartAt,
      dateRight,
    );
    if (hoursPassed < 0)
      throw new Error('[UserDomain] differenceHours is less than 0');
    // 갱신할 필요 없으면 그냥 리턴
    if (hoursPassed === 0) return this;

    const lastFeedWritingCount = this.props.feedWritingCount;
    this.props.feedWritingCount = Math.min(
      this.MAX_FEED_WRITING_COUNT,
      lastFeedWritingCount + hoursPassed,
    );

    const isRenewed = lastFeedWritingCount !== this.props.feedWritingCount;
    if (isRenewed) {
      // 피드 작성 횟수 충전 시작 시간 갱신
      this.setLastRechargeStartAt(this.props.feedWritingCountRechargeStartAt);
      this.props.feedWritingCountRechargeStartAt = DateUtil.addHours(
        this.props.feedWritingCountRechargeStartAt,
        hoursPassed,
      );
    }

    return this;
  }

  private setLastRechargeStartAt(date: Date) {
    this.lastRechargeStartAt = date;
  }
}
