import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Perfil } from './profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {

    constructor(@InjectRepository(Perfil) private readonly profileRepository: Repository<Perfil>){

    }

    public async getUserProfile(user: any){
        const find = await this.profileRepository.findOne({
            where:{
                Codigo_Perfil: user.profile
            }
        });

        return await find ?? null;
    }
}
