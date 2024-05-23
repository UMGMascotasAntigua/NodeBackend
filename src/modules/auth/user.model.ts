import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Perfil } from '../profile/profile.entity';
// import { Perfil } from './Perfil';
// import { Favorito } from './Favorito';
// import { CitaEnc } from './CitaEnc';

@Entity()
export class Usuarios {
  @PrimaryGeneratedColumn()
  Codigo_Usuario: number;

  @Column()
  Usuario: string;

  @Column()
  Clave: string;

  @Column()
  Nombre_Usuario: string;

  @Column()
  Correo: string;

  @Column({ type: 'datetime' })
  Fecha_Registro: Date;

  @Column()
  Codigo_Perfil: number;

  @ManyToOne(() => Perfil, perfil => perfil.Usuarios)
  @JoinColumn({name: "Codigo_Perfil"})
  Perfil: Perfil;

//   @OneToMany(() => Favorito, favorito => favorito.usuario)
//   Favoritos: Favorito[];

//   @OneToMany(() => CitaEnc, citaEnc => citaEnc.usuario)
//   CitasEnc: CitaEnc[];
}