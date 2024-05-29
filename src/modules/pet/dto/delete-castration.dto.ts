import { IsNumber, IsPositive } from "class-validator";

export class DeleteCastrationDto{
    @IsNumber()
    @IsPositive()
    public Codigo_Castracion: number;

    @IsNumber()
    @IsPositive()
    public Codigo_Mascota: number;
}