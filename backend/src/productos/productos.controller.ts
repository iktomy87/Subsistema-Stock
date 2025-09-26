import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Query, 
  ParseIntPipe, 
  DefaultValuePipe,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

// ✅ Definir interfaz de paginación si no existe
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('q') search?: string,
    @Query('categoriaId', new DefaultValuePipe(undefined), ParseIntPipe) categoriaId?: number,
  ): Promise<PaginatedResponse<Producto>> {
    // Aseguramos que los límites estén dentro del rango permitido
    limit = Math.max(1, Math.min(limit, 100));
    
    // Pasar categoriaId al servicio
    return this.productosService.findAll(page, limit, search, categoriaId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Producto> {

    return this.productosService.findOne(id);
  }

  @Post()
  async create(@Body() createProductoDto: CreateProductoDto): Promise<{ id: number; mensaje: string }> {
    // El servicio ya retorna el objeto correcto, solo retornar directamente
    return this.productosService.create(createProductoDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productosService.remove(id);
  }
}