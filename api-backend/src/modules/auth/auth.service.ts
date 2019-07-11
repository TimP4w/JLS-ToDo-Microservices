import { Injectable, UnauthorizedException, HttpException, Inject, forwardRef } from '@nestjs/common';

/* JWT */
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

import { User } from '../../interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { AUTH_SERVICE } from '../user/auth.constants';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dtos/login.dto';


@Injectable()
export class AuthService {
    constructor(
         private readonly jwtService: JwtService,
        // @Inject(forwardRef(() => UserService)) private readonly userService: AuthService,
         @Inject(AUTH_SERVICE) private readonly client: ClientProxy
    ) {}

    async signIn(username: string, password: string): Promise<LoginDto> {
      if(!username || !password) {
        throw new HttpException("Username and password cannot be empty", 400);
      }
      const pattern = { cmd: 'loginUser' };
      const data = {username: username, password: password};
      return new Promise(async (resolve, reject) => {
         await this.client.send<LoginDto>(pattern, data).subscribe(
              loggedIn  => {
                  resolve(loggedIn);
              },
              err => {
                  reject(err);
              }
          );
      }) 
    }
    
    async validateUser(payload: JwtPayload): Promise<JwtPayload> {
      return new Promise(async (resolve, reject) => {
        const pattern = { cmd: 'getUser' };
        await this.client.send(pattern, "").subscribe(
             user  => {
               if(user) {
                 resolve(payload);
               } else {
                reject(new HttpException("User not found", 401));
              }
             },
             err => {
                 reject(err);
             }
         );
     }) 
    }

/*
   async refreshUserTokens(refreshToken) {
      try {
        let user = await this.userModel.findOne({refreshToken: refreshToken});
        if(!user) {
          throw new UnauthorizedException();    
        }
        let newToken = this.generateToken(user);
        let newRefreshToken = this.generateRefreshToken(user.username);
        await this.userModel.update({username: user.username}, {$set: {'refreshToken': newRefreshToken}}).exec();
        return {newToken, newRefreshToken};
      } catch (err) {
          throw new HttpException("Something went wrong while refreshing the user tokens", 500);
      }  
    }

    async getUserByUsernameAndPlainPassword(username: string, password: string): Promise<User> {

      let user = await this.userModel.findOne({username: username});
      if(!user) {
        throw new HttpException("User not found", 404);
      }
      const checkPassword = bcrypt.compareSync(password, user.password);
      if (user && checkPassword) {
          return user;
      } else {
        throw new UnauthorizedException();    
      }
    
    }



    async getUserByUsername(username: string): Promise<User> {
      let user: User;
      try {
        user = await this.userModel.findOne({username: username});
        if(!user) {
          throw new HttpException("User not found", 404);
        }
        return user;
      } catch(e) {
        throw new HttpException("Error retrieving user", 500);
      }
    }

    async validateUser(payload: JwtPayload): Promise<User> {
      const username = payload.username;
      try {
        return await this.userModel.findOne({username: username}).exec();
      } catch(e) {
        throw new HttpException("Error validating user", 500);
      }
    }  */

}
