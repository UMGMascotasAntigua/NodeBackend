import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vacunas {
    @PrimaryGeneratedColumn()
    Codigo_Vacuna: number;

    @Column()
    Nombre_Vacuna: string;

    @Column()
    Comentarios: string;
}

