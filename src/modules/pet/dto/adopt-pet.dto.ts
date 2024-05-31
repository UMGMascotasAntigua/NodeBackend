import { IsDateString, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString } from "class-validator";
import { Usuarios } from "src/modules/auth/user.model";
import { Mascotas } from "../entities/pet.entity";

export class AdoptPetDto{
    @IsObject()
    @IsNotEmptyObject()
    User: Usuarios;

    @IsObject()
    @IsNotEmptyObject()
    Pet: Mascotas;

    @IsString()
    Address: string;

    @IsString()
    Phone: string;

    @IsDateString()
    Date_Recolection: Date;

    @IsString()
    Comments: string;
}