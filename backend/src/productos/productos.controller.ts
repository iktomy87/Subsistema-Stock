
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
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { PaginatedResponse } from './interfaces/pagination.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScopesGuard } from '../auth/scopes.guard';
import { Scopes } from '../auth/scopes.decorator';


@Controller('productos')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get('/')
  @Scopes('productos:read')
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') search?: string,
    @Query('categoriaId') categoriaId?: string,
  ): Promise<PaginatedResponse<Producto>> {

    const pageNum = page ? parseInt(page) : undefined;
    const limitNum = limit ? parseInt(limit) : undefined;
    const categoriaIdNum = categoriaId ? parseInt(categoriaId) : undefined;
    
    return this.productosService.findAll(pageNum, limitNum, search, categoriaIdNum);
  }

  
  @Get('/:id')
  @Scopes('productos:read')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Producto> {

    return this.productosService.findOne(id);
  }
  
  @Post()
  @Scopes('productos:write')
  @UseInterceptors(FilesInterceptor('imagenes'))
  async create(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ id: number; mensaje: string }> {
    return this.productosService.create(createProductoDto, files);
  }

  @Patch(':id')
  @Scopes('productos:write')
  @UseInterceptors(FilesInterceptor('imagenes'))
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Producto> {
    return this.productosService.update(id, updateProductoDto, files);
  }

  @Delete(':id')
  @Scopes('productos:write')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productosService.remove(id);
  }
}