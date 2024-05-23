import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, ParseFilePipeBuilder, HttpStatus, UseGuards, FileTypeValidator, Res, StreamableFile, BadRequestException, Req } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/Auth.guard';
import { RolesGuard } from 'src/guards/Roles.guard';
import { Roles } from 'src/utils/rbac/roles.decorator';
import { Role } from 'src/utils/rbac/role.enum';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { VaccineService } from '../vaccine/vaccine.service';
import { ApplyVaccineDto } from './dto/apply-vaccine.dto';


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
  findAll() {
    return this.petService.findAll();
  }

  @Get('photo/:id')
  public async getPetPhoto(@Res({passthrough: true}) res: Response, @Param("id") id: string): Promise<StreamableFile>{
    const pet = await this.petService.getPet(id);
    if(!pet){
      throw new BadRequestException("La imagen buscada está asociada a una mascota inexistente");
    }
    // console.log(pet);
    const savePath = this.configService.getOrThrow("UPLOADS_DIR", "./uploads");
    const file = createReadStream(join(savePath, pet.Foto));

    
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${pet.Foto}"`
    })
    return new StreamableFile(file);
  }


  @Patch('favorite')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  public async addToFavorites(@Body() request: {pet: number}, @Req() req){
    return this.petService.addPetToFavorites(request.pet, req);
  }

  @Patch('vaccines/apply')
  public async applyVaccineToPet(@Body() request: ApplyVaccineDto){
    return this.vaccineService.applyToPet(request.pet, request.vaccine, new Date(request.date));
  }

  @Get('vaccines/:id')
  public async getPetVaccines(@Param("id") id: number){
    return this.vaccineService.getPetVaccines(id);
  }

}
