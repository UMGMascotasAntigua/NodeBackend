import { IsNotEmpty, IsString } from "class-validator";

export class CreateVaccineDto {

    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsString()
    public comments: string;
}
