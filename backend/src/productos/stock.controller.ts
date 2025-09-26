import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { StockService } from './stock.service';
import { ReservaInputDto } from './dto/reserva-input.dto';
import { LiberacionInputDto } from './dto/liberacion-input.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('reservar')
  async reservar(@Body() reservaInput: ReservaInputDto) {
    return this.stockService.reservar(reservaInput);
  }

  @Post('liberar')
  async liberar(@Body() liberacionInput: LiberacionInputDto) {
    return this.stockService.liberar(liberacionInput);
  }

  @Get('reservas/:idReserva')
  async consultarReserva(@Param('idReserva', ParseIntPipe) idReserva: number) {
    return this.stockService.consultarReserva(idReserva);
  }
}