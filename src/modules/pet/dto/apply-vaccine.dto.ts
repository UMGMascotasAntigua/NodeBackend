import { IsDate, IsDateString, IsNumber } from "class-validator";

export class ApplyVaccineDto{
    @IsNumber()
    pet: number;

    @IsNumber()
    vaccine: number;

    @IsDateString()
    date: string;
}