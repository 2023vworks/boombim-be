import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import {
  ApiAuthDocument,
  ApiFiles,
  errorMessage,
  successMessage,
  UPLOAD_FILES_NAME,
  USER_ACCESS_TOKEN,
} from '@app/common';
import {
  GetFeedActivationTimeResponseDTO,
  GetFeedCommentsRequestDTO,
  GetFeedResponseDTO,
  GetFeedsResponseDTO,
  PostFeedCommentResponseDTO,
  PostFeedResponseDTO,
} from '../dto';
import { FeedController } from '../feed.controller';

type API_DOC_TYPE = keyof FeedController;

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  getFeeds: () =>
    applyDecorators(
      ApiOperation({ summary: '피드 리스트 조회' }),
      ApiOkResponse({
        description: successMessage.S200_FEED_001,
        type: [GetFeedsResponseDTO],
        // schema: {
        //   type: 'array',
        //   items: {
        //     oneOf: refs(GetFeedsResponseDTO, GetFeedsByGeoMarkIdResponseDTO),
        //   },
        // },
      }),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
    ),
  postFeeds: () =>
    applyDecorators(
      ApiOperation({ summary: '피드 생성' }),
      ApiCreatedResponse({
        description: successMessage.S201_FEED_001,
        type: PostFeedResponseDTO,
      }),
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
    ),
  getFeed: () =>
    applyDecorators(
      ApiOperation({ summary: '피드 상세 조회' }),
      ApiOkResponse({
        description: successMessage.S200_FEED_003,
        type: GetFeedResponseDTO,
      }),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
      ApiNotFoundResponse({ description: errorMessage.E404_FEED_001 }),
    ),
  getFeedsSearch: () =>
    applyDecorators(
      ApiOperation({ summary: '피드 검색 - 마커 ID로 피드 조회' }),
      ApiOkResponse({
        description: successMessage.S200_FEED_002,
        type: [GetFeedResponseDTO],
      }),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
    ),
  postFeedImages: () =>
    applyDecorators(
      ApiOperation({ summary: '단일 피드 이미지 추가(최대 5개)' }),
      ApiNoContentResponse({
        description: successMessage.S204_FEED_001,
      }),
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiFiles(UPLOAD_FILES_NAME),
      ApiNotFoundResponse({ description: errorMessage.E404_FEED_001 }),
    ),
  getFeedActivationTime: () =>
    applyDecorators(
      ApiOperation({ summary: '단일 피드 활성 시간 조회' }),
      ApiOkResponse({
        description: successMessage.S200_FEED_005,
        type: GetFeedActivationTimeResponseDTO,
      }),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
      ApiNotFoundResponse({ description: errorMessage.E404_FEED_001 }),
    ),
  getComments: () =>
    applyDecorators(
      ApiOperation({ summary: '단일 피드 댓글 리스트 조회' }),
      ApiOkResponse({
        description: successMessage.S200_FEED_004,
        type: [GetFeedCommentsRequestDTO],
      }),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
      ApiNotFoundResponse({ description: errorMessage.E404_FEED_001 }),
    ),
  postComments: () =>
    applyDecorators(
      ApiOperation({ summary: '단일 피드에 댓글 생성' }),
      ApiCreatedResponse({
        description: successMessage.S201_FEED_002,
        type: PostFeedCommentResponseDTO,
      }),
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
      ApiNotFoundResponse({ description: errorMessage.E404_FEED_001 }),
    ),
  postRecommend: () =>
    applyDecorators(
      ApiOperation({ summary: '피드 추천' }),
      ApiCreatedResponse({
        description: successMessage.S204_FEED_002,
        type: GetFeedActivationTimeResponseDTO,
      }),
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
      ApiNotFoundResponse({ description: errorMessage.E404_FEED_001 }),
    ),
  postUnrecommend: () =>
    applyDecorators(
      ApiOperation({ summary: '피드 비추천' }),
      ApiCreatedResponse({
        description: successMessage.S204_FEED_003,
        type: GetFeedActivationTimeResponseDTO,
      }),
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
      ApiNotFoundResponse({ description: errorMessage.E404_FEED_001 }),
    ),
  postReport: () =>
    applyDecorators(
      ApiOperation({ summary: '피드 신고' }),
      ApiNoContentResponse({ description: successMessage.S204_FEED_004 }),
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiBadRequestResponse({ description: errorMessage.E400_APP_001 }),
      ApiNotFoundResponse({ description: errorMessage.E404_FEED_001 }),
    ),
};

export const DocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
