import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import  { UserLoginDto } from '../user/dtos/userLogin.dto';
import { LoginDto } from './dtos/login.dto';
import { MessagePattern } from '@nestjs/microservices';
import { User } from 'src/interfaces/user.interface';


@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({cmd: 'loginUser'})
  async login(user: UserLoginDto): Promise<LoginDto> {
      return await this.authService.signIn(user.username, user.password);
  } 

  //Change to return DTO
  @MessagePattern({cmd: 'getUser'})
  async getUser(username: string): Promise<User> {
    return await this.authService.getUserByUsername(username);
  }
}
