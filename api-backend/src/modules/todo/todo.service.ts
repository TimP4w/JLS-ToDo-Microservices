import { Injectable, Inject } from '@nestjs/common';
import { CreateTodoDto } from './dtos/createTodo.dto';
import { UserJwtDto } from '../user/dtos/userJwt.dto';
import { updateTodoDto } from './dtos/updateTodo.dto';
import { TodoDto } from './dtos/todo.dto';
import { TODO_SERVICE } from './todo.constants';
import { ClientProxy } from '@nestjs/microservices';
import { GetAllTodosDto } from './dtos/getAllTodos.dto';


@Injectable()
export class TodoService {
    constructor(
        @Inject(TODO_SERVICE) private readonly client: ClientProxy
    ) {}


    async create(user: UserJwtDto, todo: CreateTodoDto): Promise<TodoDto> {
        const pattern = { cmd: 'createTodo' };
        todo.owner = user._id;
        let data = todo;
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
            owner : user._id
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
        let data = {
            owner: user._id,
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
        let data = {
            owner: user._id,
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
        let data = {
            owner: user._id,
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
