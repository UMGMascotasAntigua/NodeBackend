import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from 'src/utils/ApiResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from './user.model';
import { Equal, Or, Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Usuarios)
    private userRepository: Repository<Usuarios>,
    private jwtService: JwtService){}


    public async getUserLevel(user: any){
      const find = await this.userRepository.findOne({
        where: {
          Codigo_Usuario: user.sub
        },
        relations: ['Perfil']
      });

      return await find;
    }

  public async Login(request: LoginDto): Promise<ApiResponse<string>>{
    const find = await this.userRepository.findOne({
      where: {
        Usuario: request.user
      }
    });
    if(find){
      const comparision = await bcrypt.compare(request.password, find.Clave);
      const payload = { sub: find.Codigo_Usuario, username: find.Usuario };
      if(comparision){
        const token = await this.jwtService.signAsync(payload);
        return new ApiResponse(true, "Sesión iniciada con éxito", token);
      }else{
        return new ApiResponse(false, "La clave o usuario no son válidos", null);
      }
    }else{
      return new ApiResponse(false, "El usuario no existe", null);
    }
    
  }

  public async Register(request: RegisterDto): Promise<ApiResponse<Usuarios>>{
    const find = await this.userRepository.findOne({
      where:[
        {
          Usuario: request.user
        },
        {
          Correo: request.email
        }
      ]
    });
    if(find){
      return new ApiResponse(false, "El usuario o correo electrónico ya fue tomado", null);
    }else{
      const creation = await this.userRepository.create();
      creation.Codigo_Perfil = request.profile;
      creation.Correo = request.email;
      creation.Fecha_Registro = new Date();
      creation.Nombre_Usuario = request.name;
      creation.Usuario = request.user;
      creation.Clave = await bcrypt.hashSync(request.password, 10);

      const save = await this.userRepository.save(creation);
      return new ApiResponse(true, "Usuario registrado correctamente", save);
    }
    
  }
}
