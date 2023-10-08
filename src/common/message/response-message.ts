const userSuccessMessage = {
  S201_USER_001: '유저 등록에 성공하였습니다.',
  S200_USER_001: '유저 정보 조회에 성공하였습니다.',
};

const geoMarkSuccessMessage = {
  S200_GEO_MARK_001: '지도 마커 리스트 조회에 성공하였습니다.',
};

const feedSuccessMessage = {
  S200_FEED_001: '피드 리스트 조회에 성공하였습니다.',
  S200_FEED_002: '피드 검색에 성공하였습니다.',
  S200_FEED_003: '피드 상세 조회에 성공하였습니다.',
  S200_FEED_004: '댓글 리스트 조회에 성공하였습니다.',
  S200_FEED_005: '피드의 활성 시간 조회에 성공하였습니다.',

  S201_FEED_001: '피드 생성에 성공하였습니다.',
  S201_FEED_002: '댓글 생성에 성공하였습니다.',

  S204_FEED_001: '이미지 추가에 성공하였습니다.',
  S204_FEED_002: '피드 추천에 성공하였습니다.',
  S204_FEED_003: '피드 비추천에 성공하였습니다.',
  S204_FEED_004: '피드 신고에 성공하였습니다.',
};

// S + statusCode + _컨트롤러 + _넘버링
export const successMessage = {
  S200_APP_001: '성공',
  ...userSuccessMessage,
  ...geoMarkSuccessMessage,
  ...feedSuccessMessage,
};

const feedErrorMessage = {
  E404_FEED_001: '피드가 존재하지 않습니다.',
  E409_FEED_001: '작성횟수가 부족하여 피드를 작성할 수 없습니다.',
  E409_FEED_002: '추천/비추천은 한번만 가능합니다.',
  E409_FEED_003: '신고는 한번만 가능합니다.',
};

// E + statusCode + _컨트롤러 + _넘버링
export const errorMessage = {
  E400_APP_001: '요청이 유효성 검사를 통과하지 못하였습니다.',
  E404_APP_001: '요청한 자원이 존재하지 않거나 사용할 수 없습니다.',
  E401_APP_001: '인증 정보가 잘못되었습니다.',
  E415_APP_001: '지원하지 않는 미디어 타입(mimetypes)입니다.',
  ...feedErrorMessage,
};
