import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Mascotas } from './entities/pet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/utils/ApiResponse';
import { Usuarios } from '../auth/user.model';
import { Favoritos } from './entities/favorite.entity';

@Injectable()
export class PetService {

  constructor(@InjectRepository(Mascotas) private readonly petRepository: Repository<Mascotas>,
  @InjectRepository(Favoritos) private readonly favoriteRepository: Repository<Favoritos>){}

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

  public async addPetToFavorites(pet: number, req): Promise<ApiResponse<Favoritos>>{
    try{
      const find = await this.favoriteRepository.findOne({
        where: {
          Codigo_Mascota: pet,
          Codigo_Usuario: req.sub
        }
      });

      if(find){
        return new ApiResponse(false, "La mascota ya fue agregada a favoritos", null)
      }else{
        const creation = await this.favoriteRepository.create();
        creation.Codigo_Mascota = pet;
        creation.Codigo_Usuario = req.user.sub
        await this.favoriteRepository.save(creation);
        return new ApiResponse(true, "Mascota agregada a favoritos.", find)
      }
    }catch(err){
      return new ApiResponse(false, "Error al agregar a favoritos" + err, null)
    }
  }
}
