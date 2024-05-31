import { IsDateString, IsEmail, IsString } from "class-validator";

export class AddAnnounceDto{
    @IsString()
    Tipo_Anuncio: string;

    @IsString()
    Titulo: string;

    @IsString()
    Descripcion: string;

    @IsDateString()
    Fecha_Evento: Date;

    @IsString()
    Lugar: string;

    @IsString()
    Telefono: string;

    @IsString()
    Email: string;
}