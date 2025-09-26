import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from './entities/categoria.entity';
import { ImagenProducto } from './entities/imagen-producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private categoriasRepository: Repository<Categoria>,
    @InjectRepository(ImagenProducto)
    private imagenesRepository: Repository<ImagenProducto>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string, categoriaId?: number) {
    const skip = (page - 1) * limit;
    
    const query = this.productosRepository.createQueryBuilder('producto')
      .leftJoinAndSelect('producto.imagenes', 'imagenes')
      .leftJoinAndSelect('producto.categorias', 'categorias')
      .where('producto.activo = :activo', { activo: true });

    if (search) {
      query.andWhere('producto.nombre LIKE :search', { search: `%${search}%` });
    }

    if (categoriaId) {
      query.andWhere('categorias.id = :categoriaId', { categoriaId });
    }

    const [data, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('producto.fechaCreacion', 'DESC')
      .getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id, activo: true },
      relations: ['categorias', 'imagenes']
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async create(createProductoDto: CreateProductoDto): Promise<{ id: number; mensaje: string }> {
    const { categoriaIds, imagenes, ...productoData } = createProductoDto;

    // ✅ Validar que las categorías existen
    if (categoriaIds && categoriaIds.length > 0) {
      const categoriasCount = await this.categoriasRepository.count({
        where: { id: In(categoriaIds) }
      });
      
      if (categoriasCount !== categoriaIds.length) {
        throw new BadRequestException('Una o más categorías no existen');
      }
    }

    const producto = this.productosRepository.create({
      ...productoData,
      stockDisponible: productoData.stockInicial,
    });

    // Asignar categorías si se proporcionan
    if (categoriaIds && categoriaIds.length > 0) {
      const categorias = await this.categoriasRepository.findBy({
        id: In(categoriaIds)
      });
      producto.categorias = categorias;
    }

    const productoGuardado = await this.productosRepository.save(producto);

    // ✅ Corregir: Guardar imágenes correctamente
    if (imagenes && imagenes.length > 0) {
      const imagenesEntities = imagenes.map(url => 
        this.imagenesRepository.create({
          url: url, // ✅ Especificar la propiedad 'url'
          producto: productoGuardado // ✅ Usar la relación en lugar de productoId
        })
      );
      await this.imagenesRepository.save(imagenesEntities);
    }

    return {
      id: productoGuardado.id,
      mensaje: 'Producto creado exitosamente'
    };
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    
    const { categoriaIds, imagenes, ...productoData } = updateProductoDto;

    // ✅ Validar categorías si se proporcionan
    if (categoriaIds !== undefined) {
      if (categoriaIds.length > 0) {
        const categoriasCount = await this.categoriasRepository.count({
          where: { id: In(categoriaIds) }
        });
        
        if (categoriasCount !== categoriaIds.length) {
          throw new BadRequestException('Una o más categorías no existen');
        }
        
        const categorias = await this.categoriasRepository.findBy({ id: In(categoriaIds) });
        producto.categorias = categorias;
      } else {
        producto.categorias = [];
      }
    }

    // Actualizar datos básicos
    Object.assign(producto, productoData);

    // Actualizar stock disponible si se modifica stockInicial
    if (updateProductoDto.stockInicial !== undefined) {
      producto.stockDisponible = updateProductoDto.stockInicial;
    }

    await this.productosRepository.save(producto);

    // ✅ Corregir: Actualizar imágenes correctamente
    if (imagenes !== undefined) {
      // Eliminar imágenes existentes
      await this.imagenesRepository.delete({ producto: { id: id } });
      
      // Crear nuevas imágenes
      if (imagenes.length > 0) {
        const imagenesEntities = imagenes.map(url => 
          this.imagenesRepository.create({
            url: url,
            producto: producto
          })
        );
        await this.imagenesRepository.save(imagenesEntities);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    producto.activo = false;
    await this.productosRepository.save(producto);
  }

  // Método para verificar stock y reservar
  async verificarStock(productos: Array<{ idProducto: number; cantidad: number }>): Promise<boolean> {
    for (const item of productos) {
      const producto = await this.productosRepository.findOne({
        where: { id: item.idProducto, activo: true }
      });

      if (!producto || producto.stockDisponible < item.cantidad) {
        return false;
      }
    }
    return true;
  }

  async reservarStock(productos: Array<{ idProducto: number; cantidad: number }>): Promise<void> {
    for (const item of productos) {
      await this.productosRepository.decrement(
        { id: item.idProducto },
        'stockDisponible',
        item.cantidad
      );
    }
  }

  async liberarStock(productos: Array<{ idProducto: number; cantidad: number }>): Promise<void> {
    for (const item of productos) {
      await this.productosRepository.increment(
        { id: item.idProducto },
        'stockDisponible',
        item.cantidad
      );
    }
  }
}