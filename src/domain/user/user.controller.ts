import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { ApiControllerDocument, DefalutAppName } from '@app/common';
import { DocumentHelper } from './document';
import {
  GetUserResponseDTO,
  PostUsersRequestDTO,
  PostUsersResponseDTO,
} from './domain/dto';
import { UserService, UserServiceToken } from './user.service';

@ApiControllerDocument(`[${DefalutAppName}] users API`)
@Controller('/users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
  ) {}

  @DocumentHelper('postUsers')
  @Post()
  @HttpCode(201)
  async postUsers(
    @Body() postDto: PostUsersRequestDTO,
  ): Promise<PostUsersResponseDTO> {
    return this.userService.createUser(postDto);
  }

  @DocumentHelper('getUserMe')
  @Get('/me')
  async getUserMe(): Promise<GetUserResponseDTO> {
    return this.userService.getUser(1);
  }
}
