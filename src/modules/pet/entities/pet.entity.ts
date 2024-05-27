import { Clasificacion } from 'src/modules/clasification/entities/clasification.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Favoritos } from './favorite.entity';
import { Castracion } from 'src/modules/castration/castration.entity';
import { Vacunas_Det } from 'src/modules/vaccine/entities/vaccine.det.entity';
import { Citas_Enc } from './citas_enc.entity';
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
  Clasificacion: Clasificacion;

  @OneToMany(() => Favoritos, favoritos => favoritos.Mascota)
  Favoritos: Favoritos[];

  @OneToMany(() => Castracion, castracion => castracion.Mascota)
  Castraciones: Castracion[];

  @OneToMany(() => Vacunas_Det, vacunasDet => vacunasDet.Mascota)
  Vacunas_Det: Vacunas_Det[];

  @OneToMany(() => Citas_Enc, citasEnc => citasEnc.Usuario)
  Citas_Enc: Citas_Enc[];
}
