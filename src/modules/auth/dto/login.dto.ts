import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto{

    @IsString()
    @IsNotEmpty()
    public user: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
}