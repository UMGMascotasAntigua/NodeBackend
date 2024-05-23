import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mascotas } from './entities/pet.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { Perfil } from '../profile/profile.entity';
import { Usuarios } from '../auth/user.model';
import { AuthService } from '../auth/auth.service';
import { Favoritos } from './entities/favorite.entity';
import { Vacunas } from '../vaccine/entities/vaccine.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Mascotas, Perfil, Usuarios, Favoritos, Vacunas]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async(cfg: ConfigService) => ({
        dest: cfg.getOrThrow<string>("UPLOADS_DIR", "./dest"),
        storage: diskStorage({
          destination: (req: any, file: any, cb:any) => {
            const path = process.env.UPLOADS_DIR;
            if(!existsSync(path)){
              mkdirSync(path);
            }
            cb(null, path);
          },
          filename: (req: any, file: any, cb: any) => {
            cb(null, `${uuidv4()}${extname(file.originalname)}`)
          }
        })
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [PetController],
  providers: [PetService, JwtService, AuthService],
})
export class PetModule {}
