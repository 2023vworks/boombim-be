import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { DocumentHelper } from './document';
import { ApiControllerDocument, DefalutAppName } from '@app/common';
import {
  GetUserResponseDTO,
  PostUsersRequestDTO,
  PostUsersResponseDTO,
} from './dto';

@ApiControllerDocument(`[${DefalutAppName}] users API`)
@Controller('/users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  @DocumentHelper('postUsers')
  @Post()
  @HttpCode(201)
  async postUsers(
    @Body() postDto: PostUsersRequestDTO,
  ): Promise<PostUsersResponseDTO> {
    throw new NotFoundException('미구현 API 입니다.');
  }

  @DocumentHelper('getUserMe')
  @Get('/me')
  async getUserMe(): Promise<GetUserResponseDTO> {
    throw new NotFoundException('미구현 API 입니다.');
  }
}
