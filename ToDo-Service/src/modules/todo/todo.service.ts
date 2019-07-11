import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Todo } from '../../interfaces/todo.interface'
import { CreateTodoDto } from './dtos/createTodo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TodoDto } from './dtos/todo.dto';
import { TodoWithoutUserDto } from './dtos/todoWithoutUser.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TodoService {
    constructor(
        @InjectModel('Todo') private readonly todoModel: mongoose.Model<Todo>,
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
        try {
            var taskId = mongoose.Types.ObjectId(id);
        } catch (e) {
            throw new RpcException("{\"response\": \"Bad task ID\", \"status\": 400}");
        }
        const task = await this.todoModel.findById(taskId).exec();

        if (!task) {
            throw new RpcException("{\"response\": \"Task not found\", \"status\": 404}");
        } 
        if(task.owner !== owner) {
            throw new RpcException("{\"response\": \"Unauthorized\", \"status\": 401}");
        }
        return task
    }
    
    async delete(id: string, owner: string): Promise<TodoDto> {
        try {
            var taskId = mongoose.Types.ObjectId(id);
        } catch (e) {
            throw new RpcException("{\"response\": \"Bad task ID\", \"status\": 400}");
        }
        const task = await this.todoModel.findById(taskId).exec();
        if (!task) {
            throw new RpcException("{\"response\": \"Task not found\", \"status\": 404}");        
        }
        if(task.owner !== owner) {
            throw new RpcException("{\"response\": \"Unauthorized\", \"status\": 401}");
        }
        return task.remove();
    }

    async update(id: string, todo: TodoWithoutUserDto, owner: string): Promise<TodoDto> {
        try {
            var taskId = mongoose.Types.ObjectId(id);
        } catch (e) {
            throw new RpcException("{\"response\": \"Bad task ID\", \"status\": 400}");
        }
        const task = await this.todoModel.findById(taskId).exec();
        if (!task) {
            throw new RpcException("{\"response\": \"Task not found\", \"status\": 404}");        
        } 
        if(task.owner !== owner) {
            throw new RpcException("{\"response\": \"Unauthorized\", \"status\": 401}");
        }
        task.title = todo.title;
        task.date = todo.date;
        task.done = todo.done;
        return task.save();
    } 
}
