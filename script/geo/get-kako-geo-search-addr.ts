import { kakao } from './kakao-instance';
import * as fs from 'fs';
import * as path from 'path';

type BaseData = { id: string; name: string; roadAddr: string; addr: string };

/**
 * 카카오 API를 사용하여 지역 데이터를 가져옵니다.
 * - 카테고리로 장소 검색하기
 * @param page
 * @returns
 * @docs https://developers.kakao.com/docs/latest/ko/local/dev-guide#address-coord
 */
async function getKakaoGeoData(query: string) {
  const rulQuery = new URLSearchParams({
    query,
    size: '15', // 1 ~ 15
  }).toString();

  return kakao
    .get(`/search/address.json?${rulQuery}`)
    .then((res) => res.data.documents);
}

// 잠실 스타벅스
const file = path.join(__dirname, '잠실-스타벅스-정보.json');
const baseDataArr: BaseData[] = JSON.parse(fs.readFileSync(file, 'utf-8'));

// 100번 수행
const promises = baseDataArr.map(({ roadAddr }) => {
  return getKakaoGeoData(roadAddr);
});

Promise.all(promises).then((arr2: any[][]) => {
  const arr2Filter = arr2
    .map(([first], i) => [{ ...first, id: i + 1 }])
    .filter(([first]) => Object.keys(first).length > 1);

  const data = [].concat(...arr2Filter).map((res) => {
    const found = baseDataArr.find((base) => base.id == res.id);
    return {
      ...res,
      store: found.name,
      dong: found.addr.split(' ')[0],
      hDong: res.address.region_3depth_h_name,
    };
  });
  const file = path.join(__dirname, '잠실-스타벅스-주소.json');
  fs.writeFileSync(file, JSON.stringify(data));
});
