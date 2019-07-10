import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreatedDto } from './dtos/user-created.dto'

import { User } from '../../interfaces/user.interface';
import { UserSafeDataDto } from './dtos/userSafeData.dto';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { UserDto } from './dtos/user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({cmd: 'createUser'})
  async create(userCreatedDto: UserCreatedDto): Promise<UserDto> {
    try {
      return this.userService.create(userCreatedDto);
    } catch(e) {
      console.log(e);
      //throw new HttpException(e.response, e.status);
    }
  }

}
