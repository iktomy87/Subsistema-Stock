import { IsString, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ProductoReservaDto {
  @IsInt()
  @Min(1)
  idProducto: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class ReservaInputDto {
  @IsString()
  idCompra: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoReservaDto)
  productos: ProductoReservaDto[];
}