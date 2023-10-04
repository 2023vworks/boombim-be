const userSuccessMessage = {
  S201_USER_001: '유저 등록에 성공하였습니다.',
  S200_USER_001: '유저 정보 조회에 성공하였습니다.',
};

const geoMarkSuccessMessage = {
  S200_GEO_MARK_001: '지도 마커 리스트 조회에 성공하였습니다.',
};

// S + statusCode + _컨트롤러 + _넘버링
export const successMessage = {
  S200_APP_001: '성공',
  ...userSuccessMessage,
  ...geoMarkSuccessMessage,
};

// E + statusCode + _컨트롤러 + _넘버링
export const errorMessage = {
  E400_APP_001: '요청이 유효성 검사를 통과하지 못하였습니다.',
  E404_APP_001: '요청한 자원이 존재하지 않거나 사용할 수 없습니다.',
  E401_APP_001: '인증 정보가 잘못되었습니다.',
};
