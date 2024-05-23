import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Mascotas } from './entities/pet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/utils/ApiResponse';

@Injectable()
export class PetService {

  constructor(@InjectRepository(Mascotas) private readonly petRepository: Repository<Mascotas>){}

  public async getPet(id: any): Promise<Mascotas>{
    const find = await this.petRepository.findOne({
      where: {
        Codigo_Mascota: id
      }
    });

    return await find;
  }

  public async create(createPetDto: CreatePetDto, file: Express.Multer.File): Promise<ApiResponse<Mascotas>> {
    try{
      const creation = await this.petRepository.create();
      creation.Nombre_Mascota = createPetDto.name;
      creation.Raza = createPetDto.race;
      creation.Informacion = createPetDto.information;
      creation.Foto = file.filename;
      creation.Comentarios = createPetDto.comments;
      creation.Edad = createPetDto.age;
      creation.Estado = createPetDto.state;
    
      await this.petRepository.save(creation);
      return new ApiResponse(true, "Mascota agregada!", creation);
    }catch(err){
      return new ApiResponse(false, "Error al agregar la mascota " + err, null);
    }
  }

  public async findAll(): Promise<ApiResponse<Mascotas>> {
    try{
      const find = await this.petRepository.find();
      return new ApiResponse(true, "Mascotas obtenidas", find)
    }catch(err){
      return new ApiResponse(false, "Error al obtener las mascotas: " + err, null)
    }
  }
}
