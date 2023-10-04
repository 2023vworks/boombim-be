import axios from 'axios';

type KakaoGeoType = {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
};

type KakaoGeoRegionCode = {
  region_type: string;
  code: string;
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  x: string;
  y: string;
};

type KakaoGeoAddress = {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  mountain_yn?: string;
  main_address_no?: string;
  sub_address_no?: string;
  zip_code?: string;
};

type KakaoGeoRoadAddress = {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  road_name: string;
  underground_yn: string;
  main_building_no: string;
  sub_building_no: string;
  building_name: string;
  zone_no: string;
};

const kakao = axios.create({
  baseURL: 'https://dapi.kakao.com/v2/local',
});
kakao.interceptors.request.use((config) => {
  return {
    ...config,
    headers: { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` },
  };
});

export {
  kakao,
  KakaoGeoType,
  KakaoGeoRegionCode,
  KakaoGeoAddress,
  KakaoGeoRoadAddress,
};
