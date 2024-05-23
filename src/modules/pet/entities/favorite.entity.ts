import { Usuarios } from "src/modules/auth/user.model";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Mascotas } from "./pet.entity";


@Entity()
export class Favoritos{
    @PrimaryGeneratedColumn()
    Codigo: number;

    @Column()
    Codigo_Usuario: number;

    @Column()
    Codigo_Mascota: number;

    @ManyToOne(() => Usuarios, usuario => usuario.Favoritos)
    @JoinColumn({ name: 'Codigo_Usuario' })
    Usuario: Usuarios;

    @ManyToOne(() => Mascotas, mascota => mascota.Favoritos)
    @JoinColumn({ name: 'Codigo_Mascota' })
    Mascota: Mascotas;
}