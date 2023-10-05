import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
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

@ApiControllerDocument(`[${DefalutAppName}] feeds API`)
@Controller('/feeds')
@UseInterceptors(ClassSerializerInterceptor)
export class FeedController {
  @DocumentHelper('getFeeds')
  @Get()
  async getFeeds(
    @Query() getDto: GetFeedsRequestDTO,
  ): Promise<GetFeedsResponseDTO[]> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('postFeeds')
  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(201)
  async postFeeds(
    @GetUserInfoDecorator('id') userId: number,
    @Body() postDto: PostFeedRequestDTO,
  ): Promise<PostFeedResponseDTO> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('getFeed')
  @Get('/:id')
  async getFeed(
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<GetFeedResponseDTO> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('getSearch')
  @Get('/search')
  async getSearch(
    @Query() getDto: GetFeedsSearchRequestDTO,
  ): Promise<GetFeedResponseDTO[]> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('postImages')
  @UseGuards(JwtGuard)
  @FilesUploadInterceptor(UPLOAD_FILES_NAME, { maxCount: 5 })
  @Post('/:id/images')
  @HttpCode(201)
  async postImages(
    @Param('id', ParseIntPipe) feedId: number,
    @UploadedFiles() file: Express.Multer.File[],
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('getComments')
  @Get('/:id/comments')
  async getComments(
    @Param('id', ParseIntPipe) feedId: number,
    @Query() getDto: GetFeedCommentsRequestDTO,
  ): Promise<GetFeedCommentsResponseDTO[]> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('postComments')
  @UseGuards(JwtGuard)
  @Post('/:id/comments')
  @HttpCode(201)
  async postComments(
    @Param('id', ParseIntPipe) feedId: number,
    @Body() postDto: PostFeedCommentRequestDTO,
  ): Promise<PostFeedCommentResponseDTO> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('postRecommend')
  @UseGuards(JwtGuard)
  @Post('/:id/recommend')
  @HttpCode(201)
  async postRecommend(
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('postUnrecommend')
  @UseGuards(JwtGuard)
  @Post('/:id/unrecommend')
  @HttpCode(201)
  async postUnrecommend(
    @Param('id', ParseIntPipe) feedId: number,
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('postReport')
  @UseGuards(JwtGuard)
  @Post('/:id/report')
  @HttpCode(201)
  async postReport(
    @Param('id', ParseIntPipe) feedId: number,
    @Body() postDto: PostFeedReportRequestDTO,
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }
}
