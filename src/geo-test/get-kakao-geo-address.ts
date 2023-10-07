import { kakao, KakaoGeoType } from './kakao-instance';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'geo.json');
const arr: KakaoGeoType[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

async function getKakaoGeoRegionCode(x: string, y: string) {
  const query = new URLSearchParams({ x, y }).toString();
  return kakao
    .get(`/geo/coord2address.json?${query}`)
    .then((res) => res.data.documents);
}

const promises = arr.map((item) => getKakaoGeoRegionCode(item.x, item.y));

Promise.all(promises).then((res: [][]) => {
  const geo = [].concat(...res);
  // fs.writeFileSync('./mark-address.json', JSON.stringify(geo));
  console.log(geo);
});
