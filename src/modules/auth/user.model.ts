import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Perfil } from '../profile/profile.entity';
import { Favoritos } from '../pet/entities/favorite.entity';
import { Citas_Enc } from '../pet/entities/citas_enc.entity';
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

  @OneToMany(() => Favoritos, favorito => favorito.Usuario)
  Favoritos: Favoritos[];

  @OneToMany(() => Citas_Enc, citasEnc => citasEnc.Usuario)
  Citas_Enc: Citas_Enc[];
//   @OneToMany(() => CitaEnc, citaEnc => citaEnc.usuario)
//   CitasEnc: CitaEnc[];
}
