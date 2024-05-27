import { IsNumber } from "class-validator";

export class AdoptPetDto{
    @IsNumber()
    pet: number;

    
}