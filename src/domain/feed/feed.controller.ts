import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiControllerDocument,
  DEFALUT_APP_NAME,
  GetUserInfoDecorator,
  UPLOAD_FILES_NAME,
  UploadedFiles,
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
import { FeedServiceUseCase } from './feed.service';

@ApiControllerDocument(`[${DEFALUT_APP_NAME}] feeds API`)
@Controller('/feeds')
@UseInterceptors(ClassSerializerInterceptor)
export class FeedController {
  constructor(private readonly feedService: FeedServiceUseCase) {}

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
    return this.feedService.createFeed(userId, postDto);
  }

  @DocumentHelper('getFeedsSearch')
  @Get('/search')
  async getFeedsSearch(
    @Query() getDto: GetFeedsSearchRequestDTO,
  ): Promise<GetFeedResponseDTO[]> {
    return this.feedService.getFeedsByGeoMarkId(getDto.geoMarkId);
  }

  @DocumentHelper('getFeed')
  @Get('/:id')
  async getFeed(
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<GetFeedResponseDTO> {
    return this.feedService.getFeed(feedId);
  }

  @DocumentHelper('postFeedImages')
  @UseGuards(JwtGuard)
  @FilesUploadInterceptor(UPLOAD_FILES_NAME, { maxCount: 5 })
  @Post('/:id/images')
  @HttpCode(201)
  async postFeedImages(
    @GetUserInfoDecorator('id') userId: number,
    @Param('id', ParseIntPipe) feedId: number,
    @UploadedFiles() file: Express.Multer.File[],
  ): Promise<void> {
    await this.feedService.createFeedImages(userId, feedId, file);
  }

  @DocumentHelper('getFeedActivationTime')
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
    @GetUserInfoDecorator('id') userId: number,
    @Param('id', ParseIntPipe) feedId: number,
    @Body() postDto: PostFeedCommentRequestDTO,
  ): Promise<PostFeedCommentResponseDTO> {
    return this.feedService.createComment(userId, feedId, postDto);
  }

  @DocumentHelper('postRecommend')
  @UseGuards(JwtGuard)
  @Post('/:id/recommend')
  @HttpCode(201)
  async postRecommend(
    @GetUserInfoDecorator('id') userId: number,
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    return this.feedService.feedRecommend(userId, feedId);
  }

  @DocumentHelper('postUnrecommend')
  @UseGuards(JwtGuard)
  @Post('/:id/unrecommend')
  @HttpCode(201)
  async postUnrecommend(
    @GetUserInfoDecorator('id') userId: number,
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<GetFeedActivationTimeResponseDTO> {
    return this.feedService.feedUnrecommend(userId, feedId);
  }

  @DocumentHelper('postReport')
  @UseGuards(JwtGuard)
  @Post('/:id/report')
  @HttpCode(204)
  async postReport(
    @GetUserInfoDecorator('id') userId: number,
    @Param('id', ParseIntPipe) feedId: number,
    @Body() postDto: PostFeedReportRequestDTO,
  ): Promise<void> {
    return this.feedService.feedReport(userId, feedId, postDto);
  }
}
