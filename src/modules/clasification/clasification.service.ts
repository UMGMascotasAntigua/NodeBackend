import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clasificacion } from './entities/clasification.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/utils/ApiResponse';

@Injectable()
export class ClasificationService {

  constructor(@InjectRepository(Clasificacion) private readonly clasificationRepository: Repository<Clasificacion>){}

  public async findAll(): Promise<ApiResponse<Clasificacion>> {
    const find = await this.clasificationRepository.find();
    return new ApiResponse(true, "Clasificaciones obtenidas", find);
  }
}
