import { Timestamp } from '../timestamp.entity';
import { User } from '../user';
import { Feed } from './feed.entity';

export class Comment extends Timestamp {
  /**
   * 댓글 내용
   * - 140자
   * - 3byte * 140
   */
  content: string;

  /* ========== 연관관계 ==========*/
  user: User;
  feed: Feed;
}
