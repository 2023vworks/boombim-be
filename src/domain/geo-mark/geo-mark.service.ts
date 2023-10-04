import { Inject, Injectable } from '@nestjs/common';

import { Util } from '@app/common';
import { GetGeoMarksRequestDTO, GetGeoMarksResponseDTO } from './domain';
import {
  GeoMarkRepository,
  GeoMarkRepositoryToken,
} from './geo-mark.repository';

export const GeoMarkServiceToken = Symbol('GeoMarkServiceToken');
export interface GeoMarkService {
  getMarks(getDto: GetGeoMarksRequestDTO): Promise<GetGeoMarksResponseDTO[]>;
}

@Injectable()
export class GeoMarkServiceImpl implements GeoMarkService {
  constructor(
    @Inject(GeoMarkRepositoryToken)
    private readonly geoMarkRepo: GeoMarkRepository,
  ) {}

  async getMarks(
    getDto: GetGeoMarksRequestDTO,
  ): Promise<GetGeoMarksResponseDTO[]> {
    const geoMarks =
      getDto.testType === 'Polygon'
        ? await this.geoMarkRepo.findByPolygon(getDto)
        : await this.geoMarkRepo.findByCoordinates(getDto);
    return Util.toInstance(GetGeoMarksResponseDTO, geoMarks);
  }
}
