import { Module } from '@nestjs/common';
import { ClasificationService } from './clasification.service';
import { ClasificationController } from './clasification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clasificacion } from './entities/clasification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clasificacion])],
  controllers: [ClasificationController],
  providers: [ClasificationService],
})
export class ClasificationModule {}
