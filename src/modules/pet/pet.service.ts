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
import { FiltersDto } from './dto/find-filters.dto';
import { Clasificacion } from '../clasification/entities/clasification.entity';
import { DeleteCastrationDto } from './dto/delete-castration.dto';
import { Citas_Enc } from './entities/citas_enc.entity';
import { Citas_Det } from './entities/citas_det.entity';
import { AdoptPetDto } from './dto/adopt-pet.dto';

@Injectable()
export class PetService {

  constructor(@InjectRepository(Mascotas) private readonly petRepository: Repository<Mascotas>,
    @InjectRepository(Favoritos) private readonly favoriteRepository: Repository<Favoritos>,
    @InjectRepository(Vacunas) private readonly vaccineRepository: Repository<Vacunas>,
    @InjectRepository(Castracion) private readonly castrationRepository: Repository<Castracion>,
    @InjectRepository(Clasificacion) private readonly clasificationRepository: Repository<Clasificacion>,
    @InjectRepository(Citas_Enc) private readonly citasEncRepo: Repository<Citas_Enc>,
    @InjectRepository(Citas_Det) private readonly citasDet: Repository<Citas_Det>) { }

  public async adoptPet(request: AdoptPetDto) {
    try {

      const creation = await this.citasEncRepo.create();
      creation.Codigo_Usuario = request.User.Codigo_Usuario;
      creation.Nombre_Usuario = request.User.Nombre_Usuario;
      creation.Usuario = request.User;
      creation.Direccion = request.Address;
      creation.Telefono = request.Phone;
      creation.Fecha = new Date();
      creation.Fecha_Recoleccion = request.Date_Recolection;
      creation.Comentarios = request.Comments;
      creation.Estado = "Confirmada";
      await this.citasEncRepo.save(creation);

      const detCreation = await this.citasDet.create();
      detCreation.Cita = creation;
      detCreation.Codigo_Mascota = request.Pet.Codigo_Mascota;
      detCreation.Nombre_Mascota = request.Pet.Nombre_Mascota;
      detCreation.Id_Cita = creation.Id_Cita;
      await this.citasDet.save(detCreation);

      const petFind = await this.petRepository.findOne({
        where: {
          Codigo_Mascota: request.Pet.Codigo_Mascota
        }
      });
      petFind.Estado = "Adoptado";
      await this.petRepository.save(petFind);

      return new ApiResponse(true, "Adopción completada", creation);      
    } catch (err) {
      return new ApiResponse(false, "No se pudo completar la adopción: " + err, null);   
    }
  }


  public async getPet(id: any): Promise<Mascotas> {
    const find = await this.petRepository.findOne({
      where: {
        Codigo_Mascota: id
      }
    });

    return await find;
  }

  public async updatePet(id: number, update: CreatePetDto): Promise<ApiResponse<Mascotas>> {
    try {
      const find = await this.petRepository.findOne({
        where: {
          Codigo_Mascota: Number(id)
        }
      });

      if (find) {
        // Object.assign(find, update);
        find.Edad = update.age;
        find.Nombre_Mascota = update.name;
        find.Raza = update.race;
        find.Informacion = update.information;
        find.Comentarios = update.comments;
        find.Clasificacion = await this.clasificationRepository.findOne({
          where: {
            Codigo_Clasificacion: Number(update.clasification)
          }
        });

        await this.petRepository.save(find);
        return new ApiResponse(true, "Mascota actualizada con éxito", find);
      } else {
        return new ApiResponse(false, "La mascota no existe", null);
      }
    } catch (err) {
      return new ApiResponse(false, "Error al actualizar la mascota: " + err, null);
    }
  }

  public async deletePet(id: number): Promise<ApiResponse<Mascotas>> {
    try {
      const find = await this.petRepository.findOne({
        where: {
          Codigo_Mascota: id
        }
      });

      if (find) {
        await this.petRepository.delete(find);
        return new ApiResponse(true, "Mascota eliminada con éxito", null);
      } else {
        return new ApiResponse(false, "La mascota no existe", null);
      }
    } catch (err) {
      return new ApiResponse(false, `Error al eliminar la mascota: Verifique relaciones`, null);
    }
  }

  public async create(createPetDto: CreatePetDto, file: Express.Multer.File): Promise<ApiResponse<Mascotas>> {
    try {
      const creation = await this.petRepository.create();
      creation.Nombre_Mascota = createPetDto.name;
      creation.Raza = createPetDto.race;
      creation.Informacion = createPetDto.information;
      creation.Foto = file.filename;
      creation.Comentarios = createPetDto.comments;
      creation.Edad = createPetDto.age;
      creation.Estado = "Disponible";
      creation.Clasificacion = await this.clasificationRepository.findOne({
        where: {
          Codigo_Clasificacion: Number(createPetDto.clasification)
        }
      }) ?? null;

      await this.petRepository.save(creation);
      return new ApiResponse(true, "Mascota agregada!", creation);
    } catch (err) {
      return new ApiResponse(false, "Error al agregar la mascota " + err, null);
    }
  }

