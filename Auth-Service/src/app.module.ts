import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from 'nest-router';

import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'

import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenMiddleware } from './middlewares/refreshToken.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/todo'),
    AuthModule, 
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
