import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { ApiControllerDocument, DEFALUT_APP_NAME } from '@app/common';
import { DocumentHelper } from './document';
import { GetGeoMarksRequestDTO, GetGeoMarksResponseDTO } from './dto';
import { GeoMarkServiceUseCase } from './geo-mark.service';

@ApiControllerDocument(`[${DEFALUT_APP_NAME}] geo-marks API`)
@Controller('/geo-marks')
@UseInterceptors(ClassSerializerInterceptor)
export class GeoMarkController {
  constructor(private readonly geoMarkService: GeoMarkServiceUseCase) {}

  @DocumentHelper('getGeoMarks')
  @Get()
  async getGeoMarks(
    @Query() getDto: GetGeoMarksRequestDTO,
  ): Promise<GetGeoMarksResponseDTO[]> {
    return this.geoMarkService.getMarks(getDto);
  }
}
