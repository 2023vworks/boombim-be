import { User } from '@sentry/node';
import { Timestamp } from '../timestamp.entity';
import { Feed } from './feed.entity';

export class ReportHistory extends Timestamp {
  /**
   * 신고 사유
   */
  reason: string;

  /* ========== 연관관계 ==========*/
  feed: Feed; // 부모
  user: User;
}
