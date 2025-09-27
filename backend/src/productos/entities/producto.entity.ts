import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Categoria } from './categoria.entity';
import { ImagenProducto } from './imagen-producto.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'float' })
  precio: number;

  @Column({ name: 'stock_disponible', default: 0 })
  stockDisponible: number;

  @Column({ name: 'peso_kg', type: 'float', nullable: true })
  pesoKg: number;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => ImagenProducto, imagen => imagen.producto, { cascade: true })
  imagenes: ImagenProducto[];

  @ManyToMany(() => Categoria, categoria => categoria.productos, { cascade: true })
  @JoinTable({
    name: 'producto_categorias',
    joinColumn: { name: 'producto_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoria_id', referencedColumnName: 'id' }
  })
  categorias: Categoria[];
}