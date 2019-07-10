import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import  { UserLoginDto } from '../user/dtos/userLogin.dto';
import { LoginDto } from './dtos/login.dto';

//@UseInterceptors(CorsInterceptor)
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() user: UserLoginDto): Promise<LoginDto> {

    return new Promise(async (resolve, reject) => {
       await this.authService.signIn(user.username, user.password)
        .then((loggedIn) => {
          resolve(loggedIn);
        })
        .catch((e) => {
          reject(new HttpException(e.message, 400))
        })
      })

  }  
}