  public async generatePdf(cita: number, usuario: number) : Promise<ApiResponse<any>>{
    try{
      const citas = await this.citasEncRepo.createQueryBuilder('citas')
      .innerJoin('citas.Citas_Det', 'citas_det')
      .innerJoin('citas.Mascotas', 'mascotas')
      .where('citas.Codigo_Usuario = :usuario', {usuario: usuario})
      .andWhere("citas.Id_Cita = :cita", {cita: cita})
      .getMany();

      return new ApiResponse(false, "Error al generar el pdf", citas);
    }catch(err){
      console.log(err)
      return new ApiResponse(false, "Error al generar el pdf", null);
    }
  }

  public async findAll(userid: number | null): Promise<ApiResponse<Mascotas>> {
    var result = null;
    try {
      const find = await this.petRepository.createQueryBuilder('mascota')
        .leftJoinAndSelect('mascota.Clasificacion', 'clasificacion')
        .leftJoinAndSelect('mascota.Favoritos', 'favoritos')
        .leftJoinAndSelect('mascota.Castraciones', 'castraciones')
        .leftJoinAndSelect('mascota.Vacunas_Det', 'vacunasDet')
        .leftJoinAndSelect('vacunasDet.Vacuna', 'vacuna')
        .where('mascota.Estado = :estado', { estado: 'Disponible' })
        .getMany();

      if (userid) {
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
      } else {
        result = find.map(mascota => ({
          ...mascota
        }));

        return new ApiResponse(true, "Mascotas obtenidas", result)
      }

    } catch (err) {
      return new ApiResponse(false, "Error al obtener las mascotas: " + err, null)
    }
  }

  public async addPetToFavorites(pet: number, req): Promise<ApiResponse<Favoritos>> {
    try {
      const find = await this.favoriteRepository.findOne({
        where: {
          Codigo_Mascota: pet,
          Codigo_Usuario: req.sub
        }
      });
      if (find) {
        await this.favoriteRepository.remove(find);
        return new ApiResponse(true, "Mascota removida de favoritos.", find)
      } else {
        const creation = await this.favoriteRepository.create();
        creation.Codigo_Mascota = pet;
        creation.Codigo_Usuario = req['user'].sub
        await this.favoriteRepository.save(creation);
        return new ApiResponse(true, "Mascota agregada a favoritos.", find)
      }
    } catch (err) {
      return new ApiResponse(false, "Error al agregar a favoritos" + err, null)
    }
  }

  public async addCastration(request: AddCastrationDto): Promise<ApiResponse<any>> {
    try {
      const creation = await this.castrationRepository.create();
      creation.Codigo_Mascota = request.pet;
      creation.Comentarios = request.comments;
      creation.Fecha_Castracion = request.date;

      await this.castrationRepository.save(creation);
      return new ApiResponse(true, "Castración agregada", creation);
    } catch (err) {
      return new ApiResponse(false, "Error al agregar la castración.", null);
    }

  }

  public async deleteCastration(request: DeleteCastrationDto) {
    try {
      const find = await this.castrationRepository.findOne({
        where: {
          Codigo_Castracion: request.Codigo_Castracion,
          Codigo_Mascota: request.Codigo_Mascota
        }
      });

      if (find) {
        await this.castrationRepository.delete(find);
        return new ApiResponse(true, "Castración eliminada", {});
      } else {
        return new ApiResponse(false, "La castración no existe", {});
      }
    } catch (err) {
      return new ApiResponse(true, "Error al eliminar la castración: " + err, {});
    }
  }

  public async getPetVaccines() {
    try {
      // const find = await this.vaccineRepository.find({
      //   where: {

      //   }
      // })
    } catch (err) {
      return new ApiResponse(false, "Error al obtener las vacunas de la mascota" + err, null)
    }
  }

  public async findWithFilters(request: FiltersDto) {
    try {
      const queryBuilder = await this.petRepository.createQueryBuilder('mascota');

      let paramIndex = 0;
      request.filters.forEach(filter => {
        var { field, operator, value } = filter;
        field = field.toUpperCase();

        const parameterName = `${field.toLowerCase()}${paramIndex++}`;

        if (field === 'EDAD') {
          if (operator && value) {
            queryBuilder.andWhere(`mascota.${field} ${operator} :${parameterName}`, { [parameterName]: Number(value) });
          } else {
            queryBuilder.andWhere(`mascota.${field} = :${parameterName}`, { [parameterName]: Number(value) });
          }
        } else if (field === 'ESTADO') {
          queryBuilder.andWhere(`mascota.${field} = :${parameterName}`, { [parameterName]: value });
        } else if (field === 'RAZA') {
          value = value.trim();
          queryBuilder.andWhere(`mascota.${field} LIKE :${parameterName}`, { [parameterName]: `%${value.toLowerCase()}%` });
        } else if (field === 'CLASIFICACION') {
          queryBuilder.innerJoin('mascota.Clasificacion', 'clasificacion');
          queryBuilder.andWhere(`clasificacion.Descripcion LIKE :${parameterName}`, { [parameterName]: `%${value.toLowerCase()}%` });
        }
      })
      const result = await queryBuilder.getMany();
      // console.log(queryBuilder.getSql())
      // console.log(queryBuilder.getQueryAndParameters());
      return new ApiResponse(true, "Mascotas filtradas", result);
    } catch (err) {
      console.log(err);
      return new ApiResponse(false, "Error al filtrar las mascotas", null)
    }
  }
}
