import { Module } from '@nestjs/common';
import { VaccineService } from './vaccine.service';
import { VaccineController } from './vaccine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacunas } from './entities/vaccine.entity';
import { Vacunas_Det } from './entities/vaccine.det.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacunas, Vacunas_Det])],
  controllers: [VaccineController],
  providers: [VaccineService],
})
export class VaccineModule {}
