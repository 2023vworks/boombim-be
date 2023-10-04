import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { ApiControllerDocument, DefalutAppName } from '@app/common';
import { GetGeoMarksRequestDTO, GetGeoMarksResponseDTO } from './domain/dto';
import { DocumentHelper } from './document';

@ApiControllerDocument(`[${DefalutAppName}] geo-marks API`)
@Controller('/geo-marks')
@UseInterceptors(ClassSerializerInterceptor)
export class GeoMarkController {
  @DocumentHelper('getGeoMarks')
  @Get()
  async getGeoMarks(
    @Query() getDto: GetGeoMarksRequestDTO,
  ): Promise<GetGeoMarksResponseDTO[]> {
    throw new NotFoundException('미구현 API');
  }
}
