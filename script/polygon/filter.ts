import * as fs from 'fs';
import * as path from 'path';
import { Geo } from './geo.type';

const gufile = path.join(__dirname, 'korea-gu.geo.json');
const json = fs.readFileSync(gufile, 'utf-8');
const { features, ...other } = JSON.parse(json);
const geoArr: Geo[] = features;

// const songpa = geoArr.filter(({ properties }) => properties.sggnm === '송파구');
const seoulCity = geoArr.filter(
  ({ properties }) => properties.sidonm === '서울특별시',
);

const newData = {
  ...other,
  features: seoulCity,
};

fs.writeFileSync(
  path.join(__dirname, 'seoul-city.geo.json'),
  JSON.stringify(newData),
);
