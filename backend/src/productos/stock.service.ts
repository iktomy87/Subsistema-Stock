import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { DetalleReserva } from './entities/detalle-reserva.entity';
import { ProductosService } from '../productos/productos.service';
import { ReservaInputDto } from './dto/reserva-input.dto';
import { LiberacionInputDto } from './dto/liberacion-input.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,
    @InjectRepository(DetalleReserva)
    private detallesRepository: Repository<DetalleReserva>,
    private productosService: ProductosService,
  ) {}

  async reservar(reservaInput: ReservaInputDto) {
    // Verificar stock disponible
    const stockDisponible = await this.productosService.verificarStock(reservaInput.productos);
    
    if (!stockDisponible) {
      throw new ConflictException('Stock insuficiente para realizar la reserva');
    }

    // Crear reserva
    const reserva = this.reservasRepository.create({
      idCompra: reservaInput.idCompra,
      estado: 'confirmado',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
    });

    const reservaGuardada = await this.reservasRepository.save(reserva);

    // Crear detalles de reserva
    const detalles = reservaInput.productos.map(item =>
      this.detallesRepository.create({
        reservaId: reservaGuardada.id,
        productoId: item.idProducto,
        cantidad: item.cantidad,
      })
    );

    await this.detallesRepository.save(detalles);

    // Reservar stock
    await this.productosService.reservarStock(reservaInput.productos);

    return {
      idReserva: reservaGuardada.id,
      estado: reservaGuardada.estado,
      expiresAt: reservaGuardada.expiresAt,
    };
  }

  async liberar(liberacionInput: LiberacionInputDto) {
    const reserva = await this.reservasRepository.findOne({
      where: { id: liberacionInput.idReserva },
      relations: ['detalles']
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // Liberar stock
    const productos = reserva.detalles.map(detalle => ({
      idProducto: detalle.productoId,
      cantidad: detalle.cantidad,
    }));

    await this.productosService.liberarStock(productos);

    // Actualizar estado de la reserva
    reserva.estado = 'cancelado';
    await this.reservasRepository.save(reserva);

    return {
      mensaje: 'Stock liberado exitosamente',
    };
  }

  async consultarReserva(idReserva: number) {
    const reserva = await this.reservasRepository.findOne({
      where: { id: idReserva },
      relations: ['detalles']
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return {
      idReserva: reserva.id,
      estado: reserva.estado,
      expiresAt: reserva.expiresAt,
    };
  }
}