/**
 * Mbti 타입
 */
enum MbtiType {
  ISTJ = 'ISTJ',
  ISFJ = 'ISFJ',
  INFJ = 'INFJ',
  INTJ = 'INTJ',
  ISTP = 'ISTP',
  ISFP = 'ISFP',
  INFP = 'INFP',
  INTP = 'INTP',
  ESTP = 'ESTP',
  ESFP = 'ESFP',
  ENFP = 'ENFP',
  ENTP = 'ENTP',
  ESTJ = 'ESTJ',
  ESFJ = 'ESFJ',
  ENFJ = 'ENFJ',
  ENTJ = 'ENTJ',
}
/**
 * 추천 타입
 */
enum RecommendType {
  RECOMMEND = 'Recommend',
  UNRECOMMEND = 'Unrecommend',
}
/**
 * 좌표계 타입
 */
enum CoordType {
  /** 위경도 좌표계 */
  WGS84 = 'WGS84',
  WCONGNAMUL = 'WCONGNAMUL',
  CONGNAMUL = 'CONGNAMUL',
  WGS84GEO = 'WGS84GEO',
  WCONGNAMULGEO = 'WCONGNAMULGEO',
  CONGNAMULGEO = 'CONGNAMULGEO',
}

export interface User {
  id: number; // 고유한 값
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

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

export interface Feed {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

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

export interface Comment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

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

export interface RecommendHistory {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  /**
   * 추천 타입
   * - 'Recommend' | 'Unrecommend'
   */
  type: RecommendType;

  /* ========== 연관관계 ==========*/
  feed: Feed; // 부모
  user: User;
}

export interface ReportHistory {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  /**
   * 신고 사유
   */
  reason: string;

  /* ========== 연관관계 ==========*/
  feed: Feed; // 부모
  user: User;
}

export interface GeoMark {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  /**
   * 경도
   * - Double
   * - x = longtitue = 경도
   */
  x: number;
  /**
   * 위도
   * - Double
   * - y = lattitue = 위도
   */
  y: number;
  /**
   * 좌표계 타입
   * - default 'WGS84'
   */
  type: CoordType;

  /**
   * 행정구역 정보
   */
  regionInfo: RegionInfo;

  /**
   * 주소 정보
   */
  address: Address;

  /**
   * 도로명 주소 정보
   */
  roadAddress?: RoadAddress | null;

  /* ========== 연관관계 ==========*/
  // 관계
  feed: Feed;
}

/**
 * 좌표로 행정구역정보 받기
 * @docs https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-district-response-body-document
 */
export interface RegionInfo {
  /**
   * H(행정동) 또는 B(법정동)
   */
  region_type: string;
  /**
   * 전체 지역 명칭
   */
  address_name: string;
  /**
   * 지역 1Depth, 시도 단위 바다 영역은 존재하지 않음
   */
  region_1depth_name: string;
  /**
   * 지역 2Depth, 구 단위 바다 영역은 존재하지 않음
   */
  region_2depth_name: string;
  /**
   * 지역 3Depth, 동 단위 바다 영역은 존재하지 않음
   */
  region_3depth_name: string;
  /**
   * 지역 4Depth, 리 영역인 경우만 존재 region_type이 법정동이며;
   */
  region_4depth_name: string;
  /**
   * region 코드
   */
  code: string;
  /**
   * X 좌표값, 경위도인 경우 경도(longitude)
   * - Double
   */
  x: number;
  /**
   * Y 좌표값, 경위도인 경우 위도(latitude)
   * - Double
   */
  y: number;
}

/**
 * 지번 주소 상세 정보
 * @docs https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address-response-body-address
 */
export interface Address {
  /**
   * 전체 지번 주소
   */
  addressName: string;

  /**
   *  지역 1 Depth, 시도 단위
   */
  region1DepthName: string;

  /**
   *  지역 2 Depth, 구 단위
   */
  region2DepthName: string;

  /**
   *  지역 3 Depth, 동 단위
   */
  region3DepthName: string;

  /**
   *  지역 3 Depth, 행정동 명칭
   */
  region3DepthHName: string;

  /**
   *  산 여부, Y 또는 N
   */
  mountainYn: string;

  /**
   *  지번 주번지
   */
  mainAddressNo: string;

  /**
   *  지번 부번지, 없을 경우 빈 문자열("") 반환
   */
  subAddressNo: string;

  /**
   * 우편번호(6자리)
   * @deprecated
   * @see [주소 검색 API의 우편번호 및 오탈자 응답 필드 제거 안내] https://devtalk.kakao.com/t/api-6/93000
   */
  deprecatedZipCode: string;
}

/**
 * 도로명 주소 상세 정보
 * @docs https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address-response-body-road-address
 */
export interface RoadAddress {
  /**
   * 전체 도로명 주소
   */
  addressName: string;

  /**
   * 지역명1
   */
  region1DepthName: string;

  /**
   * 지역명2
   */
  region2DepthName: string;

  /**
   * 지역명3
   */
  region3DepthName: string;

  /**
   * 도로명
   */
  roadName: string;

  /**
   * 지하 여부, Y 또는 N
   */
  undergroundYn: 'Y' | 'N';

  /**
   * 건물 본번
   */
  mainBuildingNo: string;

  /**
   * 건물 부번, 없을 경우 빈 문자열("") 반환
   */
  subBuildingNo: string;

  /**
   * 건물 이름
   */
  buildingName: string;

  /**
   * 우편번호(5자리)
   */
  zoneNo: string;
}
