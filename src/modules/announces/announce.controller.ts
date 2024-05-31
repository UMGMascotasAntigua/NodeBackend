import { Body, Controller, FileTypeValidator, Get, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AnnounceService } from "./announce.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AddAnnounceDto } from "./dto/add-announce.dto";

@Controller('announce')
export class AnnounceController{

    constructor(private readonly announceService: AnnounceService){}

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

}