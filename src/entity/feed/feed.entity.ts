import { GeoMark } from '../geo';
import { Timestamp } from '../timestamp.entity';
import { User } from '../user';
import { Comment } from './comment.entity';
import { RecommendHistory } from './recommend-history.entity';
import { ReportHistory } from './report-history.entity';

export class Feed extends Timestamp {
  /**
   * 피드 활성도
   * - 1 ~ 5
   * - default 1
   */
  activity: number;

  /**
   * 피드 내용
   * - 140자
   * - 3byte * 140
   */
  content: string; // 140자 > 3byte * 140 하면될까?

  /**
   * 썸네일 이미지 리스트
   * - min 0
   * - max 5
   * - default []
   */
  thumbnailImages: string[];

  /**
   * 이미지 리스트
   * - min 0
   * - max 5
   * - default []
   */
  images: string[];
  /**
   * 해시태그 리스트
   * - default []
   */
  hashTags: string[];
  /**
   * 피드 활성화 여부
   * - default true
   */
  isActive: boolean;

  // 피드 남은 시간 = 생성된 시간 + (추천수 * 30) - (비추천 * 15)
  /**
   * 추천수
   * - default 0
   */
  recommendCount: number; // 추천수, default 0

  /**
   * 비추천수
   * - default 0
   */
  unrecommendCount: number;

  /**
   * 신고수
   * - default 0
   */
  reportCount: number; // 신고수, default 0

  /**
   * 노출수
   * - default 0
   */
  view: number;

  /* ========== 연관관계 ==========*/
  user: User;
  geoMark: GeoMark;
  comments: Comment[] | [];
  recommendHistories: RecommendHistory[] | [];
  reportHistories: ReportHistory[] | [];
}
