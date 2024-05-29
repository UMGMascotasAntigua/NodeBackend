import { Module } from '@nestjs/common';
import { VaccineService } from './vaccine.service';
import { VaccineController } from './vaccine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacunas } from './entities/vaccine.entity';
import { Vacunas_Det } from './entities/vaccine.det.entity';
import { JwtService } from '@nestjs/jwt';
import { Mascotas } from '../pet/entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacunas, Vacunas_Det, Mascotas])],
  controllers: [VaccineController],
  providers: [VaccineService, JwtService],
})
export class VaccineModule {}
