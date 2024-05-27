import { Mascotas } from 'src/modules/pet/entities/pet.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Clasificacion {
  @PrimaryGeneratedColumn()
  Codigo_Clasificacion: number;

  @Column()
  Descripcion: string;

  @OneToMany(() => Mascotas, mascota => mascota.Clasificacion)
  Mascotas: Mascotas[];
}
