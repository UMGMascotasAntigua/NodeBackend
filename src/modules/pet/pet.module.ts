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
import { Perfil } from '../profile/profile.entity';
import { Usuarios } from '../auth/user.model';
import { AuthService } from '../auth/auth.service';
import { Favoritos } from './entities/favorite.entity';
import { Vacunas } from '../vaccine/entities/vaccine.entity';
import { Vacunas_Det } from '../vaccine/entities/vaccine.det.entity';
import { VaccineService } from '../vaccine/vaccine.service';
import { Castracion } from '../castration/castration.entity';
import { Citas_Enc } from './entities/citas_enc.entity';
import { Citas_Det } from './entities/citas_det.entity';
import { Clasificacion } from '../clasification/entities/clasification.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/guards/Auth.guard';
import { RolesGuard } from 'src/guards/Roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mascotas, Perfil, Usuarios, Favoritos, Vacunas, Clasificacion, Vacunas_Det, Castracion, Citas_Enc, Citas_Det]),
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
    }),
    JwtModule
  ],
  controllers: [PetController],
  providers: [PetService, AuthService, VaccineService, AuthGuard, RolesGuard],
})
export class PetModule {}
