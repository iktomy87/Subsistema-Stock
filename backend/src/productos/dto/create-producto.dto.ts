import { IsString, IsNumber, IsArray, IsOptional, Min, IsPositive, ArrayNotEmpty, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateDimensionesDto } from './create-dimensiones.dto';
import { CreateUbicacionAlmacenDto } from './create-ubicacion-almacen.dto';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precio: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stockInicial: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pesoKg?: number;

  @ValidateNested()
  @Type(() => CreateDimensionesDto)
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  dimensiones: CreateDimensionesDto;

  @ValidateNested()
  @Type(() => CreateUbicacionAlmacenDto)
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  ubicacion: CreateUbicacionAlmacenDto;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
        if (value === '') return [];
        return value.split(',').map(item => parseInt(item.trim(), 10));
    }
    return value;
  })
  categoriaIds?: number[];
}