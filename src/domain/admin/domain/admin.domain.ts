import { AdminEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';

interface AdminProps extends Omit<AdminEntity, 'httpRequestHistories'> {}

export class Admin extends BaseDomain<AdminProps> {
  constructor(readonly props: AdminProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get nickname(): string {
    return this.props.nickname;
  }

  get token(): string {
    return this.props.token;
  }

  get accessedAt(): Date {
    return this.props.accessedAt;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }
}
