import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';



async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: "localhost",
      port: 3001
    }
  });
  app.listen(() => console.log('Auth Service is listening...'))
};

bootstrap();

