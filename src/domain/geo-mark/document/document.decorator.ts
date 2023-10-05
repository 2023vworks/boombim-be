import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { successMessage } from '@app/common';
import { GetGeoMarksResponseDTO } from '../domain';
import { GeoMarkController } from '../geo-mark.controller';

type API_DOC_TYPE = keyof GeoMarkController;

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  getGeoMarks: () =>
    applyDecorators(
      ApiOperation({ summary: '지도 마커 리스트 조회' }),
      ApiCreatedResponse({
        description: successMessage.S200_GEO_MARK_001,
        type: GetGeoMarksResponseDTO,
      }),
    ),
};

export const DocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
