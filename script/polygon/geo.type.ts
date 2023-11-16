export type Geo = {
  type: string;
  properties: {
    /** 시동구 */
    adm_nm: string;
    adm_cd: string;
    adm_cd2: string;
    sgg: string;
    sido: string;
    /** 시 */
    sidonm: string;
    /** 구 동 */
    temp: string;
    /** 구 */
    sggnm: string;
    adm_cd8: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
};
