import { IsString, IsNumber, IsArray, IsOptional, IsUrl, Min, IsPositive, ArrayNotEmpty, IsInt } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsNumber()
  @IsPositive()
  stockInicial: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  pesoKg?: number;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  imagenes?: string[];

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  categoriaIds?: number[];
}