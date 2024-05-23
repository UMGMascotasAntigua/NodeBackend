import { Module } from '@nestjs/common';
import { VaccineService } from './vaccine.service';
import { VaccineController } from './vaccine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacunas } from './entities/vaccine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacunas])],
  controllers: [VaccineController],
  providers: [VaccineService],
})
export class VaccineModule {}
