import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../users/user.entity';
import { RefreshToken } from './refresh-token.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, RefreshToken]),
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? 'secret',
            signOptions: { expiresIn: '15m' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtStrategy],
})
export class AuthModule { }