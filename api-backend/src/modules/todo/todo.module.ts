import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TODO_SERVICE } from './todo.constants';


@Module({
  imports: [
      ClientsModule.register([{ name: TODO_SERVICE, transport: Transport.TCP, options: {port: 3002} }]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      UserModule,

  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {

}
