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
import { AdoptPetDto } from './dto/adopt-pet.dto';
import { FilterDto, FiltersDto } from './dto/find-filters.dto';
import { DeleteCastrationDto } from './dto/delete-castration.dto';


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

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Administrator)
  @UseInterceptors(FileInterceptor('file'))
  update(@Param("id") id: string, @Body() request: CreatePetDto){
    return this.petService.updatePet(Number(id), request);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Administrator)
  public async deletePet(@Param("id") id: number){
    return this.petService.deletePet(id);
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
  }


  @Patch('favorite')
  @UseGuards(AuthGuard)
  public async addToFavorites(@Body() request: {pet: number}, @Req() req){
    return this.petService.addPetToFavorites(request.pet, req);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Administrator)
  @Patch('vaccines/apply')
  public async applyVaccineToPet(@Body() request: ApplyVaccineDto){
    return this.vaccineService.applyToPet(request.pet, request.vaccine, request.date);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Administrator)
  @Delete('vaccines/delete')
  public async deletePetVaccine(@Body() request: {mvd: number}){
    return this.vaccineService.deletePetVaccine(request.mvd);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Administrator)
  @Patch('castration/add')
  public async addCastration(@Body() request: AddCastrationDto){
    return this.petService.addCastration(request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Administrator)
  @Delete('castration/delete')
  public async deleteCastration(@Body() request: DeleteCastrationDto){
    return this.petService.deleteCastration(request);
  }

  @Post('adopt')
  public async adoptPet(@Body() request: AdoptPetDto){
    
  }

  @Post('filter')
  public async findWithFilters(@Body() filters: FiltersDto){
    return await this.petService.findWithFilters(filters);
  }

  @Get('vaccines/:id')
  public async getPetVaccines(@Param("id") id: number){
    return this.vaccineService.getPetVaccines(id);
  }

}
