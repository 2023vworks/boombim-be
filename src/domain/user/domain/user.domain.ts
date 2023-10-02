import { DateUtil } from '@app/common';
import { UserEntity } from '@app/entity';

import { BaseDomain } from 'src/domain/base.domain';

export interface UserProps extends UserEntity {}

export class User extends BaseDomain<UserProps> {
  constructor(readonly props: UserProps) {
    super(props);
  }

  get mbtiType(): string {
    return this.props.mbtiType;
  }

  get nickname(): string {
    return this.id ? this.createNickname() : '0000';
  }

  get token(): string {
    return this.props.token;
  }

  get accessedAt(): Date {
    return this.props.accessedAt;
  }

  /**
   * 피드 작성 횟수
   * - 최대가 5개 이며, 소모시 시간당 1개가 충전된다.
   */
  get feedWritingCount(): number {
    const { feedWritingCount, lastFeedWrittenAt } = this.props;
    if (!lastFeedWrittenAt || feedWritingCount === 5) return 5;

    const differenceHours = DateUtil.differenceInHours(lastFeedWrittenAt);
    return differenceHours > 5 ? 5 : differenceHours;
  }

  get lastFeedWrittenAt(): Date | null {
    return this.props.lastFeedWrittenAt;
  }

  renewFeedWritingCount() {
    return this.feedWritingCount;
  }

  private createNickname(): string {
    switch (this.id.toString().length) {
      case 1:
        return `00${this.id}`;
      case 2:
        return `0${this.id}`;
      default:
        return `${this.id}`;
    }
  }
}
