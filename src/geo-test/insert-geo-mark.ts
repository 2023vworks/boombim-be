import { Util } from '@app/common';
import {
  CoordType,
  FeedEntity,
  GeoMarkEntity,
  MbtiType,
  UserEntity,
} from '@app/entity';
import { addHours } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import {
  KakaoGeoAddress,
  KakaoGeoRegionCode,
  KakaoGeoRoadAddress,
} from './kakao-instance';

type KakaoGeoAddresses = {
  address: KakaoGeoAddress;
  road_address?: KakaoGeoRoadAddress;
};

const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logging: 'all',
  entities: [`${__dirname}/.././entity/**/*.entity{.ts,.js}`],
  dropSchema: false,
  synchronize: false,
});

const filePathRegion = path.join(__dirname, 'mark-region-code.json');
const filePathAddress = path.join(__dirname, 'mark-address.json');

const regionInfo: KakaoGeoRegionCode[] = JSON.parse(
  fs.readFileSync(filePathRegion, 'utf-8'),
);
const address: KakaoGeoAddresses[] = JSON.parse(
  fs.readFileSync(filePathAddress, 'utf-8'),
);

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');
    const feedRepo = AppDataSource.getRepository(FeedEntity);
    const useRepo = AppDataSource.getRepository(UserEntity);
    const user = useRepo.create({
      nickname: 'test',
      mbtiType: MbtiType.ENFJ,
      token: '',
      accessedAt: new Date(),
      feedWritingCount: 5,
      feedWritingCountRechargeStartAt: new Date(),
      feeds: [],
      comments: [],
      recommendHistories: [],
      reportHistories: [],
    });
    const { id } = await useRepo.save(user);

    const promises = address.map((_, i) => {
      const feed = feedRepo.create({
        user: { id },
        activity: 1,
        content: '테스트',
        activationAt: addHours(new Date(), 6),
        // isActive: true,
        recommendCount: 0,
        unrecommendCount: 0,
        reportCount: 0,
        viewCount: 0,
        commentCount: 0,
        geoMark: createGeoMark(regionInfo[i], address[i]),
      });
      return feedRepo.save(feed);
    });

    await Promise.all(promises);
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

function createGeoMark(
  regionInfo: KakaoGeoRegionCode,
  addresses: KakaoGeoAddresses,
): GeoMarkEntity {
  const { address, road_address } = addresses;
  const result: GeoMarkEntity = Util.toInstance(GeoMarkEntity, {
    x: +regionInfo.x,
    y: +regionInfo.y,
    type: CoordType.WGS84,
    srid: 4326,
    regionInfo: {
      regionType: regionInfo.region_type,
      code: regionInfo.code,
      addressName: regionInfo.address_name,
      region1depthName: regionInfo.region_1depth_name,
      region2depthName: regionInfo.region_2depth_name,
      region3depthName: regionInfo.region_3depth_name,
      region4depthName: regionInfo.region_4depth_name,
      x: +regionInfo.x,
      y: +regionInfo.y,
    },
    address: {
      addressName: address.address_name,
      region1depthName: address.region_1depth_name,
      region2depthName: address.region_2depth_name,
      region3depthName: address.region_3depth_name,
      mountainYn: address.mountain_yn,
      mainAddressNo: address.main_address_no,
      subAddressNo: address.sub_address_no,
      zipCode: address.zip_code,
    },
    roadAddress: road_address && {
      addressName: road_address.address_name,
      region1depthName: road_address.region_1depth_name,
      region2depthName: road_address.region_2depth_name,
      region3depthName: road_address.region_3depth_name,
      roadName: road_address.road_name,
      undergroundYn: road_address.underground_yn,
      mainBuildingNo: road_address.main_building_no,
      subBuildingNo: road_address.sub_building_no,
      buildingName: road_address.building_name,
      zoneNo: road_address.zone_no,
    },
  });

  return {
    ...result,
    point: {
      type: 'Point',
      coordinates: [+regionInfo.x, +regionInfo.y],
    },
  };
}
