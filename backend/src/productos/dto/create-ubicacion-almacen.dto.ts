import { IsString, IsNumber, IsInt, IsNotEmpty} from 'class-validator';

export class CreateUbicacionAlmacenDto {
  @IsNumber()
  @IsInt()
  almacenId: number; 

  @IsString()
  @IsNotEmpty()
  estanteria: string;

  @IsString()
  @IsNotEmpty()
  pasillo: string;
  
  @IsNumber()
  @IsInt()
  nivel: number;
}