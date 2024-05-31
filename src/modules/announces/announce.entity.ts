import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Announce{
    @PrimaryGeneratedColumn()
    Codigo_Anuncio: number;

    @Column({length: 100, type: 'varchar'})
    Tipo_Anuncio: string;

    @Column({length: 100, type: 'varchar'})
    Titulo: string;

    @Column({type: 'text'})
    Descripcion: string;

    @Column({type: 'date'})
    Fecha_Evento: Date;

    @Column({length: 200, type: 'varchar'})
    Lugar: string;

    @Column({length: 15, type: 'varchar'})
    Telefono: string;

    @Column({length: 100, type: 'varchar'})
    Email: string;

    @Column({type: 'datetime'})
    Fecha_Creacion: Date;

    @Column({type: 'nvarchar', length: 255})
    Imagen: string;
}