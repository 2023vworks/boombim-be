import { createAdmin } from './create-admin';
import { createPolyGonInfo } from './create-polygon-info';
import { runOrm } from './run-orm';

runOrm([createAdmin, createPolyGonInfo]).then(() =>
  console.log(`✅ APP 실행을 위한 초기 데이터 생성완료
- createAdmin: 관리자 데이터 생성
- createPolyGonInfo: 서비스 지역 행정동 폴리곤 생성
  `),
);
