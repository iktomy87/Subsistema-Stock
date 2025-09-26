import { IsInt, IsString } from 'class-validator';

export class LiberacionInputDto {
  @IsInt()
  idReserva: number;

  @IsString()
  motivo: string;
}