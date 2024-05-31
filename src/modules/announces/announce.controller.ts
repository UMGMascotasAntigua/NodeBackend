import { Body, Controller, FileTypeValidator, Get, Param, ParseFilePipe, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AnnounceService } from "./announce.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AddAnnounceDto } from "./dto/add-announce.dto";
import { ConfigService } from "@nestjs/config";
import { createReadStream, existsSync } from "fs";
import type { Response } from 'express';
import { join } from "path";

@Controller('announce')
export class AnnounceController{

    constructor(private readonly announceService: AnnounceService,
      private configService: ConfigService
    ){}

    @Get()
    public async getAll(){
        return await this.announceService.getAll();
    }

    
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public async addAnnounce(@UploadedFile(new ParseFilePipe({
        validators: [
          new FileTypeValidator({fileType: 'image/*'}),
        ]
      })) file: Express.Multer.File, @Body() request: AddAnnounceDto){
        return await this.announceService.addAnnounce(file, request);
    }


    @Get(":id")
    public async getPhoto(@Res({passthrough: true}) res: Response, @Param("id") id: string){
      const announce = await this.announceService.getOne(id);
      const savePath = this.configService.getOrThrow("UPLOADS_DIR", "./uploads");
      var file = null;
      if(!announce){
        file = createReadStream(join(savePath, "notfound.jpg"))
        res.set({
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="notfound.jpg"`
        })
        return new StreamableFile(file);
      }else{
        if(existsSync(join(savePath, announce.Imagen))){
          file = createReadStream(join(savePath, announce.Imagen));
          res.set({
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename="${announce.Imagen}"`
          })
          return new StreamableFile(file);
        }else{
          file = createReadStream(join(savePath, "notfound.jpg"))
          res.set({
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename="notfound.jpg"`
          })
          return new StreamableFile(file);
        } 
      }
    }
}