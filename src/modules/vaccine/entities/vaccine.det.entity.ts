import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vacunas } from "./vaccine.entity";

@Entity()
export class Vacunas_Det{
    @PrimaryGeneratedColumn()
    Codigo_Mvd: number;

    @Column()
    Codigo_Mascota: number;

    @Column()
    Codigo_Vacuna: number;

    @Column({type: 'date'})
    Fecha_Aplicacion: Date;

    @ManyToOne(() => Vacunas, vacuna => vacuna.Vacunas_Det)
    @JoinColumn({name: "Codigo_Vacuna"})
    Vacuna: Vacunas;
}