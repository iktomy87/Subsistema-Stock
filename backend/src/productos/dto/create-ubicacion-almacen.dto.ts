import { IsString, IsOptional } from 'class-validator';

export class CreateUbicacionAlmacenDto {
  @IsString()
  @IsOptional()
  pasillo?: string;

  @IsString()
  @IsOptional()
  estanteria?: string;

  @IsString()
  @IsOptional()
  estante?: string;

  @IsString()
  @IsOptional()
  caja?: string;
}