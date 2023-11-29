import { addHours } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

import { Util } from '@app/common';
import {
  CoordType,
  FeedEntity,
  GeoMarkEntity,
  MbtiType,
  UserEntity,
} from '@app/entity';

import {
  GeoCoord2addressResponseDocument,
  GeoCoord2regioncodeResponseDocument,
} from 'kakao-local-rest-api-sdk';
import { EntityManager } from 'typeorm';
import { runOrm } from './run-orm';

const filePathRegion = path.join(__dirname, 'geo/mark-region-code.json');
const filePathAddress = path.join(__dirname, 'geo/mark-address.json');

const regionInfo: GeoCoord2regioncodeResponseDocument[] = JSON.parse(
  fs.readFileSync(filePathRegion, 'utf-8'),
);
const address: GeoCoord2addressResponseDocument[] = JSON.parse(
  fs.readFileSync(filePathAddress, 'utf-8'),
);

runOrm(async (txManager: EntityManager) => {
  const feedRepo = txManager.getRepository(FeedEntity);
  const useRepo = txManager.getRepository(UserEntity);
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
      activity: getRandomNumber(1, 35),
      content: '테스트' + (i + 1),
      activationAt: addHours(new Date(), 6),
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
});

function createGeoMark(
  regionInfo: GeoCoord2regioncodeResponseDocument,
  addresses: GeoCoord2addressResponseDocument,
): GeoMarkEntity {
  const { address, road_address } = addresses;

  const result: GeoMarkEntity = Util.toInstance(
    GeoMarkEntity,
    {
      x: +regionInfo.x,
      y: +regionInfo.y,
      type: CoordType.WGS84,
      point: {
        type: 'Point',
        coordinates: [+regionInfo.x, +regionInfo.y],
      },
      srid: 4326,
      regionInfo: {
        regionType: regionInfo.region_type as any,
        code: regionInfo.code,
        addressName: regionInfo.address_name,
        region1DepthName: regionInfo.region_1depth_name,
        region2DepthName: regionInfo.region_2depth_name,
        region3DepthName: regionInfo.region_3depth_name,
        region4DepthName: regionInfo.region_4depth_name,
        x: +regionInfo.x,
        y: +regionInfo.y,
      },
      address: {
        addressName: address.address_name,
        region1DepthName: address.region_1depth_name,
        region2DepthName: address.region_2depth_name,
        region3DepthName: address.region_3depth_name,
        mountainYn: address.mountain_yn as any,
        mainAddressNo: address.main_address_no,
        subAddressNo: address.sub_address_no,
      },
      roadAddress: road_address && {
        addressName: road_address.address_name,
        region1DepthName: road_address.region_1depth_name,
        region2DepthName: road_address.region_2depth_name,
        region3DepthName: road_address.region_3depth_name,
        roadName: road_address.road_name,
        undergroundYn: road_address.underground_yn,
        mainBuildingNo: road_address.main_building_no,
        subBuildingNo: road_address.sub_building_no,
        buildingName: road_address.building_name,
        zoneNo: road_address.zone_no,
      },
    },
    {
      ignoreDecorators: true,
    },
  );

  return {
    ...result,
    point: {
      type: 'Point',
      coordinates: [+regionInfo.x, +regionInfo.y],
    },
  };
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
