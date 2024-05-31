import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announce } from './announce.entity';
import { AnnounceController } from './announce.controller';
import { AnnounceService } from './announce.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Module({
    imports: [
        TypeOrmModule.forFeature([Announce]),
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
    controllers: [AnnounceController],
    providers: [AnnounceService]
})
export class AnnouncesModule {}
