import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, ParseFilePipeBuilder, HttpStatus, UseGuards, FileTypeValidator } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/Auth.guard';
import { RolesGuard } from 'src/guards/Roles.guard';
import { Roles } from 'src/utils/rbac/roles.decorator';
import { Role } from 'src/utils/rbac/role.enum';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

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
}
