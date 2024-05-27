import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Mascotas } from './entities/pet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/utils/ApiResponse';
import { Usuarios } from '../auth/user.model';
import { Favoritos } from './entities/favorite.entity';
import { Vacunas } from '../vaccine/entities/vaccine.entity';
import { AddCastrationDto } from './dto/add-castration.dto';
import { Castracion } from '../castration/castration.entity';

@Injectable()
export class PetService {

  constructor(@InjectRepository(Mascotas) private readonly petRepository: Repository<Mascotas>,
  @InjectRepository(Favoritos) private readonly favoriteRepository: Repository<Favoritos>,
  @InjectRepository(Vacunas) private readonly vaccineRepository: Repository<Vacunas>,
  @InjectRepository(Castracion) private readonly castrationRepository: Repository<Castracion>){}

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

  public async findAll(userid: number | null): Promise<ApiResponse<Mascotas>> {
    var result = null;
    try{
      const find = await this.petRepository.find({
        relations: ['Favoritos']
      });

      if(userid){
        const favs = await this.favoriteRepository.find({
          where: {
            Codigo_Usuario: userid
          }
        });
        const favArray = favs.map(fav => fav.Codigo_Mascota);

        result = find.map(mascota => ({
          ...mascota,
          isFavorite: favArray.includes(mascota.Codigo_Mascota)
        }));

        return new ApiResponse(true, "Mascotas obtenidas", result)
      }else{
        result = find.map(mascota => ({
          ...mascota
        }));

        return new ApiResponse(true, "Mascotas obtenidas", result)
      }
      
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
        await this.favoriteRepository.delete(find);
        return new ApiResponse(true, "Mascota removida de favoritos.", find)
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

  public async addCastration(request: AddCastrationDto) : Promise<ApiResponse<any>>{
    try{
      const creation = await this.castrationRepository.create();
      creation.Codigo_Mascota = request.pet;
      creation.Comentarios = request.comments;
      creation.Fecha_Castracion = request.date;

      await this.castrationRepository.save(creation);
      return new ApiResponse(true, "Castración agregada", creation);
    }catch(err){
      return new ApiResponse(false, "Error al agregar la castración.", null);
    }
    
  }

  public async getPetVaccines(){
    try{
      // const find = await this.vaccineRepository.find({
      //   where: {

      //   }
      // })
    }catch(err){
      return new ApiResponse(false, "Error al obtener las vacunas de la mascota" + err, null)
    }
  }
}
