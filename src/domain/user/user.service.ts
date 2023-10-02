import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  GetUserResponseDTO,
  PostUsersRequestDTO,
  PostUsersResponseDTO,
} from './domain/dto';
import { UserRepository, UserRepositoryToken } from './user.repository';

export const UserServiceToken = Symbol('UserServiceToken');
export interface UserService {
  createUser(postDto: PostUsersRequestDTO): Promise<PostUsersResponseDTO>;
  getUser(userId: number): Promise<GetUserResponseDTO>;
}

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(
    postDto: PostUsersRequestDTO,
  ): Promise<PostUsersResponseDTO> {
    throw new NotFoundException('미구현 API');
  }

  async getUser(userId: number): Promise<GetUserResponseDTO> {
    throw new NotFoundException('미구현 API');
  }
}
