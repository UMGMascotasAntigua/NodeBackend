import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword } from "class-validator";

export class RegisterDto{

    @IsString()
    @IsNotEmpty()
    public user: string;

    @IsString()
    @IsStrongPassword({minLength: 8})
    public password: string;

    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    @IsEmail()
    public email: string;

    @IsNumber()
    public profile: number;
}