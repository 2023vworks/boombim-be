import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiControllerDocument,
  DefalutAppName,
  GetUserInfoDecorator,
} from '@app/common';
import { DocumentHelper } from './document';
import {
  GetUserResponseDTO,
  PostUsersRequestDTO,
  PostUsersResponseDTO,
} from './domain/dto';
import { UserService, UserServiceToken } from './user.service';
import { JwtGuard } from '../auth/guard';

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
  @UseGuards(JwtGuard)
  @Get('/me')
  async getUserMe(
    @GetUserInfoDecorator('id') userId: number,
  ): Promise<GetUserResponseDTO> {
    return this.userService.getUser(userId);
  }
}
