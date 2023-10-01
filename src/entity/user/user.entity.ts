import { Timestamp } from '../timestamp.entity';
import { MbtiType } from '../enum';
import { Comment, Feed } from '../feed';

export class User extends Timestamp {
  /**
   * MBTI 유형
   */
  mbtiType: MbtiType;

  /**
   * 닉네임
   * - 000 + id,
   * - default 0000
   */
  nickname: string;

  /**
   * JWT 토큰
   * - defalt ''
   */
  token: string;

  /**
   * 마지막 접속일
   * - mvp에서는 생성시 추가
   * - default now
   */
  accessedAt: Date;

  /**
   * 피드 작성 횟수
   * - min 0
   * - max 5
   * - default 5
   */
  feedWritingCount: number;

  /**
   * 피드 마지막 작성 시간 날짜
   */
  lastFeedWrittenAt?: Date | null;

  /* ========== 연관관계 ==========*/
  feeds: Feed[] | [];
  comments: Comment[] | [];
}
