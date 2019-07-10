import { Injectable, HttpException, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';

import * as bcrypt from "bcryptjs";

import { User } from '../../interfaces/user.interface';
import { UserDto } from './dtos/user.dto';

import { AuthService } from '../auth/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from './auth.constants';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserSafeDataDto } from './dtos/userSafeData.dto';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
    constructor(
        @Inject(AUTH_SERVICE) private readonly client: ClientProxy

    ) {}

    async create(user: CreateUserDto): Promise<UserSafeDataDto> {
        const pattern = { cmd: 'createUser' };
        const data = user;
        return new Promise((resolve, reject) => {
            this.client.send<CreateUserDto>(pattern, data).subscribe(
                newUser  => {
                    resolve(newUser);
                },
                err => {
                    reject(err);
                }
            );
        }) 

    } 

/*     async getUserByUsername(username: string): Promise<User> {

    } 
 */
}
