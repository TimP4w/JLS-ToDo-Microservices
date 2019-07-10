import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Todo } from '../../interfaces/todo.interface'
import { CreateTodoDto } from './dtos/createTodo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TodoDto } from './dtos/todo.dto';
import { TodoWithoutUserDto } from './dtos/todoWithoutUser.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TodoService {
    constructor(
        @InjectModel('Todo') private readonly todoModel: Model<Todo>,
    ) {}

    async create(todo: CreateTodoDto): Promise<TodoDto> {
        const createdTodo = new this.todoModel({
            title: todo.title,
            date: todo.date,
            owner: todo.owner
        });
        await createdTodo.save();
        return createdTodo; 
    }

    async getAll(owner: string): Promise<TodoDto[]> {
         return await this.todoModel.find({owner: owner});
    } 

    async getOne(id: string, owner: string): Promise<TodoDto> {
        const task = await this.todoModel.findById(id).exec();
        if (!task) {
            throw new RpcException("Task not found");
        } 
        if(task.owner !== owner) {
            throw new RpcException("Unauthorized");
        }
        return task
    }
    
    async delete(id: string, owner: string): Promise<TodoDto> {
        const task = await this.todoModel.findById(id).exec();
        if (!task) {
            throw new RpcException("Task not found");
        } 
        if(task.owner !== owner) {
            throw new RpcException("Unauthorized");
        }
        return task.remove();
    }

    async update(id: string, todo: TodoWithoutUserDto, owner: string): Promise<TodoDto> {
        const task = await this.todoModel.findById(id).exec();
        if (!task) {
            throw new RpcException("Task not found");
        } 
        if(task.owner !== owner) {
            throw new RpcException("Unauthorized");
        }
        task.title = todo.title;
        task.date = todo.date;
        task.done = todo.done;
        return task.save();
    } 
}
