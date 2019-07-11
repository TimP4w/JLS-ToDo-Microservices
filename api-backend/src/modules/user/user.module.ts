import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from './auth.constants';

@Module({
  imports: [
      ClientsModule.register([{ name: AUTH_SERVICE, transport: Transport.TCP, options: {port: 3001} }]),

  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}