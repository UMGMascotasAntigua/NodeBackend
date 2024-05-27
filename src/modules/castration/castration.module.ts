import { Module } from '@nestjs/common';
import { CastrationService } from './castration.service';
import { CastrationController } from './castration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Castracion } from './castration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Castracion])
  ],
  controllers: [CastrationController],
  providers: [CastrationService],
})
export class CastrationModule {}
