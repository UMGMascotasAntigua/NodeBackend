import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuarios]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async(cfg: ConfigService) => ({
        global: true,
        secret: cfg.get<string>('JWT_SECRET') ?? "admin123",
        signOptions: {
          expiresIn: cfg.get<string>('JWT_EXPIRES') ?? "3h"
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
