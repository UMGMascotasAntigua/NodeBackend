import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from 'src/utils/ApiResponse';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public Login(@Body() request: LoginDto){
    try{
      return this.authService.Login(request);
    }catch{
      return new ApiResponse(false, "Error al loggearse", null);
    }
  }


  @Post('register')
  public Register(@Body() request: RegisterDto){
    try{
      return this.authService.Register(request);
    }catch{
      return new ApiResponse(false, "Error al crear el usuario", null);
    }
  }
}
