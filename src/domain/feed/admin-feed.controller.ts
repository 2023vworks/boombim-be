import {
  ADMIN_ACCESS_TOKEN,
  ApiAuthDocument,
  ApiControllerDocument,
  DEFALUT_APP_NAME,
} from '@app/common';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { AdminFeedService, AdminFeedServiceToken } from './admin-feed.service';
import { AdminDocumentHelper } from './document';
import {
  AdminGetFeedsRequestDTO,
  AdminGetFeedsResponseDTO,
  AdminPatchFeedActivationRequestDTO,
} from './dto';

@ApiControllerDocument(`[${DEFALUT_APP_NAME}] Admin - feeds API`)
@ApiAuthDocument(ADMIN_ACCESS_TOKEN)
@Controller('/admin/feeds')
@UseInterceptors(ClassSerializerInterceptor)
export class AdminFeedController {
  constructor(
    @Inject(AdminFeedServiceToken)
    private readonly feedService: AdminFeedService,
  ) {}

  @AdminDocumentHelper('getFeeds')
  @Get()
  async getFeeds(
    @Query() getDto: AdminGetFeedsRequestDTO,
  ): Promise<AdminGetFeedsResponseDTO[]> {
    return this.feedService.getFeeds(getDto);
  }

  @AdminDocumentHelper('patchFeedActivation')
  @Patch('/:id/activation')
  @HttpCode(204)
  async patchFeedActivation(
    @Param('id', ParseIntPipe) feedId: number,
    @Body() patchDto: AdminPatchFeedActivationRequestDTO,
  ): Promise<void> {
    await this.feedService.patchFeedActivation(feedId, patchDto);
  }
}
