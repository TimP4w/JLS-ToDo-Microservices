import { Injectable, HttpException, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';

import * as bcrypt from "bcryptjs";

import { User } from '../../interfaces/user.interface';
import { UserDto } from './dtos/user.dto';

import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { UserCreatedDto } from './dtos/user-created.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
    ) {}

    async create(user: UserCreatedDto): Promise<UserDto> {
        if (!user.username || !user.password) {
            throw new RpcException('Username and password cannot be empty');
        }

        let usr = await this.getUserByUsername(user.username);

        if(usr) {
            throw new RpcException('User already exists');
        }

        let newUser = {
            username: user.username,
            password: bcrypt.hashSync(user.password, 8),
            refreshToken: this.authService.generateRefreshToken(user.username)
        }; 

        const createdUser = new this.userModel(newUser)
        return await createdUser.save();
    }

    async getUserByUsername(username: string): Promise<User> {
        let user: User;
        user = await this.userModel.findOne({username: username});
        return user;
    } 

}
