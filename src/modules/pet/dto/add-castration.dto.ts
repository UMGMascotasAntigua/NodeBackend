import { IsDate, IsDateString, IsNumber, IsString } from "class-validator";

export class AddCastrationDto{
    @IsNumber()
    pet: number;

    @IsString()
    comments: string;

    @IsDate()
    date: Date;
}