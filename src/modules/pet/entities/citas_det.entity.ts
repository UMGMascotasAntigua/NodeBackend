import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Citas_Enc } from "./citas_enc.entity";

@Entity()
export class Citas_Det{
    @PrimaryGeneratedColumn()
    Numero_Linea: number;

    @Column()
    Id_Cita: number;

    @Column()
    Codigo_Mascota: number;

    @Column()
    Nombre_Mascota: string;

    @ManyToOne(() => Citas_Enc, citasEnc => citasEnc.CitasDet)
    Cita: Citas_Enc;
}