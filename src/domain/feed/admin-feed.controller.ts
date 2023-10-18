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

import {
  AdminGetFeedsRequestDTO,
  AdminGetFeedsResponseDTO,
  AdminPatchFeedActivationRequestDTO,
} from './dto';
import { FeedService, FeedServiceToken } from './feed.service';
import { AdminDocumentHelper } from './document';

@ApiControllerDocument(`[${DEFALUT_APP_NAME}] Admin - feeds API`)
@ApiAuthDocument(ADMIN_ACCESS_TOKEN)
@Controller('/admin/feeds')
@UseInterceptors(ClassSerializerInterceptor)
export class AdminFeedController {
  constructor(
    @Inject(FeedServiceToken)
    private readonly feedService: FeedService,
  ) {}

  @AdminDocumentHelper('getFeeds')
  @Get()
  async getFeeds(
    @Query() getDto: AdminGetFeedsRequestDTO,
  ): Promise<AdminGetFeedsResponseDTO[]> {
    throw new NotFoundException('미구현 API');
  }

  @AdminDocumentHelper('patchFeedActivation')
  @Patch('/:id/activation')
  @HttpCode(204)
  async patchFeedActivation(
    @Param('id', ParseIntPipe) feedId: number,
    @Body() patchDto: AdminPatchFeedActivationRequestDTO,
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }
}
