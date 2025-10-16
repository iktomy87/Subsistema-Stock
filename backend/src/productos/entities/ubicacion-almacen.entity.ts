import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm"
import { Producto } from "./producto.entity";

@Entity('ubicacion_almacen')
export class UbicacionAlmacen {
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column()
	street: string;

	@Column()
	city: string;

	@Column()
	state: string;

	@Column()
	postal_code: string;

	@Column()
	country: string;

	@OneToOne(() => Producto, producto => producto.ubicacion, { 
		onDelete: 'CASCADE'
	})
	@JoinColumn({name: 'producto_id'})
	producto: Producto;
}	