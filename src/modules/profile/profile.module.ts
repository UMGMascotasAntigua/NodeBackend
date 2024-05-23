import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfil } from './profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Perfil])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
