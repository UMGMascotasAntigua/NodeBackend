import { Injectable } from '@nestjs/common';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacunas } from './entities/vaccine.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/utils/ApiResponse';
import { Vacunas_Det } from './entities/vaccine.det.entity';

@Injectable()
export class VaccineService {

  constructor(@InjectRepository(Vacunas) private readonly vacunaRepository: Repository<Vacunas>,
  @InjectRepository(Vacunas_Det) private readonly vacunaDetRepository: Repository<Vacunas_Det>){}

  create(createVaccineDto: CreateVaccineDto) {
    return 'This action adds a new vaccine';
  }

  public async findAll(): Promise<ApiResponse<Vacunas>>{
    try{
      const find = await this.vacunaRepository.find();
      return new ApiResponse(true, "Vacunas obtenidas", find);
    }catch(err){
      return new ApiResponse(false, "Error al obtener vacunas: " + err, null);
    }
  }

  public async applyToPet(pet: number, vaccine: number, date: Date): Promise<ApiResponse<Vacunas>>{
    try{
      const apply = await this.vacunaDetRepository.create();
      apply.Codigo_Mascota = pet;
      apply.Codigo_Vacuna = vaccine;
      apply.Fecha_Aplicacion = date;

      await this.vacunaDetRepository.save(apply);
      return new ApiResponse(true, "Vacuna aplicada!", null);
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
