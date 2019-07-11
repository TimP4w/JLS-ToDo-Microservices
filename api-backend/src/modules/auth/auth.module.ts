import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../user/auth.constants';


@Module({
  imports: [
    ClientsModule.register([{ name: AUTH_SERVICE, transport: Transport.TCP, options: {port: 3001} }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: '8bM@$D$NHp8ZS9BV*CXrt$heUtACoC7Y#7MGWC3oa*Kg5nB%r&cboxmv7XtEi^U@BD%8tt!#WsTqzL#T#w&I!V6q2I%gsFCR#InkpV2DS!cyoGfNjD*4QS9FDp499#@6',
      signOptions: {
        expiresIn: 60 * 20,
      },
    },),
    
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

