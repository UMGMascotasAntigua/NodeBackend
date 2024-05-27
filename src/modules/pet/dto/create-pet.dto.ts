import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class CreatePetDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    @IsNotEmpty()
    public race: string;

    @IsString()
    @IsNotEmpty()
    public age: string;

    @IsString()
    @IsNotEmpty()
    public information: string;

    @IsString()
    @IsNotEmpty()
    public comments: string;

    @IsNumberString()
    public clasification: string;
}
