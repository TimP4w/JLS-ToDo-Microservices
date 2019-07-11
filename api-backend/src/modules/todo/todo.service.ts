import { Injectable, HttpException, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Todo } from '../../interfaces/todo.interface'
import { User } from '../../interfaces/user.interface';

import { CreateTodoDto } from './dtos/createTodo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserJwtDto } from '../user/dtos/userJwt.dto';
import { updateTodoDto } from './dtos/updateTodo.dto';
import { TodoDto } from './dtos/todo.dto';
import { TodoAndUserDto } from './dtos/todoAndUser.dto';
import { TODO_SERVICE } from './todo.constants';
import { ClientProxy } from '@nestjs/microservices';
import { GetAllTodosDto } from './dtos/getAllTodos.dto';
import { GetTodoDto } from './dtos/getTodo.dto';


@Injectable()
export class TodoService {
    constructor(
        @Inject(TODO_SERVICE) private readonly client: ClientProxy
    ) {}


    async create(user: UserJwtDto, todo: CreateTodoDto): Promise<TodoDto> {

        const pattern = { cmd: 'createTodo' };
        
        let data = todo;
        data.owner = user;
        return new Promise((resolve, reject) => {
            this.client.send<TodoDto>(pattern, data).subscribe(
                newTodo  => {
                    resolve(newTodo);
                },
                err => {
                    reject(err);
                }
            );
        }) 
    }

    async getAll(user: UserJwtDto): Promise<TodoDto[]> {
        const pattern = { cmd: 'getAllTodos' };
        let data: GetAllTodosDto = {
            owner : user
        };
        return new Promise((resolve, reject) => {
            this.client.send<TodoDto[]>(pattern, data).subscribe(
                todos  => {
                    resolve(todos);
                },
                err => {
                    console.error(err);
                    reject(err);
                }
            );
        }) 
    } 

    async getOne(id: string, user: UserJwtDto): Promise<TodoDto> {
        const pattern = { cmd: 'getTodo' };
        let data: GetTodoDto = {
            owner : user,
            id: id
        };
        return new Promise((resolve, reject) => {
            this.client.send<TodoDto>(pattern, data).subscribe(
                todo  => {
                    resolve(todo);
                },
                err => {
                    reject(err);
                }
            );
        }) 
    } 
 
    async delete(id: string, user: UserJwtDto): Promise<TodoDto> {
        const pattern = { cmd: 'deleteTodo' };
        let data: GetTodoDto = {
            owner : user,
            id: id
        };
        return new Promise((resolve, reject) => {
            this.client.send<TodoDto>(pattern, data).subscribe(
                todo  => {
                    resolve(todo);
                },
                err => {
                    reject(err);
                }
            );
        }) 
    }

    async update(id: string, todo: updateTodoDto, user: UserJwtDto): Promise<TodoDto> {
        const pattern = { cmd: 'updateTodo' };
        let data: GetTodoDto = {
            owner : user,
            id: id,
            task: {
                title: todo.title,
                date: todo.date,
                done: todo.done
            } 
        };
        return new Promise((resolve, reject) => {
            this.client.send<TodoDto>(pattern, data).subscribe(
                todo  => {
                    resolve(todo);
                },
                err => {
                    reject(err);
                }
            );
        }) 
    } 
 
}
