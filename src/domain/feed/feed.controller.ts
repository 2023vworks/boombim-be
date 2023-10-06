import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiControllerDocument,
  DefalutAppName,
  GetUserInfoDecorator,
  UPLOAD_FILES_NAME,
} from '@app/common';
import { FilesUploadInterceptor } from '@app/custom';

import { JwtGuard } from '../auth/guard';
import { DocumentHelper } from './document';
import {
  GetFeedActivationTimeResponseDTO,
  GetFeedCommentsRequestDTO,
  GetFeedCommentsResponseDTO,
  GetFeedResponseDTO,
  GetFeedsRequestDTO,
  GetFeedsResponseDTO,
  GetFeedsSearchRequestDTO,
  PostFeedCommentRequestDTO,
  PostFeedCommentResponseDTO,
  PostFeedReportRequestDTO,
  PostFeedRequestDTO,
  PostFeedResponseDTO,
} from './dto';
import { FeedService, FeedServiceToken } from './feed.service';

@ApiControllerDocument(`[${DefalutAppName}] feeds API`)
@Controller('/feeds')
@UseInterceptors(ClassSerializerInterceptor)
export class FeedController {
  constructor(
    @Inject(FeedServiceToken)
    private readonly feedService: FeedService,
  ) {}

  @DocumentHelper('getFeeds')
  @Get()
  async getFeeds(
    @Query() getDto: GetFeedsRequestDTO,
  ): Promise<GetFeedsResponseDTO[]> {
    return this.feedService.getFeeds(getDto);
  }

  @DocumentHelper('postFeeds')
  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(201)
  async postFeeds(
    @GetUserInfoDecorator('id') userId: number,
    @Body() postDto: PostFeedRequestDTO,
  ): Promise<PostFeedResponseDTO> {
    return this.feedService.createFeeds(userId, postDto);
  }

  @DocumentHelper('getFeed')
  @Get('/:id')
  async getFeed(
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<GetFeedResponseDTO> {
    return this.feedService.getFeed(feedId);
  }

  @DocumentHelper('getFeedsSearch')
  @Get('/search')
  async getFeedsSearch(
    @Query() getDto: GetFeedsSearchRequestDTO,
  ): Promise<GetFeedResponseDTO[]> {
    return this.feedService.getFeedsByGeoMarkId(getDto.geoMarkId);
  }

  @DocumentHelper('postFeedImages')
  @UseGuards(JwtGuard)
  @FilesUploadInterceptor(UPLOAD_FILES_NAME, { maxCount: 5 })
  @Post('/:id/images')
  @HttpCode(201)
  async postFeedImages(
    @Param('id', ParseIntPipe) feedId: number,
    @UploadedFiles() file: Express.Multer.File[],
  ): Promise<void> {
    return this.feedService.createFeedImages(feedId, file);
  }

  @DocumentHelper('getFeedActivationTime')
  @UseGuards(JwtGuard)
  @Get('/:id/activation-time')
  async getFeedActivationTime(
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    return this.feedService.getFeedActivationTime(feedId);
  }

  @DocumentHelper('getComments')
  @Get('/:id/comments')
  async getComments(
    @Param('id', ParseIntPipe) feedId: number,
    @Query() getDto: GetFeedCommentsRequestDTO,
  ): Promise<GetFeedCommentsResponseDTO[]> {
    return this.feedService.getComments(feedId, getDto);
  }

  @DocumentHelper('postComments')
  @UseGuards(JwtGuard)
  @Post('/:id/comments')
  @HttpCode(201)
  async postComments(
    @Param('id', ParseIntPipe) feedId: number,
    @Body() postDto: PostFeedCommentRequestDTO,
  ): Promise<PostFeedCommentResponseDTO> {
    return this.feedService.createComments(feedId, postDto);
  }

  @DocumentHelper('postRecommend')
  @UseGuards(JwtGuard)
  @Post('/:id/recommend')
  @HttpCode(201)
  async postRecommend(
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    return this.feedService.feedRecommend(feedId);
  }

  @DocumentHelper('postUnrecommend')
  @UseGuards(JwtGuard)
  @Post('/:id/unrecommend')
  @HttpCode(201)
  async postUnrecommend(
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    return this.feedService.feedUnrecommend(feedId);
  }

  @DocumentHelper('postReport')
  @UseGuards(JwtGuard)
  @Post('/:id/report')
  @HttpCode(204)
  async postReport(
    @Param('id', ParseIntPipe) feedId: number,
    @Body() postDto: PostFeedReportRequestDTO,
  ): Promise<void> {
    return this.feedService.feedReport(feedId, postDto);
  }
}
