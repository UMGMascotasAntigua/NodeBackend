import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Mascotas } from '../pet/entities/pet.entity';

@Entity()
export class Castracion {
  @PrimaryGeneratedColumn()
  Codigo_Castracion: number;

  @Column()
  Codigo_Mascota: number;

  @Column({type: 'datetime' })
  Fecha_Castracion: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Comentarios: string;

  @ManyToOne(() => Mascotas, mascota => mascota.Castraciones)
  @JoinColumn({ name: 'Codigo_Mascota' })
  Mascota: Mascotas;
}
