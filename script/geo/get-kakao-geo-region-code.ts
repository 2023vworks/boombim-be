import { kakao, KakaoGeoType } from './kakao-instance';
import * as fs from 'fs';

const arr: KakaoGeoType[] = JSON.parse(fs.readFileSync('./geo.json', 'utf-8'));

async function getKakaoGeoRegionCode(x: string, y: string) {
  const query = new URLSearchParams({ x, y }).toString();
  return kakao
    .get(`/geo/coord2regioncode.json?${query}`)
    .then((res) => res.data.documents);
}

const promises = arr.map((item) => getKakaoGeoRegionCode(item.x, item.y));

Promise.all(promises).then((res: [][]) => {
  const geo = [].concat(...res);
  fs.writeFileSync('./mark-region-code.json', JSON.stringify(geo));
});
