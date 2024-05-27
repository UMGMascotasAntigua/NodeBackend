import { Injectable } from '@nestjs/common';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacunas } from './entities/vaccine.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/utils/ApiResponse';
import { Vacunas_Det } from './entities/vaccine.det.entity';
import { AddCastrationDto } from '../pet/dto/add-castration.dto';
import { Castracion } from '../castration/castration.entity';

@Injectable()
export class VaccineService {

  constructor(@InjectRepository(Vacunas) private readonly vacunaRepository: Repository<Vacunas>,
  @InjectRepository(Vacunas_Det) private readonly vacunaDetRepository: Repository<Vacunas_Det>){}

  public async create(createVaccineDto: CreateVaccineDto) {
    const creation = await this.vacunaRepository.create();

    creation.Nombre_Vacuna = createVaccineDto.name;
    creation.Comentarios = createVaccineDto.comments;

    try{
      await this.vacunaRepository.save(creation);
      return new ApiResponse(true, "Vacuna guardada", creation);
    }catch(err){
      return new ApiResponse(false, "Error al guardar la vacuna", null);
    }
  }

  public async findAll(): Promise<ApiResponse<Vacunas>>{
    try{
      const find = await this.vacunaRepository.find();
      return new ApiResponse(true, "Vacunas obtenidas", find);
    }catch(err){
      return new ApiResponse(false, "Error al obtener vacunas: " + err, null);
    }
  }

  public async applyToPet(pet: number, vaccine: number, date: Date): Promise<ApiResponse<Vacunas_Det>>{
    try{
      const apply = await this.vacunaDetRepository.create();
      apply.Codigo_Mascota = pet;
      apply.Codigo_Vacuna = vaccine;
      apply.Fecha_Aplicacion = date;

      await this.vacunaDetRepository.save(apply);
      return new ApiResponse(true, "Vacuna aplicada!", apply);
    }catch(err){
      return new ApiResponse(false, "Error al aplicar la vacuna" + err, null);
    }
  }

  public async getPetVaccines(pet: number):  Promise<ApiResponse<Vacunas>>{
    try{
      const find = await this.vacunaRepository.createQueryBuilder('vacunas')
      .innerJoin('vacunas.Vacunas_Det', 'vacunasDet')
      .where('vacunasDet.Codigo_Mascota = :pet', { pet })
      .getMany();

      return new ApiResponse(true, "Vacunas obtenidas", find);
    }catch(err){
      return new ApiResponse(false, "Error al obtener las vacunas" + err, null);
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} vaccine`;
  }

  update(id: number, updateVaccineDto: UpdateVaccineDto) {
    return `This action updates a #${id} vaccine`;
  }

  remove(id: number) {
    return `This action removes a #${id} vaccine`;
  }
}
