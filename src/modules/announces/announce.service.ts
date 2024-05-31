import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Announce } from "./announce.entity";
import { Repository } from "typeorm";
import { ApiResponse } from "src/utils/ApiResponse";
import { AddAnnounceDto } from "./dto/add-announce.dto";

@Injectable()
export class AnnounceService{
    constructor(@InjectRepository(Announce) private readonly announceRepo: Repository<Announce>){

    }

    public async getAll() : Promise<ApiResponse<Announce>>{
        try{
            const find = await this.announceRepo.find();
            return new ApiResponse(true, "Anuncios obtenidos", find);
        }catch(err){
            return new ApiResponse(false, "Error al obtener los anuncios", null);
        }
    }

    public async addAnnounce(file: Express.Multer.File, request: AddAnnounceDto): Promise<ApiResponse<Announce>>{
        try{
            const creation = await this.announceRepo.create();
            creation.Descripcion = request.Descripcion;
            creation.Email = request.Email;
            creation.Fecha_Creacion = new Date();
            creation.Fecha_Evento = request.Fecha_Evento;
            creation.Lugar = request.Lugar;
            creation.Telefono = request.Telefono;
            creation.Tipo_Anuncio = request.Tipo_Anuncio;
            creation.Titulo = request.Titulo;
            creation.Imagen = file.filename;
            await this.announceRepo.save(creation);
            return new ApiResponse(true, "Anuncio añadido", creation);
        }catch(err){
            console.log(err)
            return new ApiResponse(false, "Error, no se pudo añadir el anuncio.", null);
        }
    }
}