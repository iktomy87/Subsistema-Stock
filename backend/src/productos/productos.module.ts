import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { ImagenProducto } from './entities/imagen-producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CategoriasModule } from '../categorias/categorias.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, ImagenProducto, Categoria]),
    CategoriasModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}