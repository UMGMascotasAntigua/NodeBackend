import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from 'src/utils/ApiResponse';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from 'src/guards/Auth.guard';
import { RolesGuard } from 'src/guards/Roles.guard';
import { Roles } from 'src/utils/rbac/roles.decorator';
import { Role } from 'src/utils/rbac/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Administrator, Role.User)
  public async getProfile(@Req() req:any){
    return await this.authService.getProfileUser(req.user)
  }

  @Get('info')
  @UseGuards(AuthGuard)
  public async getUserInfo(@Req() req:any){
    return await this.authService.getInfoUser(req.user.sub);
  }

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
