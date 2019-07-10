import { Controller, Post, Body, Inject, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto'
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from './auth.constants';


import { UserSafeDataDto } from './dtos/userSafeData.dto';

@Controller('')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async new(@Body() userDto: UserDto): Promise<UserSafeDataDto> {
    return new Promise((resolve, reject) => {
      this.userService.create(userDto)
        .then((usr) => {
          resolve(usr);
        })
        .catch((e) => {
          reject(new HttpException(e.message, 400))
        })
      })
  }
}
