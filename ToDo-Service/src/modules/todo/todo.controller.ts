import { Controller } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dtos/createTodo.dto'
import { updateTodoDto } from './dtos/updateTodo.dto';
import { TodoDto } from './dtos/todo.dto';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { GetAllTodosDto } from './dtos/getAllTodos.dto';
import { GetTodoDto } from './dtos/getTodo.dto';


@Controller('')
export class TodoController {
  constructor( 
    private readonly todoService: TodoService
  ) {}

  @MessagePattern({cmd: 'createTodo'})
  create(todo: CreateTodoDto): Promise<TodoDto> {
    try {

    } catch(e) {
      throw new RpcException(e.response);
    }
    return this.todoService.create(todo);
  }

  @MessagePattern({cmd: 'getAllTodos'})
  async findAll(owner: GetAllTodosDto): Promise<TodoDto[]> {
    try {
      return this.todoService.getAll(owner.owner);
    } catch(e) {
      throw new RpcException(e.response);
    }
  }

  @MessagePattern({cmd: 'getTodo'})
  findOne(todo: GetTodoDto): Promise<TodoDto> {
    try {
      return this.todoService.getOne(todo.id, todo.owner);
    } catch(e) {
      throw new RpcException(e.response);
    }
  }

  @MessagePattern({cmd: 'deleteTodo'})
  delete(todo: GetTodoDto): Promise<TodoDto> {
    try {
      return this.todoService.delete(todo.id, todo.owner);
    } catch(e) {
      throw new RpcException(e.response);
    }
  }
  
  @MessagePattern({cmd: 'updateTodo'})
  update(todo: updateTodoDto): Promise<TodoDto> {
    try {
      return this.todoService.update(todo.id, todo.data, todo.owner);
    } catch(e) {
      throw new RpcException(e.response);
    }
  } 

}
