import { Clasificacion } from 'src/modules/clasification/entities/clasification.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Favoritos } from './favorite.entity';
import { Castracion } from 'src/modules/castration/castration.entity';
@Entity()
export class Mascotas {
  @PrimaryGeneratedColumn()
  Codigo_Mascota: number;

  @Column()
  Nombre_Mascota: string;

  @Column()
  Raza: string;

  @Column()
  Edad: string;

  @Column()
  Estado: string;

  @Column()
  Foto: string;

  @Column()
  Informacion: string;

  @Column()
  Comentarios: string;

  @ManyToOne(() => Clasificacion, clasificacion => clasificacion.Mascotas)
  @JoinColumn({name: 'Clasificacion'})
  ClasificacionNav: Clasificacion;

  @OneToMany(() => Favoritos, favoritos => favoritos.Mascota)
  Favoritos: Favoritos[];

  @OneToMany(() => Castracion, castracion => castracion.Mascota)
  Castraciones: Castracion[];

//   @OneToMany(() => VacunaDet, vacunaDet => vacunaDet.mascota)
//   VacunasDet: VacunaDet[];

//   @OneToMany(() => Castracion, castracion => castracion.mascota)
//   Castraciones: Castracion[];

//   @OneToMany(() => Favorito, favorito => favorito.mascota)
//   Favoritos: Favorito[];

//   @OneToMany(() => CitaDet, citaDet => citaDet.mascota)
//   CitasDet: CitaDet[];
}
