import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from 'src/utils/ApiResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from './user.model';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Perfil } from '../profile/profile.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Usuarios)
    private userRepository: Repository<Usuarios>,
    @InjectRepository(Perfil)
    private profileRepository: Repository<Perfil>,
    private jwtService: JwtService){}


    public async getInfoUser(user: any){
      const find = await this.userRepository.findOne({
        where: {
          Codigo_Usuario: Number(user)
        }
      });

      return new ApiResponse(true, "Información obtenida", find);
    }

    public async getProfileUser(user: any){
      const query = await this.userRepository.createQueryBuilder('usuario')
      .select(["usuario.Usuario", "perfil.Descripcion"])
      .innerJoin('usuario.Perfil', 'perfil')
      .where("usuario.Codigo_Usuario = :user", {user: user.sub})

      return await query.getOne();
    }

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
