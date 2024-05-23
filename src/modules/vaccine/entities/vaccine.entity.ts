import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Vacunas_Det } from "./vaccine.det.entity";

@Entity()
export class Vacunas {
    @PrimaryGeneratedColumn()
    Codigo_Vacuna: number;

    @Column()
    Nombre_Vacuna: string;

    @Column()
    Comentarios: string;

    @OneToMany(() => Vacunas_Det, vacunasDet => vacunasDet.Vacuna)
    Vacunas_Det: Vacunas_Det[];
}

