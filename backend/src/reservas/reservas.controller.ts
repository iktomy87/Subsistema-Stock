import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservaInputDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservasService) {}

  @Post('reservar')
  async reservar(@Body() reservaInput: ReservaInputDto) {
    return this.reservaService.reservar(reservaInput);
  }

  @Post('liberar')
  async liberar(@Body() liberacionInput: UpdateReservaDto) {
    return this.reservaService.liberar(liberacionInput);
  }

  @Get('reservas/:idReserva')
  async consultarReserva(@Param('idReserva', ParseIntPipe) idReserva: number) {
    return this.reservaService.consultarReserva(idReserva);
  }
}