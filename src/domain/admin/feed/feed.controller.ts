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

import { AdminJwtGuard } from 'src/domain/auth/guard';
import { AdminDocumentHelper } from './document';
import {
  AdminGetFeedResponseDTO,
  AdminGetFeedsRequestDTO,
  AdminGetFeedsWithCountResponseDTO,
  AdminPatchFeedActivationRequestDTO,
} from './dto';
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
  ): Promise<AdminGetFeedsWithCountResponseDTO> {
    return this.feedService.getFeeds(getDto);
  }

  @AdminDocumentHelper('getFeed')
  @Get('/:id')
  async getFeed(
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<AdminGetFeedResponseDTO> {
    return this.feedService.getFeed(feedId);
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
