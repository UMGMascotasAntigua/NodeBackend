import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClasificationModule } from './modules/clasification/clasification.module';
import { PetModule } from './modules/pet/pet.module';
import { AuthModule } from './modules/auth/auth.module';
import { Usuarios } from './modules/auth/user.model';
import { Mascotas } from './modules/pet/entities/pet.entity';
import { Clasificacion } from './modules/clasification/entities/clasification.entity';
import { ProfileModule } from './modules/profile/profile.module';
import { Perfil } from './modules/profile/profile.entity';
import { VaccineModule } from './modules/vaccine/vaccine.module';
import { Favoritos } from './modules/pet/entities/favorite.entity';
import { Vacunas } from './modules/vaccine/entities/vaccine.entity';
import { Vacunas_Det } from './modules/vaccine/entities/vaccine.det.entity';
import { CastrationModule } from './modules/castration/castration.module';
import { Castracion } from './modules/castration/castration.entity';
import { Citas_Enc } from './modules/pet/entities/citas_enc.entity';
import { Citas_Det } from './modules/pet/entities/citas_det.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      expandVariables: true,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(cfg: ConfigService) => ({
        type: 'mssql',
        host: cfg.get<string>("DB_HOST"),
        port: cfg.get<number>("DB_PORT"),
        username: cfg.get<string>("DB_USER"),
        password: cfg.get<string>("DB_PWD"),
        database: cfg.getOrThrow<string>("DB_NAME"),
        synchronize: true,
        extra: {
          trustServerCertificate: true,
          trustedConnection: true,
          encrypt: false,
          options: {
            instanceName: "SQLEXPRESS"
          }
        },
        options: {
          instanceName: "SQLEXPRESS",
          useUTC: true
        },
        entities: [
          Perfil,
          Usuarios,
          Clasificacion,
          Mascotas,
          Favoritos,
          Vacunas,
          Vacunas_Det,
          Castracion,
          Citas_Enc,
          Citas_Det
        ]
      }),
      inject: [ConfigService]
    }),
    ClasificationModule,
    PetModule,
    AuthModule,
    ProfileModule,
    VaccineModule,
    CastrationModule
  ],
})
export class AppModule {}
