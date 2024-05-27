import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Citas_Det } from "./citas_det.entity";
import { Usuarios } from "src/modules/auth/user.model";
import { Mascotas } from "./pet.entity";

@Entity()
export class Citas_Enc{
    @PrimaryGeneratedColumn()
    Id_Cita: number;

    @Column()
    Codigo_Usuario: number;

    @Column()
    Nombre_Usuario: string;

    @Column()
    Direccion : string;

    @Column()
    Telefono: string;

    @Column('datetime')
    Fecha: Date;

    @Column('datetime')
    Fecha_Recoleccion: Date;

    @Column()
    Comentarios: string;

    @Column()
    Estado: string;

    @OneToMany(() => Citas_Det, citasDet => citasDet.Cita)
    CitasDet: Citas_Det[];

    @ManyToOne(() => Usuarios, usuario => usuario.Citas_Enc)
    @JoinColumn({name: "Codigo_Usuario"})
    Usuario: Usuarios;

}