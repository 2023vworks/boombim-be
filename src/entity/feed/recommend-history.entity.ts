import { RecommendType } from '../enum';
import { Timestamp } from '../timestamp.entity';
import { User } from '../user';
import { Feed } from './feed.entity';

export class RecommendHistory extends Timestamp {
  /**
   * 추천 타입
   * - 'Recommend' | 'Unrecommend'
   */
  type: RecommendType;

  /* ========== 연관관계 ==========*/
  feed: Feed; // 부모
  user: User;
}
