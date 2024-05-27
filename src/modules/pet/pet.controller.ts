import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, ParseFilePipeBuilder, HttpStatus, UseGuards, FileTypeValidator, Res, StreamableFile, BadRequestException, Req } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/Auth.guard';
import { RolesGuard } from 'src/guards/Roles.guard';
import { Roles } from 'src/utils/rbac/roles.decorator';
import { Role } from 'src/utils/rbac/role.enum';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { VaccineService } from '../vaccine/vaccine.service';
import { ApplyVaccineDto } from './dto/apply-vaccine.dto';
import { AddCastrationDto } from './dto/add-castration.dto';


@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService, private readonly configService: ConfigService,
    private readonly vaccineService: VaccineService
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Administrator)
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createPetDto: CreatePetDto, 
  @UploadedFile(new ParseFilePipe({
    validators: [
      new FileTypeValidator({fileType: 'image/*'}),
    ]
  })) file: Express.Multer.File) {
    return this.petService.create(createPetDto, file);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req?:any) {
    const user = req.user ? req.user.sub : null;
    return this.petService.findAll(user);
  }

  @Get('photo/:id')
  public async getPetPhoto(@Res({passthrough: true}) res: Response, @Param("id") id: string): Promise<StreamableFile>{
    const pet = await this.petService.getPet(id);
    const savePath = this.configService.getOrThrow("UPLOADS_DIR", "./uploads");
    var file = null;
    if(!pet){
      file = createReadStream(join(savePath, "notfound.jpg"))
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="notfound.jpg"`
      })
      return new StreamableFile(file);
    }else{
      if(existsSync(join(savePath, pet.Foto))){
        file = createReadStream(join(savePath, pet.Foto));
        res.set({
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="${pet.Foto}"`
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
    // console.log(pet);
    
  }


  @Patch('favorite')
  @UseGuards(AuthGuard)
  public async addToFavorites(@Body() request: {pet: number}, @Req() req){
    return this.petService.addPetToFavorites(request.pet, req);
  }

  @Patch('vaccines/apply')
  public async applyVaccineToPet(@Body() request: ApplyVaccineDto){
    return this.vaccineService.applyToPet(request.pet, request.vaccine, request.date);
  }

  @Patch('castration/add')
  public async addCastration(@Body() request: AddCastrationDto){
    return this.petService.addCastration(request);
  }

  @Get('vaccines/:id')
  public async getPetVaccines(@Param("id") id: number){
    return this.vaccineService.getPetVaccines(id);
  }

}
