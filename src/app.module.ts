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
        host: cfg.getOrThrow<string>("DB_HOST", "localhost"),
        port: cfg.getOrThrow<number>("DB_PORT", 1433),
        username: cfg.getOrThrow<string>("DB_USER", "developer"),
        password: cfg.getOrThrow<string>("DB_PWD", "developer"),
        database: cfg.getOrThrow<string>("DB_NAME", "MASCOTAS"),
        extra: {
          trustServerCertificate: true,
          trustedConnection: true,
          encrypt: false,
          options: {
            instanceName: "SQLEXPRESS"
          }
        },
        entities: [
          Perfil,
          Usuarios,
          Clasificacion,
          Mascotas,
          Favoritos,
          Vacunas
        ]
      }),
      inject: [ConfigService]
    }),
    ClasificationModule,
    PetModule,
    AuthModule,
    ProfileModule,
    VaccineModule
  ],
})
export class AppModule {}
