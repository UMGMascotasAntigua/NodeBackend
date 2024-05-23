import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Usuarios } from '../auth/user.model';

@Entity()
export class Perfil {
  @PrimaryGeneratedColumn()
  Codigo_Perfil: number;

  @Column()
  Descripcion: string;

  @OneToMany(() => Usuarios, usuario => usuario.Perfil)
  Usuarios: Usuarios[];
}
