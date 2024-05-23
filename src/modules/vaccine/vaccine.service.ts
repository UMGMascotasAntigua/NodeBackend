import { Injectable } from '@nestjs/common';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacunas } from './entities/vaccine.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/utils/ApiResponse';

@Injectable()
export class VaccineService {

  constructor(@InjectRepository(Vacunas) private readonly vacunaRepository: Repository<Vacunas>){}

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
