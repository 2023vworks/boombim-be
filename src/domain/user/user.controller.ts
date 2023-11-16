import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiControllerDocument,
  DEFALUT_APP_NAME,
  GetUserInfoDecorator,
} from '@app/common';
import { DocumentHelper } from './document';
import {
  GetUserFeedsResponseDTO,
  GetUserResponseDTO,
  PostUsersRequestDTO,
  PostUsersResponseDTO,
} from './dto';
import { UserService, UserServiceToken } from './user.service';
import { JwtGuard } from '../auth/guard';

@ApiControllerDocument(`[${DEFALUT_APP_NAME}] users API`)
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

  @DocumentHelper('getUser')
  @UseGuards(JwtGuard)
  @Get('/me')
  async getUser(
    @GetUserInfoDecorator('id') userId: number,
  ): Promise<GetUserResponseDTO> {
    return this.userService.getUser(userId);
  }

  @DocumentHelper('getUserFeeds')
  @UseGuards(JwtGuard)
  @Get('/me/feeds')
  async getUserFeeds(
    @GetUserInfoDecorator('id') userId: number,
  ): Promise<GetUserFeedsResponseDTO[]> {
    return this.userService.getUserFeeds(userId);
  }

  @DocumentHelper('deleteUser')
  @UseGuards(JwtGuard)
  @Delete('/me')
  @HttpCode(204)
  async deleteUser(@GetUserInfoDecorator('id') userId: number): Promise<void> {
    await this.userService.sofeDeleteUser(userId);
  }

  @DocumentHelper('postUserRenew')
  @UseGuards(JwtGuard)
  @Post('/renew')
  async postUserRenew(
    @GetUserInfoDecorator('id') userId: number,
    @Body() postDto: PostUsersRequestDTO,
  ): Promise<PostUsersResponseDTO> {
    return this.userService.createUser(postDto, userId);
  }
}
