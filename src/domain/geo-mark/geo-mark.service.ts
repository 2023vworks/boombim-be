import { Injectable } from '@nestjs/common';

import { Util } from '@app/common';
import { GetGeoMarksRequestDTO, GetGeoMarksResponseDTO } from './dto';
import { BaseGeoMarkRepository } from './geo-mark.repository';

export abstract class GeoMarkServiceUseCase {
  abstract getMarks(
    getDto: GetGeoMarksRequestDTO,
  ): Promise<GetGeoMarksResponseDTO[]>;
}

@Injectable()
export class GeoMarkService extends GeoMarkServiceUseCase {
  constructor(private readonly geoMarkRepo: BaseGeoMarkRepository) {
    super();
  }

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
