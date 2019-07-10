import { Injectable } from '@nestjs/common';

/* Database */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/* JWT */
import { JwtService } from '@nestjs/jwt';
import { User } from '../../interfaces/user.interface';
import { RpcException } from '@nestjs/microservices';
import { LoginDto } from '../auth/dtos/login.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<User>,
        //@Inject(forwardRef(() => UserService)) private readonly userService: AuthService
    ) {}

    generateToken(user: User): string {
      const jwtToken = { id: user.id, username: user.username};
      let token =  this.jwtService.sign(jwtToken);
      return token
    }

    generateRefreshToken(username: string): string {
      const jwtRefreshToken = { username: username};
      let options = {
        expiresIn: "1y",
      }
      let refreshToken = this.jwtService.sign(jwtRefreshToken, options)
      return refreshToken;
    }
  
   async refreshUserTokens(refreshToken) {
      try {
        let user = await this.userModel.findOne({refreshToken: refreshToken});
        if(!user) {
          throw new RpcException("Unauthorized");
        }
        let newToken = this.generateToken(user);
        let newRefreshToken = this.generateRefreshToken(user.username);
        await this.userModel.update({username: user.username}, {$set: {'refreshToken': newRefreshToken}}).exec();
        return {newToken, newRefreshToken};
      } catch (err) {
        throw new RpcException("Something went wrong while refreshing user tokens");
      }  
    }

    async signIn(username: string, password: string): Promise<LoginDto> {
      return new Promise(async (resolve, reject) => {
        if(!username || !password) {
          reject(new RpcException("Username and password cannot be empty"));
        }
        let jwtToken, refreshToken;
        this.getUserByUsername(username)
          .then((user) =>  {
            if(!user) {
              reject(new RpcException("Unauthorized"));
            }
            if (user.comparePassword(password)) {
              jwtToken = this.generateToken(user);
              refreshToken = this.generateRefreshToken(user.username);
              user.setRefreshToken(refreshToken);
              let tokens = {
                jwtToken,
                refreshToken, 
                expiresIn: 60 * 20
              }
              resolve(tokens);
            } else {
              reject(new RpcException("Unauthorized"));
            }
          })
          .catch((e) => {
            reject(e);
          })
      }) 
    }

    async getUserByUsername(username: string): Promise<User> {
      return await this.userModel.findOne({username: username});
    }

}
