import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm"
import { Producto } from "./producto.entity";

@Entity('ubicacion_almacen')
export class UbicacionAlmacen {
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column({type: 'integer'})
	almacenId: number;

	@Column()
	pasillo: string;

	@Column()
	estanteria: string;

	@Column({type: 'integer'})
	nivel: number;

	@OneToOne(() => Producto, producto => producto.ubicacion, { 
		onDelete: 'CASCADE'
	})
	@JoinColumn({name: 'producto_id'})
	producto: Producto;
}	