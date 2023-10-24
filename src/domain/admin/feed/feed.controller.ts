import { ApiControllerDocument, DEFALUT_APP_NAME } from '@app/common';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AdminDocumentHelper } from './document';
import {
  AdminGetFeedsRequestDTO,
  AdminGetFeedsResponseDTO,
  AdminPatchFeedActivationRequestDTO,
} from './dto';
import { AdminJwtGuard } from 'src/domain/auth/guard';
import { FeedService, FeedServiceToken } from './feed.service';

@ApiControllerDocument(`[${DEFALUT_APP_NAME}] Admin - feeds API`)
@UseGuards(AdminJwtGuard)
@Controller('/admin/feeds')
@UseInterceptors(ClassSerializerInterceptor)
export class FeedController {
  constructor(
    @Inject(FeedServiceToken)
    private readonly feedService: FeedService,
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
