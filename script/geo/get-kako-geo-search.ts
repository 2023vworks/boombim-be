import { kakao } from './kakao-instance';
import * as fs from 'fs';

/**
 * 카카오 API를 사용하여 지역 데이터를 가져옵니다.
 * - 카테고리로 장소 검색하기
 * @param page
 * @returns
 * @docs https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-category
 */
async function getKakaoGeoData(page: string) {
  const query = new URLSearchParams({
    category_group_code: 'CE7', // FD6: 음식점, CE7: 카페
    x: '127.11022780366409',
    y: '37.51495369228342',
    size: '15', // 1 ~ 15
    page, // 1 ~ 45
  }).toString();

  return kakao
    .get(`/search/category.json?${query}`)
    .then((res) => res.data.documents);
}

// 100번 수행
const promises = Array.from({ length: 45 }).map((_, i) => {
  return getKakaoGeoData(`${i + 1}`);
});

Promise.all(promises).then((res: [][]) => {
  const geo = [].concat(...res);
  fs.writeFileSync('./geo.json', JSON.stringify(geo));
});
